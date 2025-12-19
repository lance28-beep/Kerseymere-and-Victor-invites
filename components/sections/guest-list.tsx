"use client"

import { useState, useEffect } from "react"
import { Section } from "@/components/section"
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  RefreshCw,
  X,
  Heart,
  Sparkles,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

export type GuestStatus = 'pending' | 'confirmed' | 'declined' | 'request';

export interface Companion {
  name: string;
  relationship: string;
}

export interface Guest {
  id: string;
  name: string;
  role: string;
  email?: string;
  contact?: string;
  message?: string;
  allowedGuests: number;
  companions?: Companion[];
  tableNumber?: string;
  isVip: boolean;
  status: GuestStatus;
  addedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [hasResponded, setHasResponded] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    role: "",
    email: "",
    contact: "",
    message: "",
    allowedGuests: 1,
    companions: [],
    tableNumber: "",
    isVip: false,
    status: "pending",
    addedBy: "",
  })

  // Sync companions with selectedGuest's allowedGuests (fixed from dashboard)
  useEffect(() => {
    if (selectedGuest) {
      const companionCount = Math.max(0, selectedGuest.allowedGuests - 1)
      const currentCompanions = formData.companions || []
      if (currentCompanions.length !== companionCount) {
        const newCompanions = [...currentCompanions]
        if (newCompanions.length < companionCount) {
          // Add slots
          for (let i = newCompanions.length; i < companionCount; i++) {
            newCompanions.push({ name: '', relationship: '' })
          }
        } else {
          // Remove slots
          newCompanions.splice(companionCount)
        }
        setFormData(prev => ({ ...prev, companions: newCompanions }))
      }
    }
  }, [selectedGuest, formData.companions])

  // Fetch all guests on component mount
  useEffect(() => {
    fetchGuests()
  }, [])

  // Normalize name: lowercase, remove special chars, trim spaces
  const normalizeName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')    // Normalize spaces
      .trim()
  }

  // Levenshtein Distance algorithm for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Calculate similarity percentage
  const calculateSimilarity = (str1: string, str2: string): number => {
    const normalized1 = normalizeName(str1)
    const normalized2 = normalizeName(str2)
    
    const distance = levenshteinDistance(normalized1, normalized2)
    const maxLength = Math.max(normalized1.length, normalized2.length)
    
    if (maxLength === 0) return 100
    
    const similarity = ((maxLength - distance) / maxLength) * 100
    return similarity
  }

  // Find matching guest with fuzzy matching (90% threshold)
  const findMatchingGuest = (inputName: string): Guest | null => {
    const normalizedInput = normalizeName(inputName)
    
    // First, try exact match
    const exactMatch = guests.find(guest => 
      normalizeName(guest.name) === normalizedInput
    )
    if (exactMatch) return exactMatch

    // Then try fuzzy matching with 90% threshold
    let bestMatch: Guest | null = null
    let bestSimilarity = 0

    for (const guest of guests) {
      const similarity = calculateSimilarity(inputName, guest.name)
      
      if (similarity >= 90 && similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestMatch = guest
      }
    }

    return bestMatch
  }

  const fetchGuests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/guests")
      if (!response.ok) {
        throw new Error("Failed to fetch guests")
      }
      const data = await response.json()
      setGuests(data)
    } catch (error) {
      console.error("Error fetching guests:", error)
      setError("Failed to load guest list")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmRSVP = async () => {
    // Clear previous errors
    setError(null)
    
    // Validate input
    if (!searchQuery.trim()) {
      setError("Please enter your name")
      setTimeout(() => setError(null), 5000)
      return
    }

    if (searchQuery.trim().length < 3) {
      setError("Please enter your full name")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsValidating(true)

    // Simulate a brief delay for better UX (prevents instant feedback that might look glitchy)
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Find matching guest using fuzzy matching
      const matchedGuest = findMatchingGuest(searchQuery)

      if (!matchedGuest) {
        setError("We couldn't find your name. Please check the spelling or contact us.")
        setTimeout(() => setError(null), 5000)
        setIsValidating(false)
        return
      }

      // Guest found - set data and proceed to form
      setSelectedGuest(matchedGuest)
      setFormData({
        name: matchedGuest.name,
        role: matchedGuest.role || "",
        email: matchedGuest.email || "",
        contact: matchedGuest.contact || "",
        message: matchedGuest.message || "",
        allowedGuests: matchedGuest.allowedGuests || 1,
        companions: matchedGuest.companions || [],
        tableNumber: matchedGuest.tableNumber || "",
        isVip: matchedGuest.isVip || false,
        status: matchedGuest.status || "pending",
        addedBy: matchedGuest.addedBy || "",
      })

      // Check if guest has already responded
      setHasResponded(!!(matchedGuest.status && (matchedGuest.status === 'confirmed' || matchedGuest.status === 'declined')))
    } catch (error) {
      console.error("Error validating guest:", error)
      setError("An error occurred. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsValidating(false)
    }
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleCompanionChange = (index: number, field: 'name' | 'relationship', value: string) => {
    const updated = [...(formData.companions || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData(prev => ({ ...prev, companions: updated }))
  }

  const handleSubmitRSVP = async () => {
    if (!selectedGuest) return

    if (!formData.status) {
      setError("Please select if you can attend")
      setTimeout(() => setError(null), 5000)
      return
    }

    // Validate companion names if allowedGuests > 1
    if (formData.status === "confirmed" && selectedGuest && selectedGuest.allowedGuests > 1) {
      const companions = formData.companions || []
      const emptyCompanions = companions.filter(c => !c.name.trim())
      if (emptyCompanions.length > 0) {
        setError(`Please fill in all companion names (${companions.length} required)`)
        setTimeout(() => setError(null), 5000)
        return
      }
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedGuest.id,
          name: formData.name,
          role: formData.role || "Guest",
          email: formData.email || "",
          contact: formData.contact || "",
          message: formData.message || "",
          allowedGuests: selectedGuest.allowedGuests, // Keep original allowedGuests from dashboard
          companions: formData.status === "confirmed" ? formData.companions : [],
          status: formData.status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit RSVP")
      }

      // Show success and close modal after delay
      setSuccess("Thank you for your response!")
      setHasResponded(true)
      
      // Trigger event to refresh Book of Guests
      window.dispatchEvent(new Event("rsvpUpdated"))
      
      // Close modal and reset after showing success
      setTimeout(() => {
        setShowModal(false)
        setSearchQuery("")
        setSelectedGuest(null)
        setSuccess(null)
        fetchGuests()
      }, 3000)
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      setError("Failed to submit RSVP. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedGuest(null)
    setSearchQuery("")
    setFormData({
      name: "",
      role: "",
      email: "",
      contact: "",
      message: "",
      allowedGuests: 1,
      companions: [],
      tableNumber: "",
      isVip: false,
      status: "pending",
      addedBy: "",
    })
    setHasResponded(false)
    setError(null)
  }

  const handleOpenModal = () => {
    setShowModal(true)
  }

  return (
    <Section id="guest-list" className="relative z-30 py-6 sm:py-10 md:py-12 lg:py-16">
      {/* Glass Effect Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Header */}
          <div className="relative z-10 text-center">
            <h2
              className="style-script-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black mb-3 sm:mb-4 md:mb-5"
            >
              We Reserved Seats for You!
            </h2>
            
            <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-black/90 font-light max-w-2xl mx-auto leading-relaxed px-2 mb-3 sm:mb-4`}>
              We have chosen to have a small and intimate wedding ceremony.<br />
              Only those closest to us will be in attendance.
            </p>
            
            <p className={`${cormorant.className} text-xs sm:text-sm md:text-base text-black/85 font-medium max-w-xl mx-auto px-2 mb-4 sm:mb-5`}>
              Kindly confirm your presence on or before:<br />
              <span className="text-[#8B4513] font-bold text-base sm:text-lg md:text-xl">December 31, 2025</span>
            </p>
            
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6">
              <div className="w-6 sm:w-8 md:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent via-[#E9D5C3] to-transparent" />
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#F7E6CA]/90 rounded-full" />
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/85 rounded-full" />
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#F7E6CA]/90 rounded-full" />
              <div className="w-6 sm:w-8 md:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent via-[#E9D5C3] to-transparent" />
            </div>
            
            {/* RSVP Button */}
            <button
              onClick={handleOpenModal}
              className="!bg-[#D2A4A4] hover:!bg-[#E0B4B1] text-white px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              RSVP
            </button>
          </div>
        </div>
      </div>


      {/* RSVP Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-[#F7E6CA]/80 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
            
            {/* Search Step */}
            {!selectedGuest && (
              <>
                {/* Modal Header */}
                <div className="relative bg-[#D2A4A4] p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0">
                  <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Search className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                        </div>
                        <h3 className="style-script-regular text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
                          Find Your Name
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1 md:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content - Search */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto flex-1 min-h-0">
                  <p className="text-xs sm:text-sm md:text-base text-[#243127] mb-3 sm:mb-4 md:mb-5 leading-relaxed">
                    Please enter your full name to confirm your RSVP.<br />
                    <span className="text-[#E0B4B1] text-[10px] sm:text-xs md:text-sm">
                      If you cannot find your name, please contact us.
                    </span>
                  </p>

                  <div className="relative mb-4 sm:mb-5 md:mb-6">
                    <label className="block text-xs sm:text-sm font-semibold text-[#243127] mb-1.5 sm:mb-2 font-sans">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D2A4A4]/70 pointer-events-none transition-colors duration-200" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !isValidating) {
                            handleConfirmRSVP()
                          }
                        }}
                        placeholder="Enter your full name..."
                        disabled={isValidating}
                        className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 md:py-3 border-2 border-[#F7E6CA]/60 focus:border-[#D2A4A4] rounded-lg text-xs sm:text-sm font-sans text-[#243127] placeholder:text-[#E0B4B1]/70 transition-all duration-300 hover:border-[#D2A4A4]/70 focus:ring-2 focus:ring-[#D2A4A4]/20 bg-white shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-2.5 sm:p-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                        <span className="text-red-600 font-semibold text-[10px] sm:text-xs md:text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={handleCloseModal}
                      disabled={isValidating}
                      className="flex-1 bg-white border-2 border-[#F7E6CA] text-[#243127] py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-[#F0F0EE] hover:border-[#D2A4A4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmRSVP}
                      disabled={isValidating || !searchQuery.trim()}
                      className="flex-1 !bg-[#D2A4A4] hover:!bg-[#E0B4B1] text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      {isValidating ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          <span>Validating...</span>
                        </>
                      ) : (
                        "Confirm RSVP"
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* RSVP Form Step */}
            {selectedGuest && (
              <>
                {/* Modal Header */}
                <div className="relative bg-[#D2A4A4] p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0">
                  <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <h3 className="style-script-regular text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
                          You're Invited!
                        </h3>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-white/95 text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-sans leading-tight sm:leading-normal">
                          Hello <span className="font-extrabold text-[#FFFFFF] drop-shadow-[0_1px_6px_rgba(102,105,86,0.55)]">{selectedGuest?.name}</span>, you are invited to our wedding!
                        </p>
                        <p className="text-white/90 text-[10px] sm:text-xs md:text-sm font-sans">
                          We've reserved <span className="font-bold text-white">{selectedGuest?.allowedGuests || 1}</span> {selectedGuest?.allowedGuests === 1 ? 'seat' : 'seats'} for you.
                        </p>
                      </div>
                    </div>
                    {!hasResponded && (
                      <button
                        onClick={handleCloseModal}
                        className="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1 md:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0">
                  {hasResponded ? (
                    // Thank you message for guests who already responded
                    <div className="text-center py-3 sm:py-4 md:py-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#F7E6CA] rounded-full mb-2 sm:mb-3 md:mb-4">
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#D2A4A4]" />
                      </div>
                      <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-[#243127] mb-1.5 sm:mb-2 md:mb-3">
                        Thank You for Responding!
                      </h4>
                      <p className="text-[#E0B4B1] text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4 px-2">
                        We've received your RSVP and look forward to celebrating with you!
                      </p>
                      <div className="bg-[#F0F0EE]/40 rounded-lg p-2.5 sm:p-3 md:p-4 border border-[#F7E6CA]/70 space-y-2 sm:space-y-2.5 md:space-y-3">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                          {selectedGuest?.status === "confirmed" && (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
                              <span className="text-xs sm:text-sm md:text-base font-semibold text-green-600">
                                You're Attending!
                              </span>
                            </>
                          )}
                          {selectedGuest?.status === "declined" && (
                            <>
                              <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600" />
                              <span className="text-xs sm:text-sm md:text-base font-semibold text-red-600">
                                Unable to Attend
                              </span>
                            </>
                          )}
                        </div>
                        {selectedGuest?.status === "confirmed" && (
                          <>
                            <div className="bg-[#F0F0EE]/60 rounded-lg p-2 sm:p-2.5 md:p-3 border border-[#F7E6CA]/80">
                              <div className="text-center">
                                <p className="text-[10px] sm:text-xs text-[#E0B4B1] mb-1 font-medium">Total Guests</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#243127]">
                                  {selectedGuest.allowedGuests || 1}
                                </p>
                              </div>
                            </div>
                            {selectedGuest.companions && selectedGuest.companions.length > 0 && (
                              <div className="bg-[#FDFBF7] rounded-lg p-2 sm:p-2.5 md:p-3 border border-[#F7E6CA]/80 mt-2">
                                <p className="text-[10px] sm:text-xs text-[#E0B4B1] mb-1.5 font-medium flex items-center gap-1">
                                  <UsersIcon className="w-3 h-3" />
                                  Companions:
                                </p>
                                <div className="space-y-1">
                                  {selectedGuest.companions.map((companion, idx) => (
                                    <div key={idx} className="text-[10px] sm:text-xs text-[#243127] flex items-center gap-1.5">
                                      <div className="w-1 h-1 bg-[#D2A4A4] rounded-full" />
                                      <span className="font-medium">{companion.name}</span>
                                      <span className="text-[#E0B4B1]">({companion.relationship})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {selectedGuest && selectedGuest.message && selectedGuest.message.trim() !== "" && (
                          <div className="pt-1.5 sm:pt-2 border-t border-[#F7E6CA]/70">
                            <p className="text-[10px] sm:text-xs text-[#E0B4B1] italic px-1">
                              "{selectedGuest.message}"
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="mt-3 sm:mt-4 md:mt-6 !bg-[#D2A4A4] hover:!bg-[#E0B4B1] text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    // RSVP Form for guests who haven't responded
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmitRSVP()
                      }}
                      className="space-y-2.5 sm:space-y-3 md:space-y-4"
                    >
                      {/* Can you attend? */}
                      <div>
                        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#243127] mb-1.5 sm:mb-2 font-sans">
                          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E0B4B1] flex-shrink-0" />
                          <span>Can you attend? *</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, status: "confirmed" }))
                            }
                            className={`relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${
                              formData.status === "confirmed"
                                ? "border-green-600 bg-green-50 shadow-md scale-105"
                                : "border-[#F7E6CA]/60 bg-white hover:border-[#E0B4B1]/70 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                              <CheckCircle
                                className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                  formData.status === "confirmed" ? "text-green-700" : "text-[#E0B4B1]/60"
                                }`}
                              />
                              <span
                                className={`text-xs sm:text-sm font-bold ${
                                  formData.status === "confirmed" ? "text-green-700" : "text-[#243127]"
                                }`}
                              >
                                Yes!
                              </span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, status: "declined" }))}
                            className={`relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${
                              formData.status === "declined"
                                ? "border-red-500 bg-red-50 shadow-md scale-105"
                                : "border-[#F7E6CA]/60 bg-white hover:border-[#E0B4B1]/70 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                              <XCircle
                                className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                  formData.status === "declined" ? "text-red-600" : "text-[#E0B4B1]/60"
                                }`}
                              />
                              <span
                                className={`text-xs sm:text-sm font-bold ${
                                  formData.status === "declined" ? "text-red-600" : "text-[#243127]"
                                }`}
                              >
                                Sorry, No
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Companion Information - Dynamic slots (only if allowedGuests > 1) */}
                      {formData.status === "confirmed" && selectedGuest && selectedGuest.allowedGuests > 1 && (
                        <div className="bg-[#FDFBF7] rounded-lg p-2.5 sm:p-3 md:p-4 border border-[#F7E6CA]/80 space-y-2.5 sm:space-y-3">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E0B4B1]" />
                            <h4 className="text-xs sm:text-sm font-bold text-[#243127]">
                              Who's Coming With You?
                            </h4>
                          </div>
                          <p className="text-[10px] sm:text-xs text-[#E0B4B1]">
                            Please provide names for your <span className="font-bold text-[#D2A4A4]">{selectedGuest.allowedGuests - 1}</span> additional {selectedGuest.allowedGuests === 2 ? 'guest' : 'guests'}
                          </p>
                          <div className="space-y-2 sm:space-y-2.5">
                            {(formData.companions || []).map((companion, idx) => (
                              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 p-2 bg-white/50 rounded-lg border border-[#F7E6CA]/50">
                                <div>
                                  <label className="text-[10px] sm:text-xs text-[#E0B4B1] font-medium mb-0.5 block">
                                    Guest {idx + 2} Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={companion.name}
                                    onChange={(e) => handleCompanionChange(idx, 'name', e.target.value)}
                                    placeholder={`Name of guest ${idx + 2}`}
                                    required
                                    className="w-full px-2 py-1.5 border border-[#F7E6CA]/60 focus:border-[#D2A4A4] rounded text-xs text-[#243127] placeholder:text-[#E0B4B1]/50 transition-all focus:ring-1 focus:ring-[#D2A4A4]/20 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] sm:text-xs text-[#E0B4B1] font-medium mb-0.5 block">
                                    Relationship *
                                  </label>
                                  <input
                                    type="text"
                                    value={companion.relationship}
                                    onChange={(e) => handleCompanionChange(idx, 'relationship', e.target.value)}
                                    placeholder="e.g., Spouse, Child"
                                    required
                                    className="w-full px-2 py-1.5 border border-[#F7E6CA]/60 focus:border-[#D2A4A4] rounded text-xs text-[#243127] placeholder:text-[#E0B4B1]/50 transition-all focus:ring-1 focus:ring-[#D2A4A4]/20 bg-white"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message to the couple */}
                      <div>
                        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#243127] mb-1.5 sm:mb-2 font-sans flex-wrap">
                          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E0B4B1] flex-shrink-0" />
                          <span>Your Message to the Couple</span>
                          <span className="text-[10px] sm:text-xs font-normal text-[#E0B4B1]">(Optional)</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleFormChange}
                          placeholder="Share your excitement..."
                          rows={3}
                          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#F7E6CA]/60 focus:border-[#D2A4A4] rounded-lg text-xs sm:text-sm font-sans text-[#243127] placeholder:text-[#E0B4B1]/70 transition-all duration-300 focus:ring-2 focus:ring-[#D2A4A4]/20 resize-none bg-white"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#243127] mb-1.5 sm:mb-2 font-sans flex-wrap">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E0B4B1] flex-shrink-0" />
                          <span>Your Email Address</span>
                          <span className="text-[10px] sm:text-xs font-normal text-[#E0B4B1]">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="your.email@example.com"
                          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#F7E6CA]/60 focus:border-[#D2A4A4] rounded-lg text-xs sm:text-sm font-sans text-[#243127] placeholder:text-[#E0B4B1]/70 transition-all duration-300 focus:ring-2 focus:ring-[#D2A4A4]/20 bg-white"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2 sm:pt-3">
                        <button
                          type="submit"
                          disabled={isLoading || !formData.status}
                          className="w-full !bg-[#D2A4A4] hover:!bg-[#E0B4B1] text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                              <span className="text-xs sm:text-sm">Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm">Submit RSVP</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Enhanced Success Overlay */}
                {success && (
                  <div className="absolute inset-0 bg-[#D2A4A4]/98 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4">
                    <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                      {/* Enhanced Icon Circle */}
                      <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                        {/* Animated rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                        <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                        {/* Icon container */}
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                          <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-[#D2A4A4]" strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-white mb-2 sm:mb-3">
                        RSVP Confirmed!
                      </h4>
                      
                      {/* Message based on RSVP response */}
                      {formData.status === "confirmed" && (
                        <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                          <p className="text-white/95 text-xs sm:text-sm font-medium">
                            We're thrilled you'll be joining us!
                          </p>
                          {selectedGuest && selectedGuest.allowedGuests > 1 && (
                            <p className="text-white/80 text-[10px] sm:text-xs">
                              Party of {selectedGuest.allowedGuests} confirmed
                            </p>
                          )}
                        </div>
                      )}
                      {formData.status === "declined" && (
                        <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3">
                          We'll miss you, but thank you for letting us know.
                        </p>
                      )}
                      {!formData.status && (
                        <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3">
                          Thank you for your response!
                        </p>
                      )}
                      
                      {/* Subtle closing indicator */}
                      <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse" />
                        <p className="text-white/70 text-[10px] sm:text-xs">
                          This will close automatically
                        </p>
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && !success && (
                  <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                        <span className="text-red-600 font-semibold text-[10px] sm:text-xs md:text-sm">{error}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Status Messages (outside modals) */}
      {success && !showModal && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2 sm:mx-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-2 sm:p-3 md:p-4 shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">{success}</span>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
