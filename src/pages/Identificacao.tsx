import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Identificacao = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [errors, setErrors] = useState<{ nome?: string; cpf?: string }>({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const formatCPF = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Aplica a máscara
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const validateForm = (): boolean => {
    const newErrors: { nome?: string; cpf?: string } = {};

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Redirecionar para processamento com os dados
      navigate('/processamento', {
        state: { nome: nome.trim(), cpf: cpf.replace(/\D/g, '') }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/formulario" 
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 min-h-screen flex items-center">
        <div className="container mx-auto max-w-2xl w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#6B2C91] mb-4">
                Identificação
              </h1>
              <p className="text-lg text-gray-700">
                Por favor, preencha seus dados de identificação para gerar seu documento médico
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
      </main>
    </div>
  );
};

export default Identificacao;

