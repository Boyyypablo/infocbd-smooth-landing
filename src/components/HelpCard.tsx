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
      'Dor crônica': '/torso-dor-cronica.png',
      'Saúde mental': '/saude.png',
      'Doenças neurológicas': '/mental.png',
      'TEA, TDAH e cuidados paliativos': '/tdah.png',
    };
    return imageMap[cardTitle] || null;
  };

  const imagePath = getImagePath(title);
  const hasCustomImage = imagePath !== null;
  
  return (
    <div className="flex flex-col">
      <div className="relative bg-white rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
        {hasCustomImage ? (
          // Card com imagem customizada
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <img 
              src={imagePath}
              alt={`Ilustração para ${title}`}
              className="relative w-full h-full object-contain p-6 md:p-8 z-10"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback se a imagem não existir
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement;
                if (fallback) {
                  fallback.innerHTML = `
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

