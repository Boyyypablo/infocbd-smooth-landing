import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Download, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fillPDFTemplate } from "@/utils/fillPDFTemplate";
import { supabase } from "@/lib/supabase";

const Sucesso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [orderData, setOrderData] = useState<{ nome: string; cpf: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'approved' | 'pending' | 'unknown'>('unknown');

  // URL do WhatsApp Business - você deve configurar
  const whatsappNumber = "556131424550"; // Substitua pelo número real
  const whatsappMessage = encodeURIComponent(
    "Olá! Acabei de finalizar meu pedido e gostaria de mais informações sobre meu tratamento."
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    
    const generateReceipt = async () => {
      try {
        // Verificar status do pagamento via query params
        const orderId = searchParams.get('order_id') || localStorage.getItem('order_id');
        
        // Buscar status do pedido no Supabase
        if (orderId) {
          const { data: order } = await supabase
            .from('pedidos')
            .select('status, payment_id')
            .eq('id', orderId)
            .single();
          
          if (order) {
            if (order.status === 'pago') {
              setPaymentStatus('approved');
            } else if (order.status === 'pendente') {
              setPaymentStatus('pending');
            }
          }
        }

        const savedData = JSON.parse(localStorage.getItem('checkout_data') || '{}');
        
        if (!savedData.nome || !savedData.cpf) {
          navigate('/identificacao', { replace: true });
          return;
        }

        setOrderData(savedData);

        // Gerar PDF da receita
        const pdf = await fillPDFTemplate(savedData.nome, savedData.cpf);
        setPdfBlob(pdf);
        setIsGenerating(false);

        // Limpar flag de pagamento pendente
        localStorage.removeItem('pending_payment');
      } catch (error) {
        console.error('Erro ao gerar receita:', error);
        setIsGenerating(false);
      }
    };

    generateReceipt();
  }, [navigate, searchParams]);

  const handleDownloadReceipt = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receita-medica-${orderData?.nome?.replace(/\s+/g, '-') || 'nuuma'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91] flex items-center justify-center px-6 py-12">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Ícone de Sucesso */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#6B2C91] mb-4">
            {paymentStatus === 'approved' 
              ? 'Pedido Confirmado!' 
              : paymentStatus === 'pending'
              ? 'Pagamento Pendente'
              : 'Pedido Confirmado!'}
          </h1>
          
          <p className="text-lg text-gray-700 mb-8">
            {paymentStatus === 'approved' 
              ? 'Seu pedido foi processado com sucesso. Agora você pode baixar sua receita médica.'
              : paymentStatus === 'pending'
              ? 'Seu pagamento está sendo processado. Você receberá um email quando for confirmado.'
              : 'Seu pedido foi processado. Agora você pode baixar sua receita médica.'}
          </p>

          {/* Instruções */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 Instruções sobre a Receita Médica
            </h2>
            <ol className="space-y-3 text-gray-700 list-decimal list-inside">
              <li>Baixe sua receita médica clicando no botão abaixo</li>
              <li>Imprima a receita ou mantenha em formato digital</li>
              <li>Apresente a receita e o recibo de pagamento em nosso chat para receber o restante das informações de envio.</li>
              <li>Mantenha a receita em local seguro, pois ela é necessária para futuras compras</li>
              <li>Em caso de dúvidas, entre em contato conosco via WhatsApp.</li>
            </ol>
          </div>

          {/* Alerta sobre validade da receita */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Lembramos que a receita só é válida para as compras feitas exclusivamente através do NUUMA.</strong>
            </p>
          </div>

          {/* Botão de Download */}
          <div className="mb-6">
            <Button
              onClick={handleDownloadReceipt}
              disabled={isGenerating || !pdfBlob}
              size="lg"
              className="w-full md:w-auto bg-[#6B2C91] hover:bg-[#5a2478] text-white px-8 py-6 text-lg font-semibold disabled:opacity-50"
            >
              <Download className="w-5 h-5 mr-2" />
              {isGenerating ? 'Gerando Receita...' : 'Baixar Receita Médica'}
            </Button>
          </div>

          {/* Botão WhatsApp */}
          <div className="mb-6">
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              size="lg"
              className="w-full md:w-auto border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Próximos passos:</strong>
            </p>
            <p className="text-sm text-gray-600">
              Você receberá um email de confirmação com todos os detalhes do seu pedido.
              O medicamento será enviado para o endereço informado em até 5 dias úteis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sucesso;





