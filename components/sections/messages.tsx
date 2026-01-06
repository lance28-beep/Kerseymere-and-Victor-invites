"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { Cormorant_Garamond } from "next/font/google"
import { siteConfig } from "@/content/site"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${brideNickname} & ${groomNickname}`

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSfKUddDE8bmD7xkP9OAbPuOsyQ-ZIScNkv6_4NzMPGuNfr_3g/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      )

      toast({
        title: "Message Sent! 💌",
        description: "Your heartfelt wishes have been delivered",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()
      
      // Reset submitted state after animation
      setTimeout(() => setIsSubmitted(false), 1000)
      
      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto px-3 sm:px-0">
      {/* Style to override placeholder color */}
      <style>{`
        .message-form-input::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
        .message-form-textarea::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
      `}</style>
      
      {/* Decorative background elements (purple & lavender) */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#B9AACB]/25 rounded-full blur-sm animate-pulse-slow" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#6A4F82]/30 rounded-full blur-md animate-pulse-slow" />
      
      <Card className={`relative w-full border-2 border-[#B9AACB]/70 shadow-[0_12px_30px_rgba(106,79,130,0.35)] bg-white/60 backdrop-blur-md transition-all duration-500 group overflow-hidden rounded-2xl ${
        isFocused ? 'scale-[1.01] border-[#6A4F82] bg-white/75' : 'hover:bg-white/70'
      } ${isSubmitted ? 'animate-bounce' : ''}`}>
        {/* Glass effect gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B9AACB]/22 via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
        
        {/* Frosted glass effect */}
        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/18 to-white/6" />
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B9AACB]/28 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Success animation overlay */}
        {isSubmitted && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 flex items-center justify-center z-20 pointer-events-none">
            <div className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-semibold text-lg">Sent!</p>
            </div>
          </div>
        )}
        
        <CardContent className="relative p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10">
          {/* Header with icon */}
          <div className="text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            <div className="relative inline-block mb-2 sm:mb-3 md:mb-4">
              <div className="absolute inset-0 bg-black/30 rounded-full blur-lg scale-150" />
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white/20">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-playfair font-bold text-foreground mb-1.5 sm:mb-2">
              Share Your Love
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-foreground/70 font-lora">
              Your words will be part of {coupleDisplayName}&apos;s keepsake for years to come.
            </p>
          </div>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Name Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground font-lora flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-black/30 to-black/20 rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 ${
                  focusedField === 'name' ? 'scale-110 bg-black/50' : ''
                }`}>
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                </div>
                Your Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full Name"
                  className={`message-form-input w-full border-2 rounded-xl py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base font-lora placeholder:italic transition-all duration-300 bg-white/85 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg ${
                    focusedField === 'name' 
                      ? 'border-[#187153] focus:border-[#187153] focus:ring-4 focus:ring-[#327B72]/25 shadow-lg' 
                      : 'border-[#327B72]/40 hover:border-[#327B72]/40'
                  }`}
                />
                {nameValue && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground font-lora flex items-center gap-1.5 sm:gap-2">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-black/30 to-black/20 rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 ${
                    focusedField === 'message' ? 'scale-110 bg-black/50' : ''
                  }`}>
                    <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  Your Message
                </label>
                {messageValue && (
                  <span className={`text-[10px] sm:text-xs font-lora transition-colors ${
                    messageValue.length > 500 ? 'text-red-500' : 'text-foreground/50'
                  }`}>
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  name="message"
                  required
                  value={messageValue}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setMessageValue(e.target.value)
                    }
                  }}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={`Write a heartfelt message for ${coupleDisplayName}... share your wishes, memories, or words of love that will be treasured forever 💕`}
                  className={`message-form-textarea w-full border-2 rounded-xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-xs sm:text-sm md:text-base font-lora placeholder:italic placeholder:leading-relaxed transition-all duration-300 resize-none bg-white/85 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 ${
                    focusedField === 'message' 
                      ? 'border-[#187153] focus:border-[#187153] focus:ring-4 focus:ring-[#327B72]/25 shadow-lg' 
                      : 'border-[#327B72]/40 hover:border-[#327B72]/40'
                  }`}
                />
                {messageValue && (
                  <div className="absolute right-3 top-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button - White Premium */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className="w-full text-black py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-4 sm:px-5 md:px-6 lg:px-7 rounded-xl text-xs sm:text-sm md:text-base font-lora font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group border border-white/30"
              style={{ 
                backgroundColor: "#FFFFFF",
                boxShadow: "0 10px 32px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.35), 0 6px 20px rgba(0,0,0,0.4)";
                }
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
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative z-10 text-black" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10 text-black" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${brideNickname} & ${groomNickname}`

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Unexpected messages response; expected an array", data)
          setMessages([])
          setLoading(false)
          return
        }
        
        const parsed = data
          .filter((m) => m.name || m.message || m.timestamp)
          .reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <Section
      id="messages"
      className="relative overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="space-y-2 sm:space-y-2.5">
            <p
              className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] text-white`}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.75)" }}
            >
              Messages for {coupleDisplayName}
            </p>
            <h2 className="style-script-regular text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-md">
              Love notes &amp; prayers
            </h2>
          </div>
          
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base text-white/95 font-light max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 mt-2`}
          >
            Leave a short note for {coupleDisplayName}. Every wish and prayer becomes part of their forever story.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="relative max-w-xl w-full">
            {/* Card halo */}
            {/* <div className="absolute -inset-3 bg-gradient-to-br from-[#B28383]/25 via-[#EDD6AC]/20 to-transparent rounded-3xl blur-2xl opacity-70" />
            <div className="absolute -inset-1 bg-gradient-to-br from-[#A78256]/15 via-transparent to-transparent rounded-3xl blur-md opacity-80" /> */}
            <MessageForm onMessageSent={fetchMessages} />
            {/* Corner sparkles */}
            {/* <div className="pointer-events-none">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#BB8A3D] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CDAC77] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#CDAC77] rounded-full blur-[2px] opacity-70" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#BB8A3D] rounded-full blur-[2px] opacity-70" />
            </div> */}
          </div>
        </div>

        {/* Messages Display Section */}
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40 rounded-full blur-xl scale-150 animate-pulse-slow" />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-300 border-2 border-white/20">
                <MessageCircle className="h-4 w-4 sm:h-6 sm:h-6 md:h-8 md:w-8 text-white" />
              </div>
              {/* Outer glow ring */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-white/15 via-black/20 to-white/15 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-playfair font-bold text-white mb-1.5 sm:mb-2 md:mb-3">
              Messages from Loved Ones
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-white font-lora max-w-2xl mx-auto px-2 sm:px-4">
              Read the beautiful messages shared by family and friends
            </p>
          </div>
          
          <MessageWallDisplay messages={messages} loading={loading} />
        </div>

      </div>
    </Section>
  )
}
