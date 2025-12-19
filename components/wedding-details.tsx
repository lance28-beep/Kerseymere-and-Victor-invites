"use client"

import { siteConfig } from "@/content/site"
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Church,
  Utensils,
  Phone,
  Mail,
  Users,
  Image as ImageIcon,
} from "lucide-react"

export function WeddingDetails() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111827]">Wedding Details</h2>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#8B6F47] to-[#6B5335] rounded-2xl p-8 shadow-lg text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold">
              {siteConfig.couple.groomNickname} & {siteConfig.couple.brideNickname}
            </h1>
            <p className="text-white/90 text-lg mt-1">are getting married!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/90">
          <Calendar className="h-5 w-5" />
          <span className="text-lg">{siteConfig.weddingDate}</span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Couple Information */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFF8F0] rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-[#8B6F47]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">The Couple</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#6B7280] block mb-1">Groom</label>
              <p className="text-lg font-semibold text-[#111827]">
                {siteConfig.couple.groomName}
              </p>
              <p className="text-sm text-[#6B7280]">"{siteConfig.couple.groomNickname}"</p>
            </div>
            <div className="border-t border-[#E5E7EB] pt-4">
              <label className="text-sm font-medium text-[#6B7280] block mb-1">Bride</label>
              <p className="text-lg font-semibold text-[#111827]">
                {siteConfig.couple.brideName}
              </p>
              <p className="text-sm text-[#6B7280]">"{siteConfig.couple.brideNickname}"</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFF8F0] rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#8B6F47]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Event Details</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-sm font-medium text-[#6B7280] block">Date</label>
                <p className="text-[#111827] font-medium">{siteConfig.weddingDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-sm font-medium text-[#6B7280] block">Time</label>
                <p className="text-[#111827] font-medium">{siteConfig.time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ceremony & Reception */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ceremony */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Church className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Ceremony</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#111827] font-medium">{siteConfig.ceremony.venueName}</p>
                <p className="text-sm text-[#6B7280] mt-1">{siteConfig.ceremony.address}</p>
              </div>
            </div>
            {siteConfig.ceremony.googleMapsUrl && (
              <a
                href={siteConfig.ceremony.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8B6F47] hover:text-[#6B5335] font-medium transition-colors"
              >
                <MapPin className="h-4 w-4" />
                View on Google Maps
              </a>
            )}
          </div>
        </div>

        {/* Reception */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Utensils className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Reception</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#111827] font-medium">{siteConfig.reception.venueName}</p>
                <p className="text-sm text-[#6B7280] mt-1">{siteConfig.reception.address}</p>
              </div>
            </div>
            {siteConfig.reception.googleMapsUrl && (
              <a
                href={siteConfig.reception.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8B6F47] hover:text-[#6B5335] font-medium transition-colors"
              >
                <MapPin className="h-4 w-4" />
                View on Google Maps
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-[#111827]">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {siteConfig.contact.groomPhone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-sm font-medium text-[#6B7280] block">
                  {siteConfig.couple.groomNickname}'s Phone
                </label>
                <a
                  href={`tel:${siteConfig.contact.groomPhone}`}
                  className="text-[#8B6F47] hover:text-[#6B5335] font-medium transition-colors"
                >
                  {siteConfig.contact.groomPhone}
                </a>
              </div>
            </div>
          )}
          {siteConfig.contact.bridePhone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-sm font-medium text-[#6B7280] block">
                  {siteConfig.couple.brideNickname}'s Phone
                </label>
                <a
                  href={`tel:${siteConfig.contact.bridePhone}`}
                  className="text-[#8B6F47] hover:text-[#6B5335] font-medium transition-colors"
                >
                  {siteConfig.contact.bridePhone}
                </a>
              </div>
            </div>
          )}
          {siteConfig.contact.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-sm font-medium text-[#6B7280] block">Email</label>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-[#8B6F47] hover:text-[#6B5335] font-medium transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F5F5F0] rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5335] rounded-lg flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#6B4423]">Quick Info</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
            <label className="text-sm font-medium text-[#6B7280] block mb-1">Theme</label>
            <p className="text-[#6B4423] font-semibold">{siteConfig.theme || "Classic Elegance"}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
            <label className="text-sm font-medium text-[#6B7280] block mb-1">Dress Code</label>
            <p className="text-[#6B4423] font-semibold">{siteConfig.dressCode || "Formal Attire"}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
            <label className="text-sm font-medium text-[#6B7280] block mb-1">Hashtag</label>
            <p className="text-[#8B6F47] font-semibold">{siteConfig.hashtag || "#ForeverTogether"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

