import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface AsaasBoletoPaymentProps {
  bankSlipUrl: string;
  barcode?: string;
  dueDate: string;
  value: number;
}

export const AsaasBoletoPayment = ({
  bankSlipUrl,
  barcode,
  dueDate,
  value,
}: AsaasBoletoPaymentProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 text-center">
          <strong>Boleto Bancário:</strong> Baixe ou visualize o boleto para pagamento
        </p>
      </div>

      {/* Informações do Boleto */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Valor:</span>
          <span className="text-lg font-bold text-[#6B2C91]">
            R$ {value.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Vencimento:</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDate(dueDate)}
          </span>
        </div>
      </div>

      {/* Código de Barras (se disponível) */}
      {barcode && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Código de Barras
          </label>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 break-all text-xs font-mono text-center">
            {barcode}
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.open(bankSlipUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visualizar Boleto
        </Button>
        <Button
          type="button"
          variant="default"
          className="flex-1 bg-[#6B2C91] hover:bg-[#5a2474]"
          onClick={() => {
            // Abrir em nova aba para download
            const link = document.createElement('a');
            link.href = bankSlipUrl;
            link.target = '_blank';
            link.download = 'boleto.pdf';
            link.click();
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar Boleto
        </Button>
      </div>

      {/* Instruções */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-800">
          <strong>Instruções:</strong> Pague o boleto em qualquer banco, lotérica ou app bancário até a data de vencimento. Após o pagamento, a confirmação pode levar até 2 dias úteis.
        </p>
      </div>
    </div>
  );
};

