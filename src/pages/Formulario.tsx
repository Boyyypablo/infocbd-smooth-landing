import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";

// Declaração de tipos para o Typeform
declare global {
  interface Window {
    tf?: {
      makePopup: (url: string, options: any) => any;
      embed: (element: HTMLElement, options: any) => any;
    };
  }
}

const Formulario = () => {
  const navigate = useNavigate();
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Carregar script do Typeform uma única vez
  useEffect(() => {
    // Remove any existing TypeForm scripts first
    const existingScript = document.querySelector('script[src*="typeform.com"]');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    // Limpar qualquer iframe antigo do Typeform
    const oldIframes = document.querySelectorAll('iframe[src*="typeform.com"]');
    oldIframes.forEach(iframe => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    });

    // Limpar qualquer elemento com data-tf-live antigo
    const oldTypeforms = document.querySelectorAll('[data-tf-live]:not([data-tf-live="01KACB9285W9X86T4MGHWNSH3K"])');
    oldTypeforms.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // Create new script
    const script = document.createElement('script');
    script.src = '//embed.typeform.com/next/embed.js';
    script.async = true;
    script.id = 'typeform-embed-script';
    document.body.appendChild(script);

    return () => {
      // Cleanup script apenas no unmount final
      const scriptToRemove = document.getElementById('typeform-embed-script');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  // Interceptar redirecionamentos do Typeform
  useEffect(() => {
    let redirectBlocked = false;
    
    // Interceptar mudanças na URL antes que o redirecionamento aconteça
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      const url = args[2]?.toString() || '';
      // Se o Typeform tentar redirecionar, interceptar
      if (!redirectBlocked && (url.includes('typeform.com/to/') || url.includes('wa.me') || url.includes('whatsapp'))) {
        console.log('🚫 Intercepted pushState redirect to:', url);
        redirectBlocked = true;
        navigate('/analise-medica', { replace: true });
        return;
      }
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      const url = args[2]?.toString() || '';
      if (!redirectBlocked && (url.includes('typeform.com/to/') || url.includes('wa.me') || url.includes('whatsapp'))) {
        console.log('🚫 Intercepted replaceState redirect to:', url);
        redirectBlocked = true;
        navigate('/analise-medica', { replace: true });
        return;
      }
      return originalReplaceState.apply(history, args);
    };

    // Interceptar window.location changes
    const checkLocation = () => {
      if (redirectBlocked) return;
      const currentUrl = window.location.href;
      if (currentUrl.includes('typeform.com/to/') || currentUrl.includes('wa.me') || currentUrl.includes('whatsapp')) {
        redirectBlocked = true;
        console.log('🚫 Intercepted window.location redirect to:', currentUrl);
        navigate('/analise-medica', { replace: true });
      }
    };

    const locationCheckInterval = setInterval(checkLocation, 50);

    // Interceptar beforeunload para tentar prevenir redirecionamento
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentUrl = window.location.href;
      if (currentUrl.includes('wa.me') || currentUrl.includes('whatsapp')) {
        e.preventDefault();
        e.returnValue = '';
        navigate('/analise-medica', { replace: true });
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      clearInterval(locationCheckInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  // Escutar eventos do Typeform para redirecionar após conclusão
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('typeform.com')) return;

      const data = event.data;
      
      // Log todos os eventos para debug
      if (data.type) {
        console.log('📨 Typeform event:', data.type, data);
      }
      
      // Verificar diferentes formatos de eventos de conclusão
      const isFormComplete = 
        data.type === 'form-submit' || 
        data.type === 'form-complete' ||
        data.type === 'TF_FORM_COMPLETE' ||
        data.type === 'TF_FORM_SUBMIT' ||
        data.type === 'formSubmit' ||
        data.type === 'formComplete' ||
        (data.type === 'TF_EVENT' && data.event === 'form-complete') ||
        (data.type === 'TF_EVENT' && data.event === 'formSubmit') ||
        (data.event === 'form-complete') ||
        (data.event === 'formSubmit') ||
        (typeof data === 'object' && 'form_response' in data) ||
        (typeof data === 'object' && 'response' in data);
      
      // Quando o formulário for completado, redirecionar para análise médica
      if (isFormComplete) {
        console.log('✅ Form completed! Redirecting to medical analysis...');
        
        // Forçar redirecionamento imediatamente
        setTimeout(() => {
          navigate('/analise-medica', { replace: true });
        }, 100);
      }
    };

    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage, false);

    // Interceptar cliques em links do Typeform que possam redirecionar
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && (link.href.includes('wa.me') || link.href.includes('whatsapp') || link.href.includes('typeform.com/to/'))) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 Intercepted link click:', link.href);
        navigate('/analise-medica', { replace: true });
        return false;
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
        messageHandlerRef.current = null;
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Entre em Contato
            </h1>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário abaixo e entraremos em contato em breve
            </p>
          </div>

          {/* Typeform Embed */}
          <div 
            className="w-full rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] animate-fade-in"
            style={{ 
              minHeight: "600px",
              animationDelay: "0.2s"
            }}
            data-tf-live="01KACB9285W9X86T4MGHWNSH3K"
            data-tf-opacity="100"
            data-tf-hide-headers
            data-tf-hide-footer
            data-tf-transitive-search-params
            data-tf-medium="snippet"
            data-tf-redirect="false"
          ></div>

          <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p>Suas informações estão protegidas e serão tratadas com confidencialidade</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Formulario;
