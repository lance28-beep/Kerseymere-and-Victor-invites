"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"

const desktopImages = [
  "/desktop-background/couple (1).jpg",
  "/desktop-background/couple (2).jpg",
  "/desktop-background/couple (3).jpg",
  "/desktop-background/couple (4).jpg",
  "/desktop-background/couple (5).jpg",

]

const mobileImages = [
  "/mobile-background/couple (1).jpg",
  "/mobile-background/couple (2).jpg",
  "/mobile-background/couple (3).jpg",
  "/mobile-background/couple (5).jpg",
  "/mobile-background/couple (6).jpg",
  "/mobile-background/couple (7).jpg",
]

const SHOW_BUTTERFLIES = false

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "700",
})

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Detect screen size and update isMobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    // Check on mount
    checkScreenSize()
    
    // Listen for resize events
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Get the appropriate image array based on screen size
  const backgroundImages = useMemo(() => {
    return isMobile ? mobileImages : desktopImages
  }, [isMobile])

  // Preload images progressively - show first image immediately
  useEffect(() => {
    setImagesLoaded(false)
    setCurrentImageIndex(0)
    
    // Load first image with priority to show it immediately
    const firstImg = new Image()
    firstImg.src = backgroundImages[0]
    firstImg.onload = () => {
      setImagesLoaded(true) // Show first image immediately
    }
    
    // Then preload a small lookahead set in background (avoid preloading all)
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && (navigator as any).connection?.saveData) return
      backgroundImages.slice(1, 3).forEach((src) => {
        const img = new Image()
        img.decoding = 'async'
        img.loading = 'lazy' as any
        img.src = src
      })
    }, 200)
  }, [backgroundImages])

  useEffect(() => {
    if (!imagesLoaded) return
    
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(imageTimer)
  }, [imagesLoaded, backgroundImages])

  useEffect(() => {
    if (imagesLoaded) {
      setIsVisible(true)
    }
  }, [imagesLoaded])

  const [weddingMonth = "June", weddingDayRaw = "7", weddingYear = "2026"] =
    siteConfig.wedding.date.split(" ")
  const weddingDayNumber = weddingDayRaw.replace(/[^0-9]/g, "") || "7"
  const ceremonyTime = siteConfig.wedding.time
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const ceremonyDayShort = siteConfig.ceremony.day
    ? siteConfig.ceremony.day.slice(0, 3).toUpperCase()
    : "THU"

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#187153]">
      <div className="absolute inset-0 w-full h-full">
        {imagesLoaded && backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              willChange: "opacity",
            }}
          />
        ))}
        {/* Premium mild dark overlay with gradients */}
        <div className="absolute inset-0 bg-black/35 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/15 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/40 z-0" />
        {/* Premium white gradient accents */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black/20 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.015),transparent_60%)] z-0" />
      </div>

      {SHOW_BUTTERFLIES && (
        <>
          {/* Realistic Butterflies flying in lower part near flowers */}
          <style jsx>{`
            @keyframes flutter {
              0% { transform: rotateX(0deg); }
              50% { transform: rotateX(75deg); }
              100% { transform: rotateX(0deg); }
            }
            
            @keyframes flutter-left {
              0% { transform: rotateX(0deg) rotateY(2deg); }
              50% { transform: rotateX(70deg) rotateY(5deg); }
              100% { transform: rotateX(0deg) rotateY(2deg); }
            }
            
            @keyframes flutter-right {
              0% { transform: rotateX(0deg) rotateY(-2deg); }
              50% { transform: rotateX(70deg) rotateY(-5deg); }
              100% { transform: rotateX(0deg) rotateY(-2deg); }
            }
            
            .butterfly-wing {
              transform-origin: 50% 50%;
            }
            
            .butterfly-wing-left {
              animation: flutter-left 180ms ease-in-out infinite;
            }
            
            .butterfly-wing-right {
              animation: flutter-right 180ms ease-in-out infinite;
              animation-delay: 90ms;
            }
          `}</style>

          {/* Butterfly 1 - Flying at CTA button level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '15%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '5%', y: 0 }}
            animate={{
              x: ['5%', '15%', '30%', '50%', '70%', '85%', '75%', '55%', '30%', '10%', '5%'],
              y: [0, 15, 8, -5, 12, 5, 18, 10, -8, 5, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95], // Custom cubic bezier for smooth, natural motion
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 8, 12, 5, -3, -8, -5, 2, 10, 6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 120 120"
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                {/* Left Wing */}
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 35 50 25 35 Q 18 25 20 18 Q 25 10 32 15 Q 40 20 45 30 Q 52 45 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <path
                    d="M 60 60 Q 40 55 32 45 Q 28 38 30 32 Q 33 28 38 32 Q 43 36 48 45 Q 55 52 60 60"
                    fill="#FCB8B5"
                    opacity="0.85"
                  />
                  <ellipse cx="35" cy="30" rx="8" ry="10" fill="#FFE5B4" opacity="0.7" />
                  <circle cx="38" cy="35" r="3" fill="#E6A27A" opacity="0.8" />
                  <circle cx="30" cy="25" r="2" fill="#FCB8B5" opacity="0.9" />
                  
                  {/* Lower left wing */}
                  <path
                    d="M 60 65 Q 45 72 35 80 Q 28 86 30 92 Q 35 98 42 93 Q 48 88 52 80 Q 57 72 60 65"
                    fill="#FFBD87"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 65 Q 48 70 40 76 Q 36 80 38 84 Q 41 88 45 84 Q 49 80 54 74 Q 58 69 60 65"
                    fill="#FCB8B5"
                    opacity="0.75"
                  />
                </g>

                {/* Right Wing */}
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 85 50 95 35 Q 102 25 100 18 Q 95 10 88 15 Q 80 20 75 30 Q 68 45 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <path
                    d="M 60 60 Q 80 55 88 45 Q 92 38 90 32 Q 87 28 82 32 Q 77 36 72 45 Q 65 52 60 60"
                    fill="#FCB8B5"
                    opacity="0.85"
                  />
                  <ellipse cx="85" cy="30" rx="8" ry="10" fill="#FFE5B4" opacity="0.7" />
                  <circle cx="82" cy="35" r="3" fill="#E6A27A" opacity="0.8" />
                  <circle cx="90" cy="25" r="2" fill="#FCB8B5" opacity="0.9" />
                  
                  {/* Lower right wing */}
                  <path
                    d="M 60 65 Q 75 72 85 80 Q 92 86 90 92 Q 85 98 78 93 Q 72 88 68 80 Q 63 72 60 65"
                    fill="#FFBD87"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 65 Q 72 70 80 76 Q 84 80 82 84 Q 79 88 75 84 Q 71 80 66 74 Q 62 69 60 65"
                    fill="#FCB8B5"
                    opacity="0.75"
                  />
                </g>

                {/* Body - drawn on top */}
                <g className="butterfly-body">
                  <ellipse cx="60" cy="65" rx="3.5" ry="28" fill="#654321" />
                  <ellipse cx="60" cy="64" rx="2.5" ry="25" fill="#8B6F47" />
                  <ellipse cx="60" cy="63" rx="2" ry="22" fill="#A0826D" />
                  <circle cx="60" cy="55" r="4" fill="#4A3423" />
                  <ellipse cx="60" cy="75" rx="2.5" ry="10" fill="#654321" />
                  
                  {/* Antennae */}
                  <line x1="60" y1="55" x2="55" y2="45" stroke="#4A3423" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="60" y1="55" x2="65" y2="45" stroke="#4A3423" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="55" cy="45" r="2" fill="#654321" />
                  <circle cx="65" cy="45" r="2" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* Butterfly 2 - Different path and timing at CTA level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '18%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '90%', y: 0 }}
            animate={{
              x: ['90%', '78%', '62%', '45%', '28%', '12%', '5%', '18%', '35%', '55%', '75%', '90%'],
              y: [0, 10, -8, 15, 5, 20, 8, -5, 18, 12, 5, 0],
            }}
            transition={{
              duration: 38,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1], // Smooth cubic bezier
              delay: 5,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, -10, -6, 8, 12, -8, -12, 5, 10, -5, 8, 0],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 120 120"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                {/* Left Wing */}
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 38 52 28 38 Q 22 28 24 22 Q 28 15 35 20 Q 42 25 48 35 Q 55 48 60 60"
                    fill="#FCB8B5"
                    opacity="0.95"
                  />
                  <ellipse cx="38" cy="35" rx="9" ry="11" fill="#FFBD87" opacity="0.8" />
                  <circle cx="35" cy="30" r="3" fill="#E6A27A" opacity="0.85" />
                  
                  {/* Lower left wing */}
                  <path
                    d="M 60 65 Q 47 70 38 78 Q 32 84 34 90 Q 38 95 44 90 Q 50 85 55 78 Q 58 71 60 65"
                    fill="#FCB8B5"
                    opacity="0.9"
                  />
                </g>

                {/* Right Wing */}
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 82 52 92 38 Q 98 28 96 22 Q 92 15 85 20 Q 78 25 72 35 Q 65 48 60 60"
                    fill="#FCB8B5"
                    opacity="0.95"
                  />
                  <ellipse cx="82" cy="35" rx="9" ry="11" fill="#FFBD87" opacity="0.8" />
                  <circle cx="85" cy="30" r="3" fill="#E6A27A" opacity="0.85" />
                  
                  {/* Lower right wing */}
                  <path
                    d="M 60 65 Q 73 70 82 78 Q 88 84 86 90 Q 82 95 76 90 Q 70 85 65 78 Q 62 71 60 65"
                    fill="#FCB8B5"
                    opacity="0.9"
                  />
                </g>

                {/* Body */}
                <g className="butterfly-body">
                  <ellipse cx="60" cy="64" rx="3" ry="24" fill="#654321" />
                  <ellipse cx="60" cy="63" rx="2.2" ry="22" fill="#8B6F47" />
                  <circle cx="60" cy="56" r="3.5" fill="#4A3423" />
                  
                  {/* Antennae */}
                  <line x1="60" y1="56" x2="56" y2="48" stroke="#4A3423" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="60" y1="56" x2="64" y2="48" stroke="#4A3423" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="56" cy="48" r="1.5" fill="#654321" />
                  <circle cx="64" cy="48" r="1.5" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* Butterfly 3 - Smaller, flies at CTA level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '12%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '45%', y: 0 }}
            animate={{
              x: ['45%', '58%', '70%', '82%', '88%', '75%', '58%', '40%', '22%', '8%', '20%', '35%', '45%'],
              y: [0, 12, 5, 18, 10, -5, 15, 8, -8, 12, 18, 8, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: [0.43, 0.13, 0.57, 0.87], // Smooth flowing bezier curve
              delay: 10,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 9, 12, -5, -10, 8, 11, -8, -6, 10, 5, -8, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 120 120"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                {/* Left Wing */}
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 40 53 30 40 Q 24 30 26 24 Q 30 18 36 23 Q 43 28 50 38 Q 56 50 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <ellipse cx="40" cy="38" rx="7" ry="9" fill="#FCB8B5" opacity="0.75" />
                  <circle cx="37" cy="33" r="2.5" fill="#FFE5B4" opacity="0.8" />
                </g>

                {/* Right Wing */}
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 80 53 90 40 Q 96 30 94 24 Q 90 18 84 23 Q 77 28 70 38 Q 64 50 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <ellipse cx="80" cy="38" rx="7" ry="9" fill="#FCB8B5" opacity="0.75" />
                  <circle cx="83" cy="33" r="2.5" fill="#FFE5B4" opacity="0.8" />
                </g>

                {/* Body */}
                <g className="butterfly-body">
                  <ellipse cx="60" cy="63" rx="2.5" ry="20" fill="#654321" />
                  <ellipse cx="60" cy="62" rx="2" ry="18" fill="#8B6F47" />
                  <circle cx="60" cy="57" r="3" fill="#4A3423" />
                  
                  {/* Antennae */}
                  <line x1="60" y1="57" x2="57" y2="50" stroke="#4A3423" strokeWidth="1" strokeLinecap="round" />
                  <line x1="60" y1="57" x2="63" y2="50" stroke="#4A3423" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="57" cy="50" r="1.2" fill="#654321" />
                  <circle cx="63" cy="50" r="1.2" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        </>
      )}

      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-12 md:pb-16">
        <div
          className={`w-full max-w-3xl text-center space-y-3 sm:space-y-4 md:space-y-5 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Main Invitation Text */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {/* Names & Tagline */}
            <h1
              className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.24em] sm:tracking-[0.28em] uppercase font-medium text-center text-[#F0F0EE]`}
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.75)",
              }}
            >
              Together with our families,
              <br />
              we joyfully invite you to witness our union.
            </h1>
            <h1
              className="style-script-regular text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl drop-shadow-2xl"
              style={{
                color: '#FFFFFF',
                textShadow: "0 0 24px rgba(0,0,0,0.9)",
              }}
            >
              <span className="block">{brideName}</span>
              <span className="block">&</span>
              <span className="block">{groomName}</span>
            </h1>
          </div>

          {/* Date & Time block */}
          <div className="w-full max-w-2xl mx-auto">
            <div
              className={`${cormorant.className} flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3 text-[#FDF8F5]/95`}
              style={{ textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
            >
              <span
                className={`${cinzel.className} text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] font-light text-white`}
                style={{ textShadow: "0 2px 14px rgba(24,113,83,0.65)" }}
              >
                {weddingMonth}
              </span>

              <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-5">
                {/* Day of week & divider */}
              <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
                  <span className="h-[0.5px] flex-1 bg-[#E5D0CD]/45" />
                  <span
                    className={`${cinzel.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-light text-white`}
                    style={{ textShadow: "0 2px 14px rgba(24,113,83,0.65)" }}
                  >
                    {ceremonyDayShort}
                  </span>
                  <span className="h-[0.5px] w-6 sm:w-8 md:w-10 bg-[#E5D0CD]/45" />
                </div>

                {/* Day number */}
                <div className="relative flex items-center justify-center px-3 sm:px-4 md:px-5">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 mx-auto h-[70%] max-h-[180px] w-[100px] sm:w-[140px] md:w-[170px] rounded-full bg-gradient-to-b from-[#FACBC5]/40 via-[#FACBC5]/30 to-transparent blur-[28px] opacity-80"
                  />
                  <span
                    className={`${cinzel.className} relative text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7rem] font-light leading-none tracking-wider text-white`}
                    style={{
                      textShadow: "0 0 22px rgba(250,203,197,0.9), 0 0 40px rgba(250,203,197,0.7)",
                      filter: "drop-shadow(0 0 26px rgba(250,203,197,0.65))",
                    }}
                  >
                    {weddingDayNumber}
                  </span>
                </div>

                {/* Time */}
                <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
                  <span className="h-[0.5px] w-6 sm:w-8 md:w-10 bg-[#E5D0CD]/45" />
                  <span
                    className={`${cinzel.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-light text-white`}
                    style={{ textShadow: "0 2px 14px rgba(24,113,83,0.65)" }}
                  >
                    {ceremonyTime.split(",")[0]}
                  </span>
                  <span className="h-[0.5px] flex-1 bg-[#E5D0CD]/45" />
                </div>
              </div>

              <span
                className={`${cinzel.className} text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] font-light text-white`}
                style={{ textShadow: "0 2px 14px rgba(24,113,83,0.65)" }}
              >
                {weddingYear}
              </span>
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2">
            <p
              className={`${cinzel.className} text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.22em] sm:tracking-[0.26em] md:tracking-[0.3em] text-[#F0F0EE] font-medium`}
              style={{
                textShadow: "0 2px 18px rgba(0,0,0,0.9)",
              }}
            >
              {siteConfig.ceremony.venue}
            </p>
            <p
              className={`${cinzel.className} text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.15em] text-[#F0F0EE]/90 font-light px-2 sm:px-4 md:px-8 whitespace-nowrap`}
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              }}
            >
              Reception to follow at {siteConfig.reception.venue}
            </p>
          </div>

          {/* Call-to-action section */}
          <div className="pt-3 sm:pt-4 md:pt-5 flex flex-col gap-3 sm:gap-4 items-center max-w-2xl mx-auto w-full px-4">
            <p
              className={`${cinzel.className} text-[0.7rem] sm:text-xs md:text-sm lg:text-base uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#F0F0EE]/95 font-normal leading-relaxed text-center px-4`}
              style={{
                textShadow: "0 2px 14px rgba(0,0,0,0.7)",
              }}
            >
              Your presence, prayers, and love will mean the world to us.
            </p>

            {/* Call-to-action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch">
            <a
              href="#guest-list"
              className={`${cormorant.className} group relative flex-1 sm:min-w-[200px] md:min-w-[220px] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 10px 32px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.35), 0 6px 20px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.3)";
              }}
            >
              {/* Premium white gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-white/95 to-white/90 opacity-100 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
              <span className="relative z-10 inline-flex h-full min-h-[3rem] sm:min-h-[3.25rem] w-full items-center justify-center px-6 sm:px-8 text-[0.65rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.32em] sm:tracking-[0.36em] text-black font-semibold transition-all duration-300" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                Confirm Attendance
              </span>
            </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
