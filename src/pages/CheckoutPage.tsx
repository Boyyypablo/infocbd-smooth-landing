// ============================================
// Componente React: Página de Checkout
// Simulação de Pagamento + Supabase
// ============================================

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { OrderSummary } from "@/components/OrderSummary";
import { Loader2, XCircle, ShoppingCart, QrCode, CreditCard, FileText, Copy, Check } from "lucide-react";
import { getTypeformData } from "@/utils/typeformData";

// ============================================
// CONFIGURAÇÃO
// ============================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const POLLING_INTERVAL = 3000;
const MAX_POLLING_ATTEMPTS = 60;
const PAYMENT_VALUE = 187.00; // R$ 37,00 (avaliação) + R$ 150,00 (remédio)

// ============================================
// TIPOS
// ============================================

type CheckoutStep = 'summary' | 'payment_method' | 'pix_payment' | 'processing' | 'failed';
type PaymentMethod = 'pix' | 'credit' | 'boleto';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estados
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('summary');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string>('');
  const [pixCopied, setPixCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // ============================================
  // EFEITO: Carregar dados do pedido
  // ============================================

  useEffect(() => {
    const savedData = localStorage.getItem('checkout_data');
    if (savedData) {
      setOrderData(JSON.parse(savedData));
    }

    const typeformData = getTypeformData();
    if (typeformData) {
      setOrderData(typeformData);
    }
  }, []);

  // ============================================
  // FUNÇÃO: Gerar código PIX simulado
  // ============================================

  const generatePixCode = () => {
    // Gerar código PIX simulado (formato realista)
    const pixKey = '00020126580014BR.GOV.BCB.PIX0136';
    const merchantName = 'NUMA';
    const amount = PAYMENT_VALUE.toFixed(2).replace('.', '');
    const transactionId = Math.random().toString(36).substring(2, 15).toUpperCase();
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    
    // Código PIX simulado (não funcional, apenas visual)
    const code = `${pixKey}${merchantName}520400005303986540${amount}5802BR59NUMA6009SAO PAULO62070503***6304${transactionId.substring(0, 4)}`;
    return code;
  };

  // ============================================
  // FUNÇÃO: Selecionar método de pagamento
  // ============================================

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    
    if (method === 'pix') {
      // Gerar código PIX
      const code = generatePixCode();
      setPixCode(code);
      setCurrentStep('pix_payment');
      
      // Após 5 segundos, simular confirmação automática
      setTimeout(() => {
        handleConfirmPayment();
      }, 5000);
    } else {
      // Outros métodos ainda não implementados
      setErrorMessage('Este metodo de pagamento ainda nao esta disponivel. Por favor, escolha PIX.');
    }
  };

  // ============================================
  // FUNÇÃO: Confirmar pagamento
  // ============================================

  const handleConfirmPayment = async () => {
    try {
      setCurrentStep('processing');
      setErrorMessage(null);

      let orderId: string | null = null;

      // Tentar criar pedido diretamente no Supabase (sem backend)
      try {
        const { data: order, error: supabaseError } = await supabase
          .from('orders')
          .insert({
            amount: PAYMENT_VALUE,
            status: 'APPROVED', // Aprovar automaticamente na simulação
            description: `Pedido de R$ ${PAYMENT_VALUE.toFixed(2)}`,
          })
          .select()
          .single();

        if (!supabaseError && order && order.id) {
          orderId = order.id;
          console.log('[OK] Pedido criado no Supabase:', orderId);
        } else {
          console.warn('[AVISO] Erro ao criar pedido no Supabase:', supabaseError);
          // Continuar com ID simulado
        }
      } catch (supabaseError) {
        console.warn('[AVISO] Erro ao acessar Supabase:', supabaseError);
        // Continuar com ID simulado
      }

      // Se não conseguiu criar no Supabase, gerar ID simulado
      if (!orderId) {
        // Gerar ID simulado no formato UUID
        orderId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        console.log('[OK] Usando ID simulado:', orderId);
      }

      setOrderId(orderId);
      localStorage.setItem('current_order_id', orderId);

      // Redirecionar para página de sucesso após 2 segundos
      setTimeout(() => {
        navigate('/sucesso', { replace: true });
      }, 2000);

    } catch (error) {
      console.error('[ERRO] Erro ao confirmar pagamento:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
      setCurrentStep('failed');
    }
  };

  // ============================================
  // FUNÇÃO: Copiar código PIX
  // ============================================

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error);
    }
  };


  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91] flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">
        <div className="bg-[#F4E8D8]/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12">
          
          {/* ============================================ */}
          {/* ETAPA 1: RESUMO DO PEDIDO E SELEÇÃO DE PAGAMENTO */}
          {/* ============================================ */}
          
          {currentStep === 'summary' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#6B2C91]" />
                <h1 className="text-3xl md:text-4xl font-bold text-[#6B2C91] mb-2">
                  Finalizar Compra
                </h1>
                <p className="text-lg text-gray-700">
                  Revise seu pedido e escolha a forma de pagamento
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Resumo do Pedido */}
                <div>
                  <h2 className="text-xl font-bold text-[#6B2C91] mb-4">Resumo do Pedido</h2>
                  <OrderSummary />
                </div>

                {/* Seleção de Método de Pagamento */}
                <div>
                  <h2 className="text-xl font-bold text-[#6B2C91] mb-4">Forma de Pagamento</h2>
                  <div className="space-y-4">
                    <Button
                      onClick={() => handleSelectPaymentMethod('pix')}
                      className="w-full flex items-center justify-start gap-4 h-auto py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-[#6B2C91] transition-all"
                    >
                      <QrCode className="w-6 h-6 text-[#6B2C91]" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">PIX</p>
                        <p className="text-sm text-gray-600">Aprovação imediata</p>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleSelectPaymentMethod('credit')}
                      className="w-full flex items-center justify-start gap-4 h-auto py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-[#6B2C91] transition-all opacity-60 cursor-not-allowed"
                      disabled
                    >
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-400">Cartão de Crédito/Débito</p>
                        <p className="text-sm text-gray-400">Em breve</p>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleSelectPaymentMethod('boleto')}
                      className="w-full flex items-center justify-start gap-4 h-auto py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-[#6B2C91] transition-all opacity-60 cursor-not-allowed"
                      disabled
                    >
                      <FileText className="w-6 h-6 text-gray-400" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-400">Boleto Bancário</p>
                        <p className="text-sm text-gray-400">Em breve</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* ETAPA 2: PAGAMENTO PIX */}
          {/* ============================================ */}
          
          {currentStep === 'pix_payment' && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-[#6B2C91]" />
                <h1 className="text-3xl md:text-4xl font-bold text-[#6B2C91] mb-2">
                  Pagamento via PIX
                </h1>
                <p className="text-lg text-gray-700">
                  Escaneie o QR Code ou copie o código para pagar
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
                    <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                      {/* QR Code - Imagem */}
                      <img
                        src="/qrcode.png"
                        alt="QR Code PIX"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback caso a imagem não exista
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">QR Code não disponível</div>';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Escaneie com o app do seu banco
                  </p>
                </div>

                {/* Código PIX Copia e Cola */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Código PIX (Copia e Cola)
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white p-4 rounded-lg border-2 border-gray-200 font-mono text-xs break-all">
                        {pixCode || 'Gerando código PIX...'}
                      </div>
                      <Button
                        onClick={handleCopyPixCode}
                        className="bg-[#6B2C91] hover:bg-[#5a2474] text-white px-4"
                      >
                        {pixCopied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    {pixCopied && (
                      <p className="text-sm text-green-600 mt-2">Código copiado!</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Instruções:</strong> Copie o código acima e cole no app do seu banco para realizar o pagamento.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> O pagamento será confirmado automaticamente em alguns instantes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Aguardando confirmação do pagamento...
                </p>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* ETAPA 3: PROCESSANDO */}
          {/* ============================================ */}
          
          {currentStep === 'processing' && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-[#6B2C91] animate-spin" />
              <h1 className="text-3xl md:text-4xl font-bold text-[#6B2C91] mb-4">
                Processando Pagamento...
              </h1>
              <p className="text-lg text-gray-700">
                Aguarde enquanto confirmamos seu pagamento
              </p>
            </div>
          )}


          {/* ============================================ */}
          {/* ETAPA: ERRO */}
          {/* ============================================ */}
          
          {currentStep === 'failed' && (
            <div className="text-center">
              <XCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                Erro no Pagamento
              </h1>
              {errorMessage && (
                <p className="text-lg text-gray-700 mb-8">
                  {errorMessage}
                </p>
              )}
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setCurrentStep('summary');
                    setErrorMessage(null);
                  }}
                  className="bg-[#6B2C91] hover:bg-[#5a2474] text-white text-lg px-8 py-6 rounded-full font-semibold"
                >
                  Tentar Novamente
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full"
                >
                  Voltar ao Início
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
