"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Mail, Users, MapPin, Calendar, Crown } from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

export function BookOfGuests() {
  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  return (
    <div
      id="guests"
      className="relative z-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 py-4 sm:py-8 md:py-12 lg:py-16 overflow-hidden isolate"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Background image */}
        <img
          src="/Details/newBackground.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        {/* Premium dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Section Header - More Compact */}
      <div className="relative z-10 text-center mb-3 sm:mb-4 md:mb-6 px-2 sm:px-3 md:px-4">
        {/* Small label */}
        <p
          className={`${cormorant.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-white/90 mb-1 sm:mb-1.5`}
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}
        >
          Our Cherished Guests
        </p>

        <h2
          className="style-script-regular text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-1 sm:mb-2 md:mb-3"
          style={{ textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}
        >
          Book of Guests
        </h2>

        <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm text-white/90 font-light max-w-lg mx-auto leading-tight px-2`}>
          See who&apos;s celebrating with us on our special day
        </p>

        {/* Decorative element - Smaller with gold accent */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5 md:mt-3">
          <div className="w-6 sm:w-10 md:w-12 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#D4AF37]/90 rounded-full" style={{ boxShadow: "0 0 8px rgba(212,175,55,0.5)" }} />
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/85 rounded-full" />
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#D4AF37]/90 rounded-full" style={{ boxShadow: "0 0 8px rgba(212,175,55,0.5)" }} />
          <div className="w-6 sm:w-10 md:w-12 h-px bg-gradient-to-l from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      {/* Guests content */}
      <div className="relative">
        {/* Stats card - Simplified */}
        <div className="text-center mb-2.5 sm:mb-4 md:mb-6 px-2 sm:px-4 md:px-6">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative bg-white/95 backdrop-blur-md border border-white/30 rounded-lg sm:rounded-xl p-3 sm:p-5 md:p-6 shadow-md">
              
              {/* Refresh button */}
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 disabled:opacity-50 group z-10"
                title="Refresh counts"
              >
                <RefreshCw className={`h-3 w-3 sm:h-3.5 sm:w-3.5 text-black transition-transform ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} duration-500`} />
              </button>

              {/* Main Count with inline text */}
              <div className="mb-1.5 sm:mb-2.5">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className={`${cormorant.className} text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 transition-all duration-500 ${showIncrease ? 'scale-110 text-green-600' : ''}`}>
                    {totalGuests}
                  </h3>
                  {showIncrease && (
                    <TrendingUp className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-green-600 animate-bounce" />
                  )}
                  <p className={`${cormorant.className} text-sm sm:text-lg md:text-xl text-gray-700 font-medium leading-tight`}>
                    {totalGuests === 1 ? "Guest" : "Guests"} Celebrating With Us
                  </p>
                </div>
              </div>

              {/* RSVP Count */}
              <p className={`${cormorant.className} text-xs sm:text-base text-gray-600 mb-2 sm:mb-3`}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              
              {/* Message */}
              <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight`}>
                Thank you for confirming your RSVP! Your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* Guest List Display */}
        {confirmedGuests.length > 0 && (
          <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {confirmedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="relative group bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black/50"
                >
                  {/* Guest Header */}
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-2.5 md:mb-3">
                    {/* Avatar - Mobile Optimized */}
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-black via-gray-800 to-black flex items-center justify-center shadow-md ring-2 ring-white/50">
                        <span className="text-white font-semibold text-xs sm:text-base md:text-lg">
                          {getInitials(guest.name)}
                        </span>
                      </div>
                      {/* VIP Badge - Mobile Optimized */}
                      {guest.isVip && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-md">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3.5 md:w-3.5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Guest Info - Mobile Optimized */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 sm:mb-1.5">
                        <h3 className="text-xs sm:text-base md:text-lg font-semibold sm:font-bold text-gray-900 leading-tight mb-0.5">
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p className="text-[9px] sm:text-[10px] md:text-xs text-black/70 font-medium">
                            {guest.role}
                          </p>
                        )}
                      </div>

                      {/* Email - Mobile Optimized */}
                      {guest.email && (
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-1.5 sm:mb-2 md:mb-3">
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{guest.email}</span>
                        </div>
                      )}

                      {/* Info Badges - Mobile Optimized */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                        {/* Guest count badge */}
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-black/10 to-black/10 border border-black/30 rounded sm:rounded-md md:rounded-lg">
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-black" />
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-black">
                            {guest.allowedGuests} {guest.allowedGuests === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>

                        {/* Table badge */}
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-black/15 to-black/10 border border-black/40 sm:border-2 rounded sm:rounded-md md:rounded-lg">
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-black" />
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold sm:font-bold text-black">
                            {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                              <>Table {guest.tableNumber}</>
                            ) : (
                              <span className="text-gray-500 font-medium">Not Assigned</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Message - Mobile Optimized */}
                      {guest.message && guest.message.trim() !== "" && (
                        <div className="relative mb-1.5 sm:mb-2.5 md:mb-3 p-2 sm:p-3 md:p-5 bg-gradient-to-br from-white via-white to-white rounded sm:rounded-lg md:rounded-2xl border border-black/30 shadow-sm overflow-hidden">
                          {/* Decorative corner elements - smaller on mobile */}
                          <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.08]">
                            <svg viewBox="0 0 100 100" className="text-black" fill="currentColor">
                              <path d="M0,0 L100,0 L0,100 Z" />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.08]">
                            <svg viewBox="0 0 100 100" className="text-black" fill="currentColor">
                              <path d="M100,100 L0,100 L100,0 Z" />
                            </svg>
                          </div>
                          
                          {/* Opening quote - smaller on mobile */}
                          <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2 text-black/25">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                            </svg>
                          </div>
                          
                          {/* Closing quote - smaller on mobile */}
                          <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 text-black/25">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7l-2 4v6h6v-6h-3z" />
                            </svg>
                          </div>

                          {/* Message content */}
                          <div className="relative px-0.5 sm:px-1">
                            <p className="text-[10px] sm:text-xs md:text-base text-gray-700 leading-tight sm:leading-relaxed italic font-medium">
                              {guest.message}
                            </p>
                          </div>

                          {/* Elegant border accent - smaller on mobile */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-0.5 md:w-1 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-transparent via-black to-transparent rounded-r-full" />
                        </div>
                      )}

                      {/* Companions - Mobile Optimized */}
                      {guest.companions && guest.companions.length > 0 && (
                        <div className="pt-1.5 sm:pt-2 md:pt-2.5 border-t border-gray-100">
                          <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-black" />
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-700">Companions</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {guest.companions.map((companion, idx) => (
                              <div key={idx} className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-white border border-black/30 rounded sm:rounded-md md:rounded-lg hover:border-black/50 transition-colors">
                                <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-800">{companion.name}</span>
                                {companion.relationship && (
                                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 bg-gray-50 px-1 sm:px-1.5 py-0.5 rounded-full">
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer - Mobile Optimized */}
                      <div className="flex items-center gap-1 pt-1.5 sm:pt-2 md:pt-2.5 mt-1.5 sm:mt-2 md:mt-2.5 border-t border-gray-100">
                        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500">
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
