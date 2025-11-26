import { X, Copy, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ModalBoletoProps {
  isOpen: boolean;
  onClose: () => void;
  ticketUrl: string;
  barcode: string;
  amount: number;
  dueDate?: string;
}

export const ModalBoleto = ({
  isOpen,
  onClose,
  ticketUrl,
  barcode,
  amount,
  dueDate,
}: ModalBoletoProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyBarcode = async () => {
    try {
      await navigator.clipboard.writeText(barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar código de barras:", error);
    }
  };

  const handleDownload = () => {
    window.open(ticketUrl, "_blank");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#6B2C91] to-[#D8437F] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Boleto Gerado com Sucesso!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações do Boleto */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Valor:</span>
              <span className="text-2xl font-bold text-[#6B2C91]">
                {formatCurrency(amount)}
              </span>
            </div>
            {dueDate && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Vencimento:</span>
                <span className="text-lg font-semibold text-gray-800">
                  {new Date(dueDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
          </div>

          {/* Código de Barras */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Código de Barras:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcode}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:border-[#6B2C91]"
              />
              <Button
                onClick={handleCopyBarcode}
                variant="outline"
                className="px-4"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Código copiado para a área de transferência!
              </p>
            )}
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Instruções:
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Copie o código de barras acima</li>
              <li>Pague em qualquer banco, lotérica ou aplicativo bancário</li>
              <li>O pagamento pode levar até 2 dias úteis para ser confirmado</li>
              <li>Você receberá um e-mail quando o pagamento for confirmado</li>
            </ol>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleDownload}
              size="lg"
              className="flex-1 bg-[#6B2C91] hover:bg-[#5a2478] text-white"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Boleto (PDF)
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};



