import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function DoctorHeroAnimation(): React.ReactElement {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xs h-auto">
        <DotLottieReact
          src="/animations/doctor-medical-instrument.lottie"
          loop
          autoplay
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
