import { memo } from 'react';

const Hills = memo(() => (
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
));

Hills.displayName = 'Hills';

export default Hills;

