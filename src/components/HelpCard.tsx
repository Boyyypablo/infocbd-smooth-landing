import { memo } from 'react';
import Cloud from './Cloud';
import Hills from './Hills';

interface HelpCardProps {
  title: string;
}

const HelpCard = memo(({ title }: HelpCardProps) => {
  // Mapear cada título para sua respectiva imagem
  const getImagePath = (cardTitle: string): string | null => {
    const imageMap: Record<string, string> = {
      'Dor crônica': '/dor cronica.png',
      'Saúde mental': '/mental.png',
      'Doenças neurológicas': '/doenças.png',
      'TEA, TDAH e cuidados paliativos': '/TDAH.PNG',
    };
    return imageMap[cardTitle] || null;
  };

  const imagePath = getImagePath(title);
  const hasCustomImage = imagePath !== null;
  
  return (
    <div className="flex flex-col">
      <div className="relative bg-white rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
        {hasCustomImage ? (
          // Card com imagem customizada - estilo minimalista (silhueta preta com elementos brancos)
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="relative w-full h-full flex items-center justify-center p-6 md:p-8">
              {/* Camada 1: Silhueta preta (fundo) */}
              <img 
                src={imagePath}
                alt=""
                className="absolute w-full h-full object-contain"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0)',
                  WebkitFilter: 'brightness(0)',
                  opacity: 1,
                  zIndex: 1
                }}
                aria-hidden="true"
              />
              {/* Camada 2: Elementos brancos internos */}
              <img 
                src={imagePath}
                alt={`Ilustração para ${title}`}
                className="relative w-full h-full object-contain z-10"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                  WebkitFilter: 'brightness(0) invert(1)',
                  mixBlendMode: 'screen',
                  opacity: 0.9
                }}
                onError={(e) => {
                  // Fallback se a imagem não existir
                  const target = e.target as HTMLImageElement;
                  const container = target.closest('.relative');
                  if (container) {
                    container.innerHTML = `
                      <div class="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center text-gray-500 text-sm">
                          <p>Imagem não encontrada</p>
                          <p class="text-xs mt-2">Coloque a imagem em /public${imagePath}</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        ) : (
          // Cards normais com céu, nuvens e colinas (fallback)
          <>
            {/* Céu azul claro */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
            
            <Cloud />
            <Hills />
          </>
        )}
      </div>
      {/* Título acima do botão */}
      <p className="text-center text-black font-medium mt-4 text-lg">
        {title}
      </p>
      {/* Botão roxo centralizado - abaixo do título */}
      <div className="flex justify-center mt-4">
        <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
          Saiba Mais
        </button>
      </div>
    </div>
  );
});

HelpCard.displayName = 'HelpCard';

export default HelpCard;

