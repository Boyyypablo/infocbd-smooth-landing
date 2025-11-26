import { useState, useEffect } from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AsaasPixPaymentProps {
  qrCode: string;
  qrCodeBase64?: string;
  value: number;
  onPaymentConfirmed?: () => void;
}

export const AsaasPixPayment = ({
  qrCode,
  qrCodeBase64,
  value,
  onPaymentConfirmed,
}: AsaasPixPaymentProps) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'error'>('pending');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  // Verificar status do pagamento periodicamente
  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Esta função será implementada no componente pai
      // que terá acesso ao paymentId
    };

    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 text-center">
          <strong>PIX:</strong> Escaneie o QR Code ou copie o código para pagar
        </p>
      </div>

      {/* QR Code */}
      {qrCodeBase64 && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-64 h-64"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Escaneie o QR Code com o app do seu banco
          </p>
        </div>
      )}

      {/* Código PIX Copiável */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Código PIX (Copiar e Colar)
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3 break-all text-xs font-mono">
            {qrCode}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {copied && (
          <p className="text-xs text-green-600">Código copiado!</p>
        )}
      </div>

      {/* Valor */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">Valor a pagar</p>
        <p className="text-2xl font-bold text-[#6B2C91]">
          R$ {value.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-800">
          <strong>Instruções:</strong> Após realizar o pagamento, aguarde alguns instantes para confirmação automática.
        </p>
      </div>
    </div>
  );
};

