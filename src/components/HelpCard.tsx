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
      'Saúde mental': '/mental.png',
      'Doenças neurológicas': '/saude.png',
      'TEA, TDAH e cuidados paliativos': '/tdah.png',
    };
    return imageMap[cardTitle] || null;
  };

  const imagePath = getImagePath(title);
  const hasCustomImage = imagePath !== null;
  
  return (
    <div className="flex flex-col">
      <div className="relative bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
        {hasCustomImage ? (
          // Card com imagem customizada
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Fundo branco para todas as imagens */}
              <div className="absolute inset-0 bg-white"></div>
              
              {/* Fundo adicional para imagens com transparência (Saúde mental e TEA/TDAH) */}
              {(title === 'Saúde mental' || title === 'TEA, TDAH e cuidados paliativos') && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F8] to-[#F0F8FF]"></div>
              )}
              
              <img 
                src={imagePath} 
                alt={`Ilustração para ${title}`}
                className="relative w-full h-full object-contain p-8 z-10"
                style={{
                  // Garantir que imagens com transparência tenham fundo sólido
                  backgroundColor: (title === 'Saúde mental' || title === 'TEA, TDAH e cuidados paliativos') 
                    ? 'transparent' 
                    : 'white'
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
            {/* Botão roxo centralizado */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
              <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
                Saiba Mais
              </button>
            </div>
          </>
        ) : (
          // Cards normais com céu, nuvens e colinas (fallback)
          <>
            {/* Céu azul claro */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]"></div>
            
            <Cloud />
            <Hills />
            
            {/* Botão roxo centralizado */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
              <button className="bg-[#6B2C91] text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#5a2478] transition-all shadow-lg">
                Saiba Mais
              </button>
            </div>
          </>
        )}
      </div>
      <p className="text-center text-black font-medium mt-4 text-lg">
        {title}
      </p>
    </div>
  );
});

HelpCard.displayName = 'HelpCard';

export default HelpCard;

