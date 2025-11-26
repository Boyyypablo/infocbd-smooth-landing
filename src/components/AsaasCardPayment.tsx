import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Lock } from 'lucide-react';

interface AsaasCardPaymentProps {
  value: number;
  onPaymentSubmit: (cardData: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
    installments: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const AsaasCardPayment = ({
  value,
  onPaymentSubmit,
  isLoading = false,
}: AsaasCardPaymentProps) => {
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [ccv, setCcv] = useState('');
  const [installments, setInstallments] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Limitar a 16 dígitos + espaços
  };

  const formatCcv = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!holderName.trim()) {
      newErrors.holderName = 'Nome do portador é obrigatório';
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }

    if (!expiryMonth || !expiryYear) {
      newErrors.expiry = 'Data de validade é obrigatória';
    } else {
      const month = parseInt(expiryMonth);
      const year = parseInt(`20${expiryYear}`);
      const now = new Date();
      const expiryDate = new Date(year, month - 1);
      if (expiryDate < now) {
        newErrors.expiry = 'Cartão expirado';
      }
    }

    if (ccv.length < 3) {
      newErrors.ccv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');

    await onPaymentSubmit({
      holderName: holderName.trim(),
      number: cleanedCardNumber,
      expiryMonth,
      expiryYear,
      ccv,
      installments: parseInt(installments),
    });
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = (currentYear + i).toString().slice(-2);
    return { value: year, label: year };
  });

  const maxInstallments = Math.min(12, Math.floor(value / 5)); // Mínimo de R$ 5 por parcela

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 text-center">
          <strong>Cartão de Crédito:</strong> Preencha os dados do cartão para finalizar o pagamento
        </p>
      </div>

      {/* Valor */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">Valor a pagar</p>
        <p className="text-2xl font-bold text-[#6B2C91]">
          R$ {value.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {/* Nome do Portador */}
      <div className="space-y-2">
        <Label htmlFor="holderName">Nome no Cartão</Label>
        <Input
          id="holderName"
          type="text"
          placeholder="Nome como está no cartão"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value.toUpperCase())}
          className={errors.holderName ? 'border-red-500' : ''}
        />
        {errors.holderName && (
          <p className="text-xs text-red-600">{errors.holderName}</p>
        )}
      </div>

      {/* Número do Cartão */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="cardNumber"
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
            maxLength={19}
          />
        </div>
        {errors.cardNumber && (
          <p className="text-xs text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      {/* Validade e CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Validade</Label>
          <div className="flex gap-2">
            <Select value={expiryMonth} onValueChange={setExpiryMonth}>
              <SelectTrigger className={errors.expiry ? 'border-red-500' : ''}>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={expiryYear} onValueChange={setExpiryYear}>
              <SelectTrigger className={errors.expiry ? 'border-red-500' : ''}>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    20{year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.expiry && (
            <p className="text-xs text-red-600">{errors.expiry}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ccv">CVV</Label>
          <Input
            id="ccv"
            type="text"
            placeholder="123"
            value={ccv}
            onChange={(e) => setCcv(formatCcv(e.target.value))}
            className={errors.ccv ? 'border-red-500' : ''}
            maxLength={4}
          />
          {errors.ccv && (
            <p className="text-xs text-red-600">{errors.ccv}</p>
          )}
        </div>
      </div>

      {/* Parcelas */}
      <div className="space-y-2">
        <Label htmlFor="installments">Parcelas</Label>
        <Select value={installments} onValueChange={setInstallments}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxInstallments }, (_, i) => {
              const num = i + 1;
              const installmentValue = value / num;
              return (
                <SelectItem key={num} value={num.toString()}>
                  {num}x de R$ {installmentValue.toFixed(2).replace('.', ',')} sem juros
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Botão de Pagamento */}
      <Button
        type="submit"
        className="w-full bg-[#6B2C91] hover:bg-[#5a2474]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processando...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Pagar R$ {value.toFixed(2).replace('.', ',')}
          </>
        )}
      </Button>

      {/* Segurança */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-800 text-center flex items-center justify-center gap-2">
          <Lock className="h-3 w-3" />
          Pagamento seguro e criptografado
        </p>
      </div>
    </form>
  );
};

