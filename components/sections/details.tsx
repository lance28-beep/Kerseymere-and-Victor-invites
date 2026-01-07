"use client"

import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import {
  Clock,
  Utensils,
  Car,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const ceremonyLocation = siteConfig.ceremony.location
  const receptionLocation = siteConfig.reception.location

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showImageModal) {
        setShowImageModal(null)
      }
    }

    if (showImageModal) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [showImageModal])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Generate Google Maps links
  const ceremonyMapsLink = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.ceremony.location)}`
  const receptionMapsLink = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.reception.location)}`

  // Palettes (used only for color chips in attire card) - Wedding motif
  const sponsorPalette = ["#6A1324", "#8B1A2E", "#A02040"]
  const guestPalette = ["#DEA8B6", "#BF7D8B", "#A05969", "#903749", "#7B1E30"]
  const secondaryPalette = ["#6A1324", "#FFFFFF", "#000000", "#8B1A2E", "#4A0E1A"]

  const openInMaps = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer")
  }

  return (
    <Section
      id="details"
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      {/* Header */}
      <div className="relative z-30 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4">
        {/* Small label */}
        <p
          className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] text-white mb-2`}
        >
          Ceremony & Reception Details
        </p>

        <h2
          className="style-script-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-1.5 sm:mb-3 md:mb-4"
        >
          Details
        </h2>

        <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-white max-w-xl mx-auto leading-relaxed px-2">
          Everything you need to join us as we say&nbsp;
          <span className="font-semibold text-white">"I do."</span>
        </p>

        {/* Decorative element below subtitle - wedding motif colors */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="w-8 sm:w-12 md:w-16 h-px bg-white/40" />
          <div className="w-1.5 h-1.5 bg-[#6A1324] rounded-full" style={{ boxShadow: "0 0 8px rgba(106,19,36,0.6)" }} />
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-[#6A1324] rounded-full" style={{ boxShadow: "0 0 8px rgba(106,19,36,0.6)" }} />
          <div className="w-8 sm:w-12 md:w-16 h-px bg-white/40" />
        </div>
      </div>

      {/* Ceremony & Reception Locations (separate cards) */}
      <div className="relative z-10 mb-4 sm:mb-8 max-w-6xl mx-auto px-3 sm:px-5 space-y-3 sm:space-y-4">
        <div className="text-center text-white">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase">
            Ceremony &amp; Reception Location
          </p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-white">
            {ceremonyLocation} • {receptionLocation}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              key: "ceremony",
              label: "Ceremony",
              venue: siteConfig.ceremony.venue,
              location: siteConfig.ceremony.location,
              date: siteConfig.ceremony.date,
              time: siteConfig.ceremony.time,
              mapLink: ceremonyMapsLink,
              gradient: "from-[#6A1324] via-[#8B1A2E] to-black",
              image: "/Details/Capilla De Sta. Rita De Cascia.jpg",
            },
            {
              key: "reception",
              label: "Reception",
              venue: siteConfig.reception.venue,
              location: siteConfig.reception.location,
              date: siteConfig.reception.date,
              time: siteConfig.reception.time,
              mapLink: receptionMapsLink,
              gradient: "from-[#6A1324] via-[#8B1A2E] to-black",
              image: "/Details/Villa Leonora Resort & Event Venue.jpg",
            },
          ].map((info) => (
            <div
              key={info.key}
              className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/20 bg-gradient-to-b shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group hover:scale-[1.01]"
              style={{ backgroundImage: undefined }}
            >
              {/* Top image */}
              <div className="relative h-52 sm:h-64 md:h-72 w-full">
                <Image
                  src={info.image}
                  alt={info.location}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#6A1324]/90 via-[#6A1324]/60 to-transparent`} />
                <div className="absolute inset-0 flex flex-col justify-end px-3 sm:px-6 pb-3 sm:pb-6 text-white">
                  <p className="style-script-regular text-xl sm:text-2xl md:text-3xl font-normal leading-none drop-shadow-md">
                    {info.label}
                  </p>
                  <h3 className="style-script-regular text-2xl sm:text-4xl font-normal leading-tight drop-shadow-lg">
                    {info.venue}
                  </h3>
                </div>
              </div>

              {/* Details panel */}
              <div className="bg-white/95 text-black px-3 sm:px-6 py-4 sm:py-6 space-y-4 backdrop-blur-sm border-t border-[#6A1324]/20">
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-left">
                    <div className="rounded-md border border-[#6A1324]/40 bg-white/90 px-2.5 py-2 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-[#6A1324] uppercase mb-0.5">
                        Date
                      </p>
                      <p className="text-sm sm:text-base font-bold text-black">{info.date}</p>
                    </div>
                    <div className="rounded-md border border-[#6A1324]/40 bg-white/90 px-2.5 py-2 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-[#6A1324] uppercase mb-0.5">
                        {info.label}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-black">{info.time}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                  <button
                    onClick={() => openInMaps(info.mapLink)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-white text-black py-2.5 sm:py-3 shadow-lg hover:translate-y-[-2px] hover:bg-white/95 transition-all text-xs sm:text-sm font-semibold relative overflow-hidden group border border-[#6A1324]/20"
                    style={{
                      boxShadow: "0 6px 24px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.2)";
                    }}
                  >
                    {/* Premium white gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-white/95 to-white/90 opacity-100 group-hover:opacity-100 transition-opacity duration-300" />
                    <Navigation className="w-4 h-4 relative z-10 text-black" />
                    <span className="relative z-10">Get Directions</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(info.location, info.key)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#6A1324]/40 bg-white/90 text-black py-2.5 sm:py-3 hover:bg-white hover:border-[#6A1324]/60 transition-all text-xs sm:text-sm font-semibold"
                  >
                    {copiedItems.has(info.key) ? (
                      <>
                        <Check className="w-4 h-4 text-black" />
                        <span className="text-black">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-black" />
                        <span className="text-black">Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information - Compact for mobile */}
      <div className="relative z-10 mb-4 sm:mb-7 max-w-4xl mx-auto px-3 sm:px-5">
        <div className="text-center mb-3 sm:mb-5">
          <h3 className="text-base sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-white">
            Important Information
          </h3>
          <p className="text-[11px] sm:text-xs md:text-sm text-white max-w-xl mx-auto leading-relaxed">
            Kindly take note of these details to help the day flow smoothly and beautifully.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Attire Guidelines */}
          <div className="relative rounded-2xl border border-white/20 bg-white/90 backdrop-blur-lg shadow-[0_18px_40px_rgba(0,0,0,0.3)] p-3.5 sm:p-5 overflow-hidden">
            <div className="mb-2.5 sm:mb-3 relative z-10 text-center">
              <h4 className="text-[0.75rem] sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#6A1324]">
                Attire &amp; Motif
              </h4>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border border-[#6A1324]/40 shadow-xl bg-white p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="text-center space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-black">
                  {siteConfig.dressCode.note}
                </p>
                <p className="text-xs sm:text-sm text-black/80">
                  Please dress within our wedding colors to help create a soft, elegant romantic celebration.
                </p>
              </div>

              <div className="space-y-4">
                {/* Principal Sponsors */}
                <div className="border-t border-[#6A1324]/40 pt-4">
                  <h5 className="font-semibold text-xs sm:text-sm md:text-base text-black mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#6A1324] rounded-full"></span>
                    Principal Sponsors
                  </h5>
                  <p className="text-[10px] sm:text-xs text-black/70 mb-3">Kindly align attire below.</p>
                  <div className="relative w-full aspect-[4/3] sm:aspect-[5/3] rounded-xl overflow-hidden border-2 border-[#6A1324]/40 bg-white mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => setShowImageModal("principal-sponsors")}
                  >
                    <Image
                      src="/Details/sponsors.png"
                      alt="Principal sponsors attire guideline"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 700px, (min-width: 640px) 600px, 100vw"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-xl"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <div className="bg-[#6A1324]/5 rounded-lg p-3 border border-[#6A1324]/20">
                      <p className="text-black mb-1.5">
                        <span className="font-semibold text-[#6A1324]">Female:</span> Burgundy/Maroon Formal Dress
                      </p>
                      <p className="text-black">
                        <span className="font-semibold text-[#6A1324]">Male:</span> Barong, Black Slacks, Leather Shoes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Entourage */}
                <div className="border-t border-[#6A1324]/40 pt-4">
                  <h5 className="font-semibold text-xs sm:text-sm md:text-base text-black mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#6A1324] rounded-full"></span>
                    Entourage
                  </h5>
                  <p className="text-[10px] sm:text-xs text-black/70 mb-3">Please follow the attire guidelines below.</p>
                  <div className="relative w-full aspect-[4/3] sm:aspect-[5/3] rounded-xl overflow-hidden border-2 border-[#6A1324]/40 bg-white mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => setShowImageModal("entourage")}
                  >
                    <Image
                      src="/Details/entourage.png"
                      alt="Entourage attire guideline"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 700px, (min-width: 640px) 600px, 100vw"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-xl"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <div className="bg-[#6A1324]/5 rounded-lg p-3 border border-[#6A1324]/20 space-y-2">
                      <p className="text-black">
                        <span className="font-semibold text-[#6A1324]">Female:</span> Burgundy Formal Dress
                      </p>
                      <p className="text-black">
                        <span className="font-semibold text-[#6A1324]">Male:</span> White Long Sleeves, Black Slacks, Leather Shoes, Burgundy Vest & Bow Tie
                      </p>
                      <p className="text-black">
                        <span className="font-semibold text-[#6A1324]">Flower Girls:</span> Burgundy Dress
                      </p>
                      <p className="text-black">
                        <span className="font-semibold text-[#6A1324]">Banner Bearer:</span> Black Tuxedo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wedding Guests */}
                <div className="border-t border-[#6A1324]/40 pt-4">
                  <h5 className="font-semibold text-xs sm:text-sm md:text-base text-black mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#6A1324] rounded-full"></span>
                    Wedding Guests
                  </h5>
                  <p className="text-[10px] sm:text-xs text-black/70 mb-3">We encourage you to dress according to our wedding colors.</p>
                  <div className="relative w-full aspect-[4/3] sm:aspect-[5/3] rounded-xl overflow-hidden border-2 border-[#6A1324]/40 bg-white mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => setShowImageModal("guests")}
                  >
                    <Image
                      src="/Details/ladiesDress.png"
                      alt="Guest attire guideline"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 700px, (min-width: 640px) 600px, 100vw"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-xl"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <div className="bg-gradient-to-br from-[#DEA8B6]/10 via-[#BF7D8B]/10 to-[#7B1E30]/10 rounded-lg p-3 border border-[#6A1324]/20">
                      <p className="text-black font-semibold mb-2">
                        Shades of Burgundy: Semi-formal
                      </p>
                      <p className="text-black mb-3">
                        Please dress within our wedding colors to help create a soft, elegant romantic celebration.
                      </p>
                      <div className="pt-2 border-t border-[#6A1324]/20">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#6A1324] mb-2">
                          Color Palette
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guestPalette.map((color) => (
                            <span
                              key={color}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrival Time & Reception Guidelines */}
          <div className="relative rounded-2xl border border-white/20 bg-white/90 backdrop-blur-lg shadow-[0_18px_40px_rgba(0,0,0,0.3)] p-3.5 sm:p-5 overflow-hidden">
            <div className="space-y-4 sm:space-y-5">
              {/* Arrival Time */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#6A1324]/40 shadow-xl bg-white p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-[0.75rem] sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#6A1324] mb-3">
                    Arrival Time
                  </h4>
                  <div className="space-y-2 sm:space-y-2.5">
                    <p className="text-xs sm:text-sm text-black leading-relaxed">
                      Kindly arrive by <span className="font-semibold text-[#6A1324]">{siteConfig.ceremony.guestsTime}</span> so we can begin the wedding ceremony promptly at exactly <span className="font-semibold text-[#6A1324]">{siteConfig.ceremony.time}</span>.
                    </p>
                    <p className="text-xs sm:text-sm text-black leading-relaxed">
                      Your punctuality means so much to us — and don&apos;t forget to have a light snack beforehand so you can enjoy the celebration comfortably!
                    </p>
                  </div>
                </div>
              </div>

              {/* Reception Guidelines */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#6A1324]/40 shadow-xl bg-white p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-[0.75rem] sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#6A1324] mb-3">
                    Reception Guidelines
                  </h4>
                  <div className="space-y-2 sm:space-y-2.5">
                    <p className="text-xs sm:text-sm text-black leading-relaxed">
                      The seating will be formal, RSVP-style. That's why we're asking you to fill out this invitation form to secure your spot. Kindly do not bring plus ones unless explicitly stated in your invitation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Travel & Parking - Wedding motif */}
          <div className="relative rounded-2xl border border-white/20 bg-white/90 backdrop-blur-lg shadow-[0_18px_40px_rgba(0,0,0,0.3)] p-3.5 sm:p-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-2.5 sm:mb-3 relative z-10">
              <div className="p-1.5 rounded-full shadow-md bg-white/95 border border-[#6A1324]/40">
                <Car className="w-3.5 h-3.5 text-[#6A1324]" />
              </div>
              <h4 className="font-semibold text-xs sm:text-base text-black">Parking &amp; Travel</h4>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Parking */}
              <div className="rounded-xl p-2.5 sm:p-3 border border-[#6A1324]/40 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#6A1324] text-white">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] sm:text-sm font-semibold text-black">Parking Available</p>
                    <p className="text-[10px] sm:text-xs text-black/80">
                      Parking is available at the venue. Please arrive early to find a comfortable spot.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transportation */}
              <div className="rounded-xl p-2.5 sm:p-3 border border-[#6A1324]/40 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-black text-white">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] sm:text-sm font-semibold text-black">Transportation</p>
                    <p className="text-[10px] sm:text-xs text-black/80">
                      Private vehicles and local transport are welcome. Coordinate with friends or family and plan your
                      route ahead of time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-xl p-2.5 sm:p-3 border border-[#6A1324]/30 bg-white">
                <p className="text-[11px] sm:text-sm font-semibold mb-2 flex items-center gap-2 text-black">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#6A1324]/10 text-[#6A1324]">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  Quick Tips
                </p>
                <ul className="text-[10px] sm:text-xs space-y-1 text-black/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#6A1324] mt-0.5">•</span>
                    <span>Plan your route ahead to avoid unexpected delays.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6A1324] mt-0.5">•</span>
                    <span>Please avoid walking during the ceremony. Approach the coordinator or wait to be guided.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6A1324] mt-0.5">•</span>
                    <span>Coordinate carpooling with friends or family when possible.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "#6A1324", opacity: 0.15 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "#000000", opacity: 0.2, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-gradient-to-br from-white via-white rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "#6A132433", backgroundColor: "#FFFFFF" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, #6A1324, #8B1A2E, #000000)" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-black/5 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#6A132433", color: "#000000" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#6A1324] transition-colors" />
            </button>

            {/* Venue/Attire badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#6A132433" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="#6A1324" style={{ color: "#6A1324" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#000000" }}>
                      Ceremony Venue
                    </span>
                  </>
                ) : showImageModal === "reception" ? (
                  <>
                    <Utensils className="w-4 h-4" style={{ color: "#6A1324" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#000000" }}>
                      Reception Venue
                    </span>
                  </>
                ) : showImageModal === "principal-sponsors" ? (
                  <>
                    <Heart className="w-4 h-4" fill="#6A1324" style={{ color: "#6A1324" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#000000" }}>
                      Principal Sponsors Attire
                    </span>
                  </>
                ) : showImageModal === "entourage" ? (
                  <>
                    <Heart className="w-4 h-4" fill="#6A1324" style={{ color: "#6A1324" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#000000" }}>
                      Entourage Attire
                    </span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" fill="#6A1324" style={{ color: "#6A1324" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#000000" }}>
                      Guest Attire
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={
                  showImageModal === "ceremony"
                    ? "/Details/Capilla De Sta. Rita De Cascia.jpg"
                    : showImageModal === "reception"
                    ? "/Details/Villa Leonora Resort & Event Venue.jpg"
                    : showImageModal === "principal-sponsors"
                    ? "/Details/sponsors.png"
                    : showImageModal === "entourage"
                    ? "/Details/entourage.png"
                    : "/Details/ladiesDress.png"
                }
                alt={
                  showImageModal === "ceremony"
                    ? siteConfig.ceremony.location
                    : showImageModal === "reception"
                    ? siteConfig.reception.location
                    : showImageModal === "principal-sponsors"
                    ? "Principal sponsors attire guideline"
                    : showImageModal === "entourage"
                    ? "Entourage attire guideline"
                    : "Guest attire guideline"
                }
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-white to-white/95 backdrop-blur-sm border-t-2 relative"
              style={{ borderColor: "#6A13241f", backgroundColor: "#FFFFFF" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#6A1324]/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3"
                      style={{ color: "#000000" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6" fill="#6A1324" style={{ color: "#6A1324" }} />
                      ) : showImageModal === "reception" ? (
                        <Utensils className="w-6 h-6" style={{ color: "#6A1324" }} />
                      ) : (
                        <Heart className="w-6 h-6" fill="#6A1324" style={{ color: "#6A1324" }} />
                      )}
                      {showImageModal === "ceremony"
                        ? siteConfig.ceremony.venue
                        : showImageModal === "reception"
                        ? siteConfig.reception.venue
                        : showImageModal === "principal-sponsors"
                        ? "Principal Sponsors Attire"
                        : showImageModal === "entourage"
                        ? "Entourage Attire"
                        : "Guest Attire Guidelines"}
                    </h3>
                    {(showImageModal === "ceremony" || showImageModal === "reception") && (
                      <div className="flex items-center gap-2 text-sm opacity-70" style={{ color: "#000000" }}>
                        <MapPin className="w-4 h-4" style={{ color: "#6A1324" }} />
                        <span>
                          {showImageModal === "ceremony"
                            ? siteConfig.ceremony.location
                            : siteConfig.reception.location}
                        </span>
                      </div>
                    )}

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          opacity: 0.95,
                          borderColor: "#6A132433",
                        }}
                      >
                        <Clock className="w-4 h-4" style={{ color: "#6A1324" }} />
                        <span>
                          {siteConfig.ceremony.date} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          opacity: 0.95,
                          borderColor: "#6A132433",
                        }}
                      >
                        <Clock className="w-4 h-4" style={{ color: "#6A1324" }} />
                        <span>
                          {siteConfig.reception.date} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons - only show for venue modals */}
                  {(showImageModal === "ceremony" || showImageModal === "reception") && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            showImageModal === "ceremony"
                              ? siteConfig.ceremony.location
                              : siteConfig.reception.location,
                            `modal-${showImageModal}`,
                          )
                        }
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-black/5 whitespace-nowrap"
                        title="Copy address"
                        style={{ borderColor: "#6A132433", color: "#000000" }}
                      >
                        {copiedItems.has(`modal-${showImageModal}`) ? (
                          <>
                            <Check className="w-4 h-4 text-black" />
                            <span className="text-black">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-black" />
                            <span className="text-black">Copy Address</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                        }
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap text-white"
                        style={{
                          background:
                            showImageModal === "ceremony"
                              ? "linear-gradient(to right, #6A1324, #8B1A2E)"
                              : "linear-gradient(to right, #000000, #6A1324)",
                          color: "#FFFFFF",
                        }}
                      >
                        <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Get Directions</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional info */}
                <div className="flex items-center gap-2 text-xs opacity-65" style={{ color: "#000000" }}>
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}


