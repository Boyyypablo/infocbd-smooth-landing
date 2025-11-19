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

  // Escutar eventos do Typeform para redirecionar após conclusão
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('typeform.com')) return;

      const data = event.data;
      
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
      
      // Quando o formulário for completado, redirecionar para processamento
      if (isFormComplete) {
        console.log('✅ Form completed!', data);
        
        // Extrair nome e CPF das respostas (se disponível)
        const formResponse = data.form_response || data.response || data;
        let nome = '';
        let cpf = '';

        if (formResponse && formResponse.answers) {
          formResponse.answers.forEach((answer: any) => {
            const fieldRef = (answer.field?.ref || '').toLowerCase();
            const fieldVariable = (answer.field?.variable || '').toLowerCase();
            const fieldId = (answer.field?.id || '').toLowerCase();
            const fieldTitle = (answer.field?.title || '').toLowerCase();
            
            let answerValue = '';
            if (answer.text) answerValue = answer.text;
            else if (answer.email) answerValue = answer.email;
            else if (answer.phone_number) answerValue = answer.phone_number;
            else if (answer.choice?.label) answerValue = answer.choice.label;
            else if (answer.choice?.other) answerValue = answer.choice.other;
            else if (answer.number) answerValue = String(answer.number);
            else if (answer.date) answerValue = answer.date;
            
            if (
              fieldRef.includes('nome') ||
              fieldVariable.includes('nome') ||
              fieldId.includes('nome') ||
              fieldTitle.includes('nome') ||
              fieldTitle.includes('name') ||
              fieldTitle.includes('paciente')
            ) {
              nome = answerValue || nome;
            }
            
            if (
              fieldRef.includes('cpf') ||
              fieldVariable.includes('cpf') ||
              fieldId.includes('cpf') ||
              fieldTitle.includes('cpf') ||
              fieldTitle.includes('documento') ||
              fieldTitle.includes('identidade') ||
              answerValue.match(/\d{3}[.-]?\d{3}[.-]?\d{3}[.-]?\d{2}/)
            ) {
              cpf = answerValue || cpf;
            }
          });
        }

        // Tentar buscar em hidden fields, variables, etc.
        if ((!nome || !cpf) && formResponse?.hidden) {
          const hidden = formResponse.hidden;
          nome = hidden.nome || hidden.name || hidden.paciente || nome;
          cpf = hidden.cpf || hidden.cpf_number || hidden.documento || cpf;
        }

        if ((!nome || !cpf) && formResponse?.variables) {
          const variables = formResponse.variables;
          nome = variables.nome || variables.name || variables.paciente || nome;
          cpf = variables.cpf || variables.cpf_number || variables.documento || cpf;
        }

        console.log('Extracted data - Nome:', nome, 'CPF:', cpf);

        // Redirecionar para página de processamento
        navigate('/processamento', {
          state: { nome: nome || 'Não informado', cpf: cpf || 'Não informado' }
        });
      }
    };

    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage, false);

    return () => {
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
