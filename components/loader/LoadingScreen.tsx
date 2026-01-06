import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  const typewriterText = 'Once in a while,\nright in the middle of an ordinary life,\nlove gives us a fairy tale.';

  useEffect(() => {
    // Typewriter effect
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= typewriterText.length) {
        setDisplayedText(typewriterText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 50);

    // Update progress smoothly over 8 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.5; // Increment by 0.5% every 40ms = 100% in 8 seconds
      });
    }, 40);

    // Simulate loading time (8 seconds)
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(typewriterInterval);
    };
  }, [onComplete, typewriterText]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Burgundy gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #800020 0%, #722F37 50%, #4B0000 100%)'
        }}
      />

      <div className="relative flex flex-col items-center justify-center px-4 sm:px-8">
        {/* Monogram Logo - White */}
        <div className="relative flex items-center justify-center mb-8 sm:mb-12">
          <div className="relative w-28 sm:w-40 h-28 sm:h-40">
            <Image
              src="/monogram/monogram.png"
              alt="Kersey & Victor Monogram"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
        </div>

        {/* Content section */}
        <div className="text-center max-w-sm sm:max-w-2xl px-4 sm:px-6">
          {/* Couple names */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl text-white mb-6 sm:mb-8"
            style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}
          >
            Kersey & Victor
          </h1>

          {/* Typewriter effect text */}
          <p
            className="text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose text-white/90 mb-8 sm:mb-10 min-h-[4rem] sm:min-h-[5rem] whitespace-pre-line"
            style={{ fontFamily: '"Cinzel", serif', fontWeight: 300 }}
          >
            {displayedText}
            <span className="animate-pulse">|</span>
          </p>

          {/* Loading progress bar */}
          <div className="relative w-48 sm:w-64 h-1 mx-auto">
            {/* Background track */}
            <div className="absolute inset-0 bg-black/30 rounded-full overflow-hidden" />
            {/* Progress fill */}
            <div 
              className="absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};