"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide the global navbar while on /gallery
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Premium top bar with gradient black */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-gray-900/98 via-black/98 to-gray-900/98 border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        {/* Premium white gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-white/30 bg-white hover:bg-white/95 hover:border-white/50 transition-all duration-200 font-sans text-sm sm:text-base relative overflow-hidden group"
            style={{
              boxShadow: "0 6px 24px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {/* Premium white gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-white/95 to-white/90 opacity-100 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 text-base sm:text-lg">←</span>
            <span className="relative z-10 hidden xs:inline">Back to main page</span>
            <span className="relative z-10 xs:hidden">Back</span>
          </Link>
          <div className="text-xs sm:text-sm text-white/90 font-sans font-medium">Gallery</div>
        </div>
      </div>
      {children}
    </div>
  )
}






