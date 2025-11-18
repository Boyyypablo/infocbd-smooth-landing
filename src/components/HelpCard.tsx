import { memo } from 'react';
import Cloud from './Cloud';
import Hills from './Hills';

interface HelpCardProps {
  title: string;
}

const HelpCard = memo(({ title }: HelpCardProps) => (
  <div className="flex flex-col">
    <div className="relative bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] rounded-t-lg overflow-hidden" style={{ minHeight: '280px' }}>
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
    </div>
    <p className="text-center text-black font-medium mt-4 text-lg">
      {title}
    </p>
  </div>
));

HelpCard.displayName = 'HelpCard';

export default HelpCard;

