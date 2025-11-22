import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91] flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-white/20 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Link to="/">
          <Button 
            size="lg" 
            className="bg-white text-[#6B2C91] hover:bg-white/90 text-lg px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
