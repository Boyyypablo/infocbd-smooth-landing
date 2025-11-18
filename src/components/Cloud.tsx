import { memo } from 'react';

const Cloud = memo(() => (
  <div className="absolute top-8 left-1/2 -translate-x-1/2">
    <div className="relative">
      <div className="w-24 h-16 bg-white rounded-full opacity-90"></div>
      <div className="absolute -left-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
      <div className="absolute -right-4 top-2 w-16 h-12 bg-white rounded-full opacity-90"></div>
    </div>
  </div>
));

Cloud.displayName = 'Cloud';

export default Cloud;

