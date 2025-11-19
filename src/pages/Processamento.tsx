import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fillPDFTemplate } from "@/utils/fillPDFTemplate";

const Processamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Extrair dados da URL ou do state
    const state = location.state as { nome?: string; cpf?: string } | null;
    const urlParams = new URLSearchParams(location.search);
    
    const nomeParam = state?.nome || urlParams.get('nome') || '';
    const cpfParam = state?.cpf || urlParams.get('cpf') || '';
    
    if (!nomeParam || !cpfParam) {
      setError('Dados não encontrados. Por favor, preencha o formulário novamente.');
      setIsProcessing(false);
      return;
    }
    
    setNome(nomeParam);
    setCpf(cpfParam);
    
    // Simular processamento e gerar PDF
    const processDocument = async () => {
      try {
        // Simular tempo de processamento (2-3 segundos)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Gerar PDF
        const pdf = await fillPDFTemplate(nomeParam, cpfParam);
        setPdfBlob(pdf);
        setIsProcessing(false);
      } catch (err) {
        console.error('Erro ao processar documento:', err);
        setError('Erro ao gerar o documento. Por favor, tente novamente.');
        setIsProcessing(false);
      }
    };
    
    processDocument();
  }, [location]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receita-medica-${nome.replace(/\s/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleContinue = () => {
    // Redirecionar para o primeiro Typeform
    // Você pode usar window.location.href ou criar uma rota específica
    window.location.href = 'https://form.typeform.com/to/01KACB9285W9X86T4MGHWNSH3K';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91]">
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12">
            {error ? (
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#6B2C91] mb-4">
                  Erro ao Processar
                </h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <Button onClick={() => navigate('/formulario')}>
                  Voltar ao Formulário
                </Button>
              </div>
            ) : isProcessing ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <Loader2 className="w-16 h-16 text-[#6B2C91] animate-spin" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#6B2C91] mb-6">
                  Sua solicitação está em processamento.
                </h2>
                <div className="space-y-4 text-gray-700 text-left">
                  <p className="text-base md:text-lg leading-relaxed">
                    Um de nossos especialistas está neste momento analisando suas respostas e preparando o documento médico para que ele possa ser baixado.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed">
                    Por favor, aguarde mais alguns instantes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-[#6B2C91]">
                  Documento Pronto!
                </h2>
                
                <p className="text-gray-700">
                  Seu documento médico foi gerado com sucesso. Clique no botão abaixo para fazer o download.
                </p>
                
                <div className="flex flex-col gap-4 pt-4">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-[#6B2C91] hover:bg-[#5a2478] text-white"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Documento
                  </Button>
                  
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#6B2C91] text-[#6B2C91] hover:bg-[#6B2C91] hover:text-white"
                  >
                    Continuar sua compra
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Processamento;

