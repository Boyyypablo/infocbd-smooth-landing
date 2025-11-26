import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateCPF } from "@/utils/validateCPF";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { OrderSummary } from "@/components/OrderSummary";

const Identificacao = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const steps = [
    { number: 1, label: "Identificação" },
    { number: 2, label: "Endereço" },
    { number: 3, label: "Pagamento" },
  ];

  // Scroll to top on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, []);

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    const cpfNumbers = cpf.replace(/\D/g, '');
    if (!cpfNumbers) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (cpfNumbers.length !== 11) {
      newErrors.cpf = "CPF deve ter 11 dígitos";
    } else if (!validateCPF(cpfNumbers)) {
      newErrors.cpf = "CPF inválido. Por favor, verifique os dígitos.";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }

    const phoneNumbers = telefone.replace(/\D/g, '');
    if (!phoneNumbers) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (phoneNumbers.length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Salvar dados no localStorage temporariamente
      const formData = {
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        email: email.trim(),
        telefone: telefone.replace(/\D/g, ''),
      };
      localStorage.setItem('checkout_data', JSON.stringify(formData));
      
      // Redirecionar para endereço
      navigate('/endereco', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91] overflow-y-auto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/analise-medica" 
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl w-full">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
            {/* Stepper */}
            <CheckoutStepper currentStep={1} steps={steps} />

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#6B2C91] mb-4">
                1. Identificação
              </h1>
              <p className="text-lg text-gray-700">
                Por favor, preencha seus dados de identificação
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-base font-medium text-gray-700">
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`h-12 text-base ${errors.nome ? 'border-red-500' : ''}`}
                  required
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-base font-medium text-gray-700">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCPFChange}
                  maxLength={14}
                  className={`h-12 text-base ${errors.cpf ? 'border-red-500' : ''}`}
                  required
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-base font-medium text-gray-700">
                  Telefone/WhatsApp
                </Label>
                <Input
                  id="telefone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  className={`h-12 text-base ${errors.telefone ? 'border-red-500' : ''}`}
                  required
                />
                {errors.telefone && (
                  <p className="text-sm text-red-500">{errors.telefone}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#6B2C91] hover:bg-[#5a2478] text-white h-14 text-base font-semibold"
                >
                  Continuar
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Suas informações estão protegidas e serão tratadas com confidencialidade</p>
            </div>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Identificacao;
