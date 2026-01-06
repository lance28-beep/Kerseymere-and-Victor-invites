import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

const desktopImages: string[] = [
  '/desktop-background/couple (1).jpg',
  '/desktop-background/couple (2).jpg',
  '/desktop-background/couple (3).jpg',
  '/desktop-background/couple (4).jpg',
  '/desktop-background/couple (5).jpg',
];

const mobileImages: string[] = [
  '/mobile-background/couple (1).jpg',
  '/mobile-background/couple (2).jpg',
  '/mobile-background/couple (3).jpg',
  '/mobile-background/couple (6).jpg',
  '/mobile-background/couple (7).jpg',
];

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 768px)');
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 5);
    }, 5500);
    return () => clearInterval(timer);
  }, [mounted]);

  const images = useMemo(() => (isMobile ? mobileImages : desktopImages), [isMobile]);

  return (
    <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Couple"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `rgba(106, 19, 36, 0.5)`
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        
        {/* Top Logo/Monogram */}
        <div className="mb-auto mt-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            {/* Monogram Image - White version */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 brightness-0 invert">
              <Image
                src="/monogram/newmonogram.png"
                alt="Victor & Kersey Monogram"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center justify-end w-full gap-4 pb-14 sm:pb-16 md:pb-20">
          <h2
            className="text-6xl md:text-8xl text-white transform -rotate-6"
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
            }}
          >
            You are
          </h2>
          
          <h1
            className="text-5xl md:text-7xl text-white font-bold tracking-wider uppercase"
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
            }}
          >
            Invited!
          </h1>

          <button 
            onClick={() => {
              onOpen();
            }}
            className="px-10 py-4 bg-white text-black font-serif text-sm tracking-[0.2em] uppercase rounded-sm border border-black/20 hover:bg-gray-50 transition-colors"
          >
            <span
              className="text-black"
              style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}
            >
              Open Invitation
            </span>
          </button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
};