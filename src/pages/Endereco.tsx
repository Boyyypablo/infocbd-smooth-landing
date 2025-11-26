import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { OrderSummary } from "@/components/OrderSummary";

const Endereco = () => {
  const navigate = useNavigate();
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const steps = [
    { number: 1, label: "Identificação" },
    { number: 2, label: "Endereço" },
    { number: 3, label: "Pagamento" },
  ];

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    
    // Carregar dados anteriores
    const savedData = localStorage.getItem('checkout_data');
    if (!savedData) {
      navigate('/identificacao', { replace: true });
    }
  }, [navigate]);

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 8);
    if (limited.length <= 5) return limited;
    return `${limited.slice(0, 5)}-${limited.slice(5)}`;
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setCep(formatted);
    
    // Buscar CEP quando tiver 8 dígitos
    if (formatted.replace(/\D/g, '').length === 8) {
      buscarCEP(formatted.replace(/\D/g, ''));
    }
  };

  const buscarCEP = async (cepValue: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const cepNumbers = cep.replace(/\D/g, '');
    if (!cepNumbers) {
      newErrors.cep = "CEP é obrigatório";
    } else if (cepNumbers.length !== 8) {
      newErrors.cep = "CEP deve ter 8 dígitos";
    }

    if (!rua.trim()) {
      newErrors.rua = "Rua é obrigatória";
    }

    if (!numero.trim()) {
      newErrors.numero = "Número é obrigatório";
    }

    if (!bairro.trim()) {
      newErrors.bairro = "Bairro é obrigatório";
    }

    if (!cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    if (!estado.trim()) {
      newErrors.estado = "Estado é obrigatório";
    } else if (estado.length !== 2) {
      newErrors.estado = "Estado deve ter 2 letras";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Atualizar dados no localStorage
      const savedData = JSON.parse(localStorage.getItem('checkout_data') || '{}');
      const enderecoData = {
        cep: cep.replace(/\D/g, ''),
        rua: rua.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
      };
      
      localStorage.setItem('checkout_data', JSON.stringify({
        ...savedData,
        endereco: enderecoData
      }));
      
      // Redirecionar para checkout
      navigate('/checkout', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91] overflow-y-auto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/identificacao" 
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
                <CheckoutStepper currentStep={2} steps={steps} />

                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#6B2C91] mb-4">
                    2. Endereço de Entrega
                  </h1>
                  <p className="text-lg text-gray-700">
                    Informe o endereço onde deseja receber seu medicamento
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-base font-medium text-gray-700">
                      CEP
                    </Label>
                    <Input
                      id="cep"
                      type="text"
                      placeholder="00000-000"
                      value={cep}
                      onChange={handleCEPChange}
                      maxLength={9}
                      className={`h-12 text-base ${errors.cep ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.cep && (
                      <p className="text-sm text-red-500">{errors.cep}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="rua" className="text-base font-medium text-gray-700">
                        Rua
                      </Label>
                      <Input
                        id="rua"
                        type="text"
                        placeholder="Nome da rua"
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                        className={`h-12 text-base ${errors.rua ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.rua && (
                        <p className="text-sm text-red-500">{errors.rua}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numero" className="text-base font-medium text-gray-700">
                        Número
                      </Label>
                      <Input
                        id="numero"
                        type="text"
                        placeholder="123"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className={`h-12 text-base ${errors.numero ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.numero && (
                        <p className="text-sm text-red-500">{errors.numero}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complemento" className="text-base font-medium text-gray-700">
                      Complemento (opcional)
                    </Label>
                    <Input
                      id="complemento"
                      type="text"
                      placeholder="Apartamento, bloco, etc."
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro" className="text-base font-medium text-gray-700">
                      Bairro
                    </Label>
                    <Input
                      id="bairro"
                      type="text"
                      placeholder="Nome do bairro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className={`h-12 text-base ${errors.bairro ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.bairro && (
                      <p className="text-sm text-red-500">{errors.bairro}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-base font-medium text-gray-700">
                        Cidade
                      </Label>
                      <Input
                        id="cidade"
                        type="text"
                        placeholder="Nome da cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className={`h-12 text-base ${errors.cidade ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.cidade && (
                        <p className="text-sm text-red-500">{errors.cidade}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-base font-medium text-gray-700">
                        Estado
                      </Label>
                      <Input
                        id="estado"
                        type="text"
                        placeholder="SP"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value.toUpperCase())}
                        maxLength={2}
                        className={`h-12 text-base ${errors.estado ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.estado && (
                        <p className="text-sm text-red-500">{errors.estado}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#6B2C91] hover:bg-[#5a2478] text-white h-14 text-base font-semibold"
                    >
                      Continuar para Pagamento
                    </Button>
                  </div>
                </form>
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

export default Endereco;





