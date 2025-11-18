import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import { useEffect, useRef, useState, useLayoutEffect } from "react";

const Index = () => {
  const location = useLocation();
  const stepsSectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const treatmentSectionRef = useRef<HTMLElement>(null);
  const [isTreatmentVisible, setIsTreatmentVisible] = useState(false);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const [isCtaVisible, setIsCtaVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset states when component mounts or location changes
  useLayoutEffect(() => {
    setIsVisible(false);
    setIsTreatmentVisible(false);
    setIsCtaVisible(false);
    setImageError(false);
    
    // Force scroll to top when returning to this page
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const currentRef = stepsSectionRef.current;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (observer && currentRef) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const currentRef = treatmentSectionRef.current;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsTreatmentVisible(true);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (observer && currentRef) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const currentRef = ctaSectionRef.current;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsCtaVisible(true);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (observer && currentRef) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
    };
  }, [location.pathname]);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#FF6B35] via-[#D8437F] to-[#6B2C91]">
        <div className="container mx-auto px-6 py-20 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
            {/* Lado Esquerdo */}
            <div className="text-white">
              <p className="text-base md:text-lg lg:text-xl mb-6 font-normal leading-relaxed">
                Mais que alívio. Qualidade de vida com canabidiol!
              </p>
              <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-bold leading-[0.9] tracking-tight" style={{ fontFamily: 'sans-serif' }}>
                NUUMA
              </h1>
            </div>

            {/* Lado Direito */}
            <div className="text-white flex flex-col">
              <div className="text-right mb-10">
                <p className="text-base md:text-lg lg:text-xl max-w-md ml-auto leading-relaxed">
                  Telesaúde especializada em tratamento com cannabis medicinal, do médico à farmácia.
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/formulario" className="mr-4">
                  <button className="bg-white text-[#6B2C91] px-10 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap">
                    Vamos lá?
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section ref={stepsSectionRef} className="bg-white border-t-2 border-[#6B2C91] border-b-2">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2">
            {/* Coluna Esquerda */}
            <div className="flex flex-col pr-0 md:pr-8 lg:pr-16 md:border-r md:border-gray-300">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#6B2C91] mb-8">
                Como funciona, passo a passo
              </h2>
              <p className="text-base md:text-lg text-black mb-4 leading-relaxed">
                Para indicar canabidiol com segurança, a gente começa entendendo sua história e seus objetivos.
              </p>
              <p className="text-base md:text-lg text-black mb-10 leading-relaxed">
                Depois, vem a avaliação médica, a definição (ou não) do tratamento e o acompanhamento da sua resposta ao medicamento.
              </p>
              <Link to="/formulario" className="self-start">
                <button className="bg-[#6B2C91] text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-[#5a2478] transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  Fazer avaliação
                </button>
              </Link>
            </div>

            {/* Coluna Direita */}
            <div className="flex flex-col justify-center pl-0 md:pl-8 lg:pl-16 mt-8 md:mt-0">
              <ul className="space-y-6">
                <li 
                  className={`flex items-start transition-all duration-700 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: isVisible ? '0.1s' : '0s' }}
                >
                  <span className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#6B2C91]">
                    Questionário inicial
                  </span>
                </li>
                <li 
                  className={`flex items-start transition-all duration-700 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: isVisible ? '0.3s' : '0s' }}
                >
                  <span className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#6B2C91]">
                    Avaliação médica à distância
                  </span>
                </li>
                <li 
                  className={`flex items-start transition-all duration-700 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: isVisible ? '0.5s' : '0s' }}
                >
                  <span className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#6B2C91]">
                    Prescrição digital (quando indicada)
                  </span>
                </li>
                <li 
                  className={`flex items-start transition-all duration-700 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: isVisible ? '0.7s' : '0s' }}
                >
                  <span className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#6B2C91]">
                    Compra do medicamento
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Ajuda Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#6B2C91] mb-12 md:mb-16 text-center">
              Áreas em que o canabidiol pode ajudar
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Card 1 - Dor crônica */}
              <div className="flex flex-col">
                <div className="relative bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
                  {/* Céu azul claro */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
                  
                  {/* Nuvem branca */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="w-24 h-16 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -left-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -right-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                    </div>
                  </div>
                  
                  {/* Colinas verdes */}
                  <div className="absolute bottom-0 left-0 right-0">
                    {/* Colina escura (base) */}
                    <svg viewBox="0 0 200 100" className="w-full h-24" preserveAspectRatio="none">
                      <path d="M 0,100 Q 50,60 100,70 T 200,80 L 200,100 Z" fill="#2d5016" />
                    </svg>
                    {/* Colina clara (sobreposta) */}
                    <svg viewBox="0 0 200 100" className="w-full h-20 absolute bottom-0" preserveAspectRatio="none">
                      <path d="M 0,100 Q 40,70 80,75 T 160,70 L 200,75 L 200,100 Z" fill="#4a7c2a" />
                    </svg>
                  </div>
                  
                  {/* Botão roxo centralizado */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                    <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
                      Saiba Mais
                    </button>
                  </div>
                </div>
                <p className="text-center text-black font-medium mt-4 text-lg">
                  Dor crônica
                </p>
              </div>

              {/* Card 2 - Saúde mental */}
              <div className="flex flex-col">
                <div className="relative bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
                  {/* Céu azul claro */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
                  
                  {/* Nuvem branca */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="w-24 h-16 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -left-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -right-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                    </div>
                  </div>
                  
                  {/* Colinas verdes */}
                  <div className="absolute bottom-0 left-0 right-0">
                    {/* Colina escura (base) */}
                    <svg viewBox="0 0 200 100" className="w-full h-24" preserveAspectRatio="none">
                      <path d="M 0,100 Q 50,60 100,70 T 200,80 L 200,100 Z" fill="#2d5016" />
                    </svg>
                    {/* Colina clara (sobreposta) */}
                    <svg viewBox="0 0 200 100" className="w-full h-20 absolute bottom-0" preserveAspectRatio="none">
                      <path d="M 0,100 Q 40,70 80,75 T 160,70 L 200,75 L 200,100 Z" fill="#4a7c2a" />
                    </svg>
                  </div>
                  
                  {/* Botão roxo centralizado */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                    <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
                      Saiba Mais
                    </button>
                  </div>
                </div>
                <p className="text-center text-black font-medium mt-4 text-lg">
                  Saúde mental
                </p>
              </div>

              {/* Card 3 - Doenças neurológicas */}
              <div className="flex flex-col">
                <div className="relative bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
                  {/* Céu azul claro */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
                  
                  {/* Nuvem branca */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="w-24 h-16 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -left-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -right-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                    </div>
                  </div>
                  
                  {/* Colinas verdes */}
                  <div className="absolute bottom-0 left-0 right-0">
                    {/* Colina escura (base) */}
                    <svg viewBox="0 0 200 100" className="w-full h-24" preserveAspectRatio="none">
                      <path d="M 0,100 Q 50,60 100,70 T 200,80 L 200,100 Z" fill="#2d5016" />
                    </svg>
                    {/* Colina clara (sobreposta) */}
                    <svg viewBox="0 0 200 100" className="w-full h-20 absolute bottom-0" preserveAspectRatio="none">
                      <path d="M 0,100 Q 40,70 80,75 T 160,70 L 200,75 L 200,100 Z" fill="#4a7c2a" />
                    </svg>
                  </div>
                  
                  {/* Botão roxo centralizado */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                    <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
                      Saiba Mais
                    </button>
                  </div>
                </div>
                <p className="text-center text-black font-medium mt-4 text-lg">
                  Doenças neurológicas
                </p>
              </div>

              {/* Card 4 - TEA, TDAH e cuidados paliativos */}
              <div className="flex flex-col">
                <div className="relative bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
                  {/* Céu azul claro */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
                  
                  {/* Nuvem branca */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="w-24 h-16 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -left-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                      <div className="absolute -right-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
                    </div>
                  </div>
                  
                  {/* Colinas verdes */}
                  <div className="absolute bottom-0 left-0 right-0">
                    {/* Colina escura (base) */}
                    <svg viewBox="0 0 200 100" className="w-full h-24" preserveAspectRatio="none">
                      <path d="M 0,100 Q 50,60 100,70 T 200,80 L 200,100 Z" fill="#2d5016" />
                    </svg>
                    {/* Colina clara (sobreposta) */}
                    <svg viewBox="0 0 200 100" className="w-full h-20 absolute bottom-0" preserveAspectRatio="none">
                      <path d="M 0,100 Q 40,70 80,75 T 160,70 L 200,75 L 200,100 Z" fill="#4a7c2a" />
                    </svg>
                  </div>
                  
                  {/* Botão roxo centralizado */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                    <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
                      Saiba Mais
                    </button>
                  </div>
                </div>
                <p className="text-center text-black font-medium mt-4 text-lg">
                  TEA, TDAH e cuidados paliativos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cada Tratamento Section */}
      <section ref={treatmentSectionRef} className="bg-white border-l-2 border-[#6B2C91] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Lado Esquerdo - Imagem */}
              <div className="order-2 md:order-1">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF]" style={{ minHeight: '500px' }}>
                  {!imageError ? (
                    <img 
                      src="/tratamento-cuidado-unico.jpg" 
                      alt="Cada tratamento, um cuidado único" 
                      className="w-full h-full object-cover rounded-lg"
                      style={{ minHeight: '500px' }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-lg">
                      <div className="text-center p-8">
                        <p className="text-gray-600 mb-2">Adicione a imagem</p>
                        <p className="text-sm text-gray-500">tratamento-cuidado-unico.jpg</p>
                        <p className="text-sm text-gray-500">na pasta public</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lado Direito - Conteúdo */}
              <div className="order-1 md:order-2 flex flex-col">
                <h2 
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#6B2C91] mb-8 transition-all duration-700 ease-out ${
                    isTreatmentVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: isTreatmentVisible ? '0.1s' : '0s' }}
                >
                  Cada tratamento,
                  <br />
                  um cuidado único
                </h2>
                
                <p 
                  className={`text-base md:text-lg text-black mb-6 leading-relaxed transition-all duration-700 ease-out ${
                    isTreatmentVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: isTreatmentVisible ? '0.3s' : '0s' }}
                >
                  A NUUMA nasceu para facilitar a vida de quem precisa de tratamento com canabidiol, mas se perde entre burocracias, falta de informação e medo de fazer algo errado.
                </p>
                
                <p 
                  className={`text-base md:text-lg text-black mb-10 leading-relaxed transition-all duration-700 ease-out ${
                    isTreatmentVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: isTreatmentVisible ? '0.5s' : '0s' }}
                >
                  Aqui, o ponto de partida é sempre você: sua história, seus sintomas, seus objetivos e suas dúvidas.
                </p>
                
                <div 
                  className={`flex justify-end transition-all duration-700 ease-out ${
                    isTreatmentVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: isTreatmentVisible ? '0.7s' : '0s' }}
                >
                  <button className="bg-[#6B2C91] text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-[#5a2478] transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    Conhecer nosso time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section ref={ctaSectionRef} className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center">
              <h2 
                className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#6B2C91] mb-8 text-center transition-all duration-700 ease-out ${
                  isCtaVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ fontFamily: 'sans-serif', transitionDelay: isCtaVisible ? '0.1s' : '0s' }}
              >
                Vamos começar seu tratamento com canabidiol?
              </h2>
              <div 
                className={`transition-all duration-700 ease-out ${
                  isCtaVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isCtaVisible ? '0.3s' : '0s' }}
              >
                <Link to="/formulario">
                  <button className="bg-[#6B2C91] text-white px-10 py-4 rounded-lg font-semibold text-lg md:text-xl hover:bg-[#5a2478] transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    Vamos lá!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-[#6B2C91] to-[#FF6B35] text-white py-16 md:py-20 overflow-hidden">
        {/* Design geométrico no canto superior direito */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="20" y="20" width="40" height="40" fill="none" stroke="white" strokeWidth="2" />
            <rect x="70" y="30" width="30" height="30" fill="none" stroke="white" strokeWidth="2" />
            <rect x="110" y="20" width="50" height="50" fill="none" stroke="white" strokeWidth="2" />
            <rect x="30" y="80" width="35" height="35" fill="none" stroke="white" strokeWidth="2" />
            <rect x="80" y="75" width="40" height="40" fill="none" stroke="white" strokeWidth="2" />
            <rect x="130" y="85" width="30" height="30" fill="none" stroke="white" strokeWidth="2" />
            <rect x="20" y="130" width="45" height="45" fill="none" stroke="white" strokeWidth="2" />
            <rect x="75" y="125" width="35" height="35" fill="none" stroke="white" strokeWidth="2" />
            <rect x="120" y="130" width="40" height="40" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Contato */}
            <div>
              <p className="font-bold text-lg mb-4">Tel: (61) 3142-4550</p>
              <p className="text-base"> contatonuuma@gmail.com</p>
            </div>

            {/* Horário de funcionamento */}
            <div>
              <h3 className="font-bold text-lg mb-4">Horário de funcionamento</h3>
              <p className="text-base mb-2">Segunda a sexta</p>
              <p className="text-base mb-2">24h / 7 dias</p>
              <p className="text-base">Atendemos todo o Brasil</p>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="font-bold text-lg mb-4">Endereço</h3>
              <p className="text-base">xxxxxx</p>
            </div>

            {/* Redes Sociais e Responsável Técnico */}
            <div>
              <div className="flex gap-4 mb-6">
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-[#6B2C91] flex items-center justify-center hover:bg-[#5a2478] transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-[#6B2C91] flex items-center justify-center hover:bg-[#5a2478] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-lg bg-white flex items-center justify-center hover:bg-gray-100 transition-all"
                  aria-label="WhatsApp"
                >
                  <svg className="w-6 h-6" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-white/90">
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
