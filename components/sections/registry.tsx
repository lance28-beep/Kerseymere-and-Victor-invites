"use client"

import Image from "next/image"
import { Section } from "@/components/section"
import { Building2, Smartphone } from "lucide-react"

const paymentMethods = [
  {
    id: "gcash",
    label: "GCASH",
    description: "Mobile payment via GCASH",
    accent: "from-[#007BFF] to-[#0056B3]",
    Icon: Smartphone,
    qrSrc: "/QR/Gcash.png",
  },
  {
    id: "bdo",
    label: "BDO",
    description: "Bank transfer via BDO",
    accent: "from-[#A8AF8D] to-[#5B6B3C]",
    Icon: Building2,
    qrSrc: "/QR/BDO.png",
  },
] as const

export function Registry() {
  return (
    <Section
      id="registry"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20"
    >
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 sm:w-12 md:w-16 h-px bg-white/60" />
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
          <div className="w-8 sm:w-12 md:w-16 h-px bg-white/60" />
        </div>
        
        <h2 className="style-script-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-2 sm:mb-3 md:mb-4">
          Gift Guide
        </h2>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-light max-w-2xl mx-auto leading-relaxed px-2">
          With all that we have, we've been truly blessed. Your presence and prayers are all that we request. But if you were thinking of giving a gift to help us on our way, a monetary gift towards our beginning would really make our day. However, if you prefer to purchase a gift, feel free to surprise us in your own way.
        </p>
        
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative bg-[#F4F4F4]/95 backdrop-blur-md border border-[#B9AACB]/60 rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0_20px_60px_rgba(106,79,130,0.3)] p-4 sm:p-6 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B9AACB]/20 via-transparent to-[#6A4F82]/10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod.id}
                className="relative bg-white/95 rounded-xl sm:rounded-2xl border-2 border-dashed border-[#B9AACB]/40 p-5 sm:p-6 md:p-8 text-center shadow-[0_6px_24px_rgba(106,79,130,0.15)]"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F4F4F4] px-3 py-1 rounded-full shadow-sm border-2 border-[#B9AACB]/50 text-xs font-semibold tracking-[0.2em] text-[#6A4F82] uppercase">
                  {paymentMethod.label}
                </div>
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-[#B9AACB]/40 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white relative overflow-hidden">
                    <Image
                      src={paymentMethod.qrSrc}
                      alt={`${paymentMethod.label} QR code`}
                      fill
                      sizes="256px"
                      className="object-contain p-4"
                    />
                  </div>
                  <p className="text-sm sm:text-base text-[#6A4F82] max-w-md">
                    Scan the QR code to make a {paymentMethod.id === "gcash" ? "mobile payment" : paymentMethod.id === "bdo" ? "bank transfer via BDO" : "bank transfer"}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-white/90 italic">
            Thank you from the bottom of our hearts.
          </p>
        </div>
      </div>
    </Section>
  )
}
