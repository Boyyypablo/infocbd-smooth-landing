import { useEffect, useState } from "react";
import { Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PixQRCodeProps {
  qrCodeBase64: string;
  qrCode: string;
  copyCode: string;
  amount: number;
  onClose?: () => void;
}

export const PixQRCode = ({ qrCodeBase64, qrCode, copyCode, amount, onClose }: PixQRCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(copyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#6B2C91] mb-4">
            Escaneie o QR Code para pagar
          </h3>
          
          <div className="mb-6 flex justify-center">
            {qrCodeBase64 ? (
              <img 
                src={`data:image/png;base64,${qrCodeBase64}`} 
                alt="QR Code PIX" 
                className="w-64 h-64 border-2 border-gray-200 rounded-lg"
              />
            ) : (
              <div className="w-64 h-64 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#6B2C91]" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Valor: <span className="text-[#6B2C91]">R$ {amount.toFixed(2).replace('.', ',')}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Ou copie o código PIX abaixo:
            </p>
            
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-xs font-mono break-all text-gray-700 mb-2">
                {copyCode}
              </p>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Código copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar código PIX
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>⚠️ Importante:</strong> O pagamento será aprovado automaticamente após a confirmação.
              Você será redirecionado quando o pagamento for confirmado.
            </p>
          </div>

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};




