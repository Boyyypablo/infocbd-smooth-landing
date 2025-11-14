import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/InfoCard";
import { Link } from "react-router-dom";
import { Leaf, Shield, Heart, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="w-4 h-4" />
                Bem-vindo ao infoCBD
              </span>
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Informação Completa sobre{" "}
              <span className="text-primary">CBD</span>
            </h1>
            
            <p 
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Descubra os benefícios do CBD com informações confiáveis e baseadas em ciência. 
              Sua jornada para o bem-estar começa aqui.
            </p>
            
            <div 
              className="flex justify-center animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link to="/formulario">
                <Button size="lg" className="group">
                  Saiba Mais
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div 
              className="text-center mb-16 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Por que escolher o CBD?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça os principais benefícios respaldados pela ciência
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <InfoCard
                icon={<Leaf className="w-7 h-7" />}
                title="Natural e Puro"
                description="Produtos extraídos de plantas cultivadas organicamente, sem aditivos químicos prejudiciais. Garantimos qualidade em cada etapa do processo."
                delay="0.5s"
              />
              
              <InfoCard
                icon={<Shield className="w-7 h-7" />}
                title="Segurança Comprovada"
                description="Todos os nossos produtos são testados em laboratórios certificados, garantindo pureza, potência e ausência de contaminantes."
                delay="0.6s"
              />
              
              <InfoCard
                icon={<Heart className="w-7 h-7" />}
                title="Bem-estar Total"
                description="CBD contribui para o equilíbrio do corpo, ajudando no relaxamento, qualidade do sono e alívio de tensões do dia a dia."
                delay="0.7s"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div 
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-3xl p-12 md:p-16 text-center shadow-[var(--shadow-soft)] animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para conhecer mais?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Entre em contato conosco através do nosso formulário e tire todas as suas dúvidas sobre CBD.
            </p>
            <Link to="/formulario">
              <Button size="lg" className="group">
                Preencher Formulário
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 infoCBD. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
