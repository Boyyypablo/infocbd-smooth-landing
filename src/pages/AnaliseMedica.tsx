import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const AnaliseMedica = () => {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(false);

  const textLines = [
    "Seu caso foi cuidadosamente analisado pelo nosso médico especialista.",
    "Após revisar todas as informações fornecidas, foi realizada uma avaliação completa do seu perfil.",
    "O tratamento com cannabis medicinal foi avaliado e considerado adequado para o seu caso.",
    "Agora, vamos para a etapa de identificação e pagamento",
    "para liberação da receita e do medicamento."
  ];

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, []);

  useEffect(() => {
    // Animar linhas uma por vez
    textLines.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
      }, index * 1000); // 1 segundo entre cada linha
    });

    // Mostrar botão após todas as linhas aparecerem
    setTimeout(() => {
      setShowButton(true);
    }, textLines.length * 1000 + 500);
  }, []);

  const handleContinue = () => {
    navigate('/identificacao', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91] flex items-center justify-center px-6 py-12">
      <div className="container mx-auto max-w-3xl">
        {/* Card/Container para organizar conteúdo */}
        <div className="bg-[#F4E8D8]/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in border border-[#E8D5C0]/50">
          <div className="flex flex-col items-center">
            {/* Foto do Médico - Circular e Centralizada */}
            <div className="mb-8 md:mb-12">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <img
                  src="/pablo médico.jpg"
                  alt="Médico especialista"
                  className="w-full h-full rounded-full object-cover shadow-xl border-4 border-[#6B2C91]"
                />
              </div>
            </div>

            {/* Texto Animado */}
            <div className="text-center space-y-6 w-full">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#6B2C91] mb-8">
                Análise Médica Concluída
              </h2>
              
              <div className="space-y-5">
                {textLines.map((line, index) => (
                  <p
                    key={index}
                    className={`text-lg md:text-xl text-gray-700 font-medium leading-relaxed transition-all duration-500 ${
                      visibleLines.includes(index)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Botão */}
              <div
                className={`mt-10 transition-all duration-500 ${
                  showButton
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <Button
                  onClick={handleContinue}
                  className="w-full max-w-md bg-[#6B2C91] text-white px-8 py-6 rounded-lg font-semibold text-lg hover:bg-[#5a2474] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Continuar para Identificação
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseMedica;





