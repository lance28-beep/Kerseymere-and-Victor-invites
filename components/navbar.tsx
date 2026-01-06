"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/content/site"
import StaggeredMenu from "./StaggeredMenu"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#countdown", label: "Countdown" },
  { href: "#gallery", label: "Gallery" },
  { href: "#messages", label: "Messages" },
  { href: "#details", label: "Details" },
  { href: "#entourage", label: "Entourage" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#guest-list", label: "RSVP" },
  { href: "#registry", label: "Registry" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current != null) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener("scroll", onScroll as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sectionIds = navLinks.map(l => l.href.substring(1))
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))
        if (visible.length > 0) {
          const topMost = visible[0]
          if (topMost.target && topMost.target.id) {
            const newActive = `#${topMost.target.id}`
            setActiveSection(prev => (prev === newActive ? prev : newActive))
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const menuItems = useMemo(() => navLinks.map((l) => ({ label: l.label, ariaLabel: `Go to ${l.label}`, link: l.href })), [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? "bg-gradient-to-b from-gray-900/98 via-black/98 to-gray-900/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border-b border-[#D4AF37]/30"
          : "bg-gradient-to-b from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-lg border-b border-[#D4AF37]/20"
      }`}
    >
      {/* Premium white gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />
      {/* Luxury gold accent line when scrolled */}
      {isScrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent pointer-events-none" />
      )}
      {/* Premium white shimmer effect */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.04)_25%,rgba(212,175,55,0.02)_50%,rgba(255,255,255,0.04)_75%,transparent_100%)] opacity-60 pointer-events-none" />
      {/* Subtle luxury texture overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
              <Image
                src="/monogram/monogram.png"
                alt={`${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname} Monogram`}
                fill
                className="object-contain group-hover:scale-110 group-active:scale-105 transition-all duration-500 drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)] group-hover:drop-shadow-[0_6px_28px_rgba(212,175,55,0.6)]"
                style={{
                  filter: "brightness(0) saturate(100%) invert(1) drop-shadow(0 0 8px rgba(212,175,55,0.3))",
                }}
              />
            </div>
            
            {/* Luxury gold glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
            {/* Subtle gold ring on hover */}
            <div className="absolute -inset-1 rounded-full border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-500 -z-10" />
          </Link>

          <div className="hidden md:flex gap-2 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 lg:px-5 py-2.5 text-xs lg:text-sm ${cormorant.className} font-medium rounded-md transition-all duration-500 relative group ${
                    isActive
                      ? "text-[#D4AF37] bg-gradient-to-b from-[#D4AF37]/15 via-[#D4AF37]/10 to-[#D4AF37]/5 backdrop-blur-md shadow-[0_4px_20px_rgba(212,175,55,0.25)] border border-[#D4AF37]/40"
                      : "text-white/90 hover:text-[#D4AF37] hover:bg-gradient-to-b hover:from-white/10 hover:via-white/5 hover:to-transparent hover:border hover:border-[#D4AF37]/30 hover:shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:scale-105 active:scale-95 bg-transparent border border-transparent"
                  }`}
                >
                  {link.label}
                  {/* Luxury gold underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#D4AF37] via-[#F4E5C2] to-[#D4AF37] transition-all duration-500 rounded-full ${
                      isActive
                        ? "w-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                        : "w-0 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                    }`}
                  />
                  {/* Active indicator - luxury gold dot */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
                  )}
                  {/* Premium white gradient shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-[#D4AF37]/5 to-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  {/* Premium white-gold gradient glow on active */}
                  {isActive && (
                    <div className="absolute -inset-0.5 rounded-md bg-gradient-to-br from-[#D4AF37]/15 via-white/5 to-[#D4AF37]/10 blur-sm -z-10" />
                  )}
                  {/* Premium white top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-md" />
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center h-full">
            {/* Luxury gold halo for mobile menu */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#D4AF37]/15 via-[#D4AF37]/8 to-transparent blur-md pointer-events-none" />
              <StaggeredMenu
                position="left"
                items={menuItems}
                socialItems={[]}
                displaySocials={false}
                displayItemNumbering={true}
                menuButtonColor="#FFFFFF"
                openMenuButtonColor="#D4AF37"
                changeMenuColorOnOpen={true}
                colors={["#000000", "#1a1a1a", "#2a2a2a", "#D4AF37", "#F4E5C2"]}
                accentColor="#D4AF37"
                isFixed={true}
                onMenuOpen={() => {}}
                onMenuClose={() => {}}
              />
            </div>
          </div>
        </div>

      </div>
    </nav>
  )
}
