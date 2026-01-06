"use client"

import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export function Welcome() {
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  return (
    <Section
      id="welcome"
      className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-white/10 bg-gradient-to-b from-gray-900 via-black to-gray-900 backdrop-blur-2xl shadow-[0_16px_60px_rgba(0,0,0,0.6)] px-5 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12">
          {/* Premium gradient black background layers */}
          <div className="pointer-events-none absolute inset-0">
            {/* Gradient black background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-black/95 to-gray-900/95" />
            {/* Premium white gradient accents */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/20" />
            {/* Subtle radial highlights */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)] opacity-60" />
            <div className="absolute bottom-[-6rem] right-[-2rem] w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_60%)] opacity-50" />
            {/* Inner border glow */}
            <div className="absolute inset-[1px] rounded-[inherit] border border-white/10" />
          </div>

          <div className="relative text-center space-y-6 sm:space-y-7 md:space-y-8">
          {/* Main heading */}
          <div className="space-y-1.5 sm:space-y-2.5">
            <p
              className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] text-white/90`}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {brideName} &amp; {groomName}
            </p>
            <h2
              className="style-script-regular text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] text-white"
              style={{ textShadow: "0 4px 16px rgba(0,0,0,0.9)" }}
            >
              Welcome to our wedding website
            </h2>


            {/* Verse */}
            <div className="space-y-1">
              <p
                className={`${cormorant.className} text-xs sm:text-sm md:text-base text-white/90 italic`}
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
              >
                &quot;Love is patient, love is kind. It does not envy, it does not boast, it is not proud… It always protects, always trusts, always hopes, always perseveres.&quot;
              </p>
              <p
                className={`${cormorant.className} text-[0.65rem] sm:text-xs md:text-sm text-white/80 tracking-[0.2em] uppercase`}
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
              >
                1 Corinthians 13:4–7 (NIV)
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="h-px w-10 sm:w-16 md:w-20 bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.8)]" />
              <span className="h-px w-10 sm:w-16 md:w-20 bg-white/30" />
            </div>
          </div>

          {/* Body text */}
          <div
            className={`${cormorant.className} text-[0.85rem] sm:text-sm md:text-base leading-relaxed sm:leading-7 text-white/95 space-y-3 sm:space-y-4`}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
          >
            <p>
              We&apos;ve found a love that&apos;s a true blessing, and we give thanks to God for writing the
              beautiful story of our journey together. With hearts full of gratitude, we&apos;re excited to share
              this blessing with you! Thank you for your love, prayers, and support. We can&apos;t wait to celebrate
              this joyful day together!
            </p>
            <p>
              Feel free to browse through important information and other helpful reminders — everything you
              need to join us in this celebration!
            </p>
          </div>
          </div>
        </div>
      </div>
    </Section>
  )
}


