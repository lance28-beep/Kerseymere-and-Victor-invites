"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import { Section } from "@/components/section"
import { QRCodeCanvas } from "qrcode.react"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

export function SnapShare() {
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags] = useState(false)
  const [copiedDriveLink, setCopiedDriveLink] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const websiteUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
  const driveLink = siteConfig.snapShare?.googleDriveLink || ""
  const hashtags = [
    "#VICTORfoundhisLucKERSEYcharm",
    "#THORoadToForeverWithKERSEY",
    "#KERSEYmadeVIComplete",
  ]
  const allHashtagsText = hashtags.join(" ")
  const groomNickname = siteConfig.couple.groomNickname
  const brideNickname = siteConfig.couple.brideNickname
  const sanitizedGroomName = groomNickname.replace(/\s+/g, "")
  const sanitizedBrideName = brideNickname.replace(/\s+/g, "")

  const shareText = `Celebrate ${groomNickname} & ${brideNickname}'s wedding! Explore the details and share your special memories: ${websiteUrl} ${allHashtagsText} ✨`

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])


  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const encodedUrl = encodeURIComponent(websiteUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<string, string> = {
      instagram: `https://www.instagram.com/`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      tiktok: `https://www.tiktok.com/`,
    }

    const target = urls[platform]
    if (target) {
      window.open(target, "_blank", "width=600,height=400")
    }
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("snapshare-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroomName.toLowerCase()}-${sanitizedBrideName.toLowerCase()}-wedding-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadDriveQRCode = () => {
    const canvas = document.getElementById("drive-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "drive-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtagsText)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyDriveLink = async () => {
    if (driveLink) {
      try {
        await navigator.clipboard.writeText(driveLink)
        setCopiedDriveLink(true)
        setTimeout(() => setCopiedDriveLink(false), 2000)
      } catch (err) {
        console.error("Failed to copy: ", err)
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <Section
      id="snap-share"
      className="relative overflow-hidden py-8 sm:py-16 md:py-20 lg:py-24 bg-transparent"
    >
      <div className="relative max-w-6xl mx-auto px-3 sm:px-6 md:px-8">
        <motion.div
          className="text-center mb-5 sm:mb-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white">
            Share Your Memories
          </div>
          <h2
            className="style-script-regular text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-[0_18px_40px_rgba(10,0,25,0.8)] mt-2 sm:mt-4"
          >
            Capture & Share the Celebration
          </h2>
          <p className={`${cormorant.className} text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto mt-2 sm:mt-4 leading-relaxed px-2`}>
            Capture the beautiful moments of {groomNickname} & {brideNickname}'s wedding day. Share your favorite memories so our keepsake gallery glows with every smile, embrace, and celebration from this special day.
          </p>
          <div className="mx-auto mt-3 sm:mt-5 h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-10" variants={staggerChildren} initial="initial" animate="animate">
          <motion.div
            className="p-[1.5px] rounded-xl sm:rounded-[22px] bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50 h-full lg:order-1"
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-8 shadow-xl border border-white/20 h-full flex flex-col justify-start overflow-hidden">
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
              <div className="relative z-10 flex flex-col w-full">
                <h4 className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-4 text-center`}>
                  Our Favorite Moments
                </h4>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-3 md:gap-4">
                  <motion.div
                    className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-white/30 hover:border-white/50 transition-all"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image src="/mobile-background/couple (7).jpg" alt="Wedding moment 1" fill className="object-cover" />
                  </motion.div>
                  <motion.div
                    className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-white/30 hover:border-white/50 transition-all"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image src="/mobile-background/couple (3).jpg" alt="Wedding moment 2" fill className="object-cover" />
                  </motion.div>
                  <motion.div
                    className="relative col-span-2 aspect-[3/2] rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-white/30 hover:border-white/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image src="/desktop-background/couple (2).jpg" alt="Wedding moment 3" fill className="object-cover" />
                  </motion.div>
                </div>
                <p className={`${cormorant.className} text-white text-xs sm:text-sm text-center mt-3 sm:mt-5 px-1.5 leading-relaxed`}>
                  Share your snapshots to be featured in our keepsake gallery.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-3 sm:space-y-5 lg:space-y-6 h-full flex flex-col lg:order-2" variants={fadeInUp}>
            <div className="p-[1.5px] rounded-xl sm:rounded-[22px] bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50 flex-1">
              <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-8 shadow-xl border border-white/20 text-center h-full flex flex-col overflow-hidden">
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                <h4 className={`${cormorant.className} relative z-10 text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3`}>
                  Share Our Wedding Website
                </h4>
                <p className={`${cormorant.className} relative z-10 text-white text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed px-1`}>
                  Spread the word about {groomNickname} & {brideNickname}'s wedding celebration. Share this QR code with friends and family so they can join the celebration.
                </p>
                <div className="relative z-10 mx-auto inline-flex flex-col items-center bg-white/90 backdrop-blur-sm p-2.5 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl shadow-md border border-white/40 mb-3 sm:mb-4 flex-1 justify-center">
                  <div className="mb-2 sm:mb-3 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-black/30">
                    <div className="bg-white p-1.5 sm:p-3 rounded-lg shadow-sm border border-black/30">
                      <QRCodeCanvas 
                        id="snapshare-qr" 
                        value={websiteUrl} 
                        size={isMobile ? 140 : 220} 
                        includeMargin 
                        className="bg-white" 
                      />
                    </div>
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-1.5 sm:gap-2 mx-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white text-black border border-black/40 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-medium`}>Download QR</span>
                  </button>
                </div>
                <p className={`${cormorant.className} relative z-10 text-white text-xs sm:text-sm mt-auto leading-relaxed`}>
                  Scan with any camera app to open the full invitation and schedule.
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-7 shadow-xl border border-white/20 overflow-hidden">
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
              <h5 className={`${cormorant.className} relative z-10 text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 text-center`}>
                Use Our Hashtags
              </h5>
              <p className={`${cormorant.className} relative z-10 text-white text-xs sm:text-sm text-center mb-3 sm:mb-4 leading-relaxed`}>
                Tag your photos and posts with our wedding hashtags to join the celebration!
              </p>
              
              <div className="relative z-10 space-y-2.5 sm:space-y-3 mb-3 sm:mb-4">
                {hashtags.map((hashtag, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-black/40 shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                      <span className={`${cormorant.className} text-black font-bold text-sm sm:text-base md:text-lg break-all flex-1 text-center sm:text-left`}>
                        {hashtag}
                      </span>
                      <button
                        onClick={() => copyHashtag(hashtag, index)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-black/50 whitespace-nowrap flex-shrink-0 ${
                          copiedHashtagIndex === index ? "bg-green-600 from-green-600 to-green-500" : ""
                        }`}
                      >
                        {copiedHashtagIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className={`${cormorant.className} text-xs sm:text-sm font-medium`}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className={`${cormorant.className} text-xs sm:text-sm font-medium`}>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={copyAllHashtags}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 transition-all duration-200 shadow-md hover:shadow-lg hover:bg-white/30 hover:border-white/60 ${
                  copiedAllHashtags ? "bg-green-500/30 border-green-400/60" : ""
                }`}
              >
                {copiedAllHashtags ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className={`${cormorant.className} text-xs sm:text-sm font-semibold uppercase tracking-[0.15em]`}>All Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className={`${cormorant.className} text-xs sm:text-sm font-semibold uppercase tracking-[0.15em]`}>Copy All Hashtags</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-7 shadow-xl border border-white/20 overflow-hidden">
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
              <h5 className={`${cormorant.className} relative z-10 text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 text-center`}>
                Share on Social Media
              </h5>
              <p className={`${cormorant.className} relative z-10 text-white text-xs sm:text-sm text-center mb-3 sm:mb-4 leading-relaxed`}>
                Help spread the word about {groomNickname} & {brideNickname}'s wedding celebration. Share the event across your favorite platforms.
              </p>
              <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => shareOnSocial("instagram")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg border border-white/30"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className={`${cormorant.className} font-medium text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]`}>Instagram</span>
                </button>
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg border border-white/30"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className={`${cormorant.className} font-medium text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]`}>Facebook</span>
                </button>
                <button
                  onClick={() => shareOnSocial("tiktok")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg border border-white/30"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className={`${cormorant.className} font-medium text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]`}>TikTok</span>
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg border border-white/30"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className={`${cormorant.className} font-medium text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]`}>Twitter</span>
                </button>
              </div>
            </div>

            {driveLink && (
              <div className="p-[1.5px] rounded-xl sm:rounded-[22px] bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50">
                <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-7 shadow-xl border border-white/20 text-center overflow-hidden">
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                  <div className="relative z-10 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.32em] text-white mb-2 sm:mb-3">
                    Upload Your Photos & Videos
                  </div>
                  <p className={`${cormorant.className} relative z-10 text-white text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-1`}>
                    Help us capture our special day! Scan the QR or use the actions below to drop your clips into our shared Drive.
                  </p>
                  <div className="relative z-10 mx-auto inline-flex flex-col items-center bg-white/90 backdrop-blur-sm p-2.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-md border border-white/40 mb-3 sm:mb-4">
                    <div className="mb-2 sm:mb-3 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-black/30">
                      <div className="bg-white p-1.5 sm:p-3 rounded-lg shadow-sm border border-black/30">
                        <QRCodeCanvas id="drive-qr" value={driveLink} size={isMobile ? 130 : 200} includeMargin className="bg-white" />
                      </div>
                    </div>
                    <p className={`${cormorant.className} text-black text-xs sm:text-sm`}>📱 Scan with your camera app</p>
                  </div>
                  <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                    <button
                      onClick={copyDriveLink}
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white text-black border border-black/40 shadow-sm hover:shadow-md hover:bg-gray-50 text-xs sm:text-sm transition-all ${
                        copiedDriveLink ? "bg-green-100 border-green-300" : ""
                      }`}
                    >
                      {copiedDriveLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-medium`}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-medium`}>Copy Link</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadDriveQRCode}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white text-black border border-black/40 shadow-sm hover:shadow-md hover:bg-gray-50 text-xs sm:text-sm transition-all font-semibold"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-medium`}>Download QR</span>
                    </button>
                    <a
                      href={driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 shadow-sm hover:shadow-md hover:bg-white/30 text-xs sm:text-sm transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-medium`}>Open Drive</span>
                    </a>
                  </div>
                  <p className={`${cormorant.className} relative z-10 text-white text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed`}>or tap "Open Google Drive Folder."</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div className="text-center mt-5 sm:mt-10" variants={fadeInUp}>
          <div className="bg-white/10 rounded-xl sm:rounded-[22px] p-4 sm:p-6 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-white/20 max-w-3xl mx-auto backdrop-blur-xl">
            <p className={`${cormorant.className} text-white text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 px-2`}>
              Thank you for helping make {groomNickname} & {brideNickname}'s wedding celebration memorable. Your photos and messages create beautiful memories
              that will last a lifetime—keep sharing the joy throughout the evening.
            </p>
            <div className={`${cormorant.className} flex items-center justify-center gap-2 text-white text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.32em] uppercase`}>
              <span>See you in the celebration</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}