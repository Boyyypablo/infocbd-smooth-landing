import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const Formulario = () => {
  useEffect(() => {
    // Remove any existing TypeForm scripts and widgets first
    const existingScript = document.querySelector('script[src*="typeform.com"]');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }
    
    // Clean up any existing TypeForm widgets
    const typeformWidgets = document.querySelectorAll('[data-tf-widget], [data-tf-live]');
    typeformWidgets.forEach((widget) => {
      if (widget.parentNode) {
        widget.innerHTML = '';
      }
    });

    // Create new script
    const script = document.createElement('script');
    script.src = '//embed.typeform.com/next/embed.js';
    script.async = true;
    script.id = 'typeform-embed-script';
    document.body.appendChild(script);

    return () => {
      // Cleanup script
      const scriptToRemove = document.getElementById('typeform-embed-script');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
      
      // Clean up all TypeForm widgets and iframes
      const allTypeformElements = document.querySelectorAll('[data-tf-widget], [data-tf-live], iframe[src*="typeform.com"]');
      allTypeformElements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      
      // Clean up any TypeForm global objects
      if (window.tf) {
        delete (window as any).tf;
      }
    };
  }, []);

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
            data-tf-live="01KA19WXZW6FQXRD4B7BE27W3S"
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
