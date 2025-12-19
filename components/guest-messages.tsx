"use client"

import { useState } from "react"
import {
  MessageSquare,
  Search,
  Mail,
  User,
  Calendar,
  Heart,
} from "lucide-react"

interface Guest {
  Name: string
  Email: string
  RSVP: string
  Guest: string
  Message: string
}

interface GuestMessagesProps {
  guests: Guest[]
}

export function GuestMessages({ guests }: GuestMessagesProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter guests who have messages
  const guestsWithMessages = guests.filter((guest) => guest.Message && guest.Message.trim())

  const filteredMessages = guestsWithMessages.filter((guest) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      guest.Name.toLowerCase().includes(query) ||
      guest.Message.toLowerCase().includes(query) ||
      (guest.Email && guest.Email.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111827]">Guest Messages</h2>
        <div className="text-sm text-[#6B7280]">
          {filteredMessages.length} of {guestsWithMessages.length} messages
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F5F5F0] border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6B5335] rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#6B4423] text-lg mb-2">Messages from Your Guests</h3>
            <p className="text-sm text-[#6B7280]">
              Read heartfelt messages and well wishes from your guests. These messages were submitted along with their RSVP responses.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by guest name or content..."
            className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Messages */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F9FAFB] rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-[#6B7280]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">No Messages Found</h3>
          <p className="text-[#6B7280]">
            {searchQuery
              ? "No messages match your search query."
              : "No guests have left messages yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((guest, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4B5A0] to-[#8B6F47] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {guest.Name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#111827] mb-1">{guest.Name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
                    {guest.Email && guest.Email !== "Pending" && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{guest.Email}</span>
                      </div>
                    )}
                    {guest.Guest && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span>{parseInt(guest.Guest) || 1} guest(s)</span>
                      </div>
                    )}
                    {guest.RSVP && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="capitalize">{guest.RSVP}</span>
                      </div>
                    )}
                  </div>
                </div>
                {guest.RSVP === "Yes" && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                      Attending
                    </span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F5F5F0] rounded-xl p-4 border border-[#E5E7EB]">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <MessageSquare className="h-5 w-5 text-[#A67C52]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#6B4423] leading-relaxed">{guest.Message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Footer */}
      {guestsWithMessages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[#8B6F47] mb-1">
                {guestsWithMessages.length}
              </div>
              <div className="text-sm text-[#6B7280]">Total Messages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {guestsWithMessages.filter((g) => g.RSVP === "Yes").length}
              </div>
              <div className="text-sm text-[#6B7280]">From Attending Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#6B7280] mb-1">
                {guestsWithMessages.filter((g) => !g.RSVP || g.RSVP.trim() === "").length}
              </div>
              <div className="text-sm text-[#6B7280]">From Pending RSVPs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

