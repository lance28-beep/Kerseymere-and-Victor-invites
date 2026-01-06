import { type NextRequest, NextResponse } from "next/server"

// Update this with your deployed Google Apps Script URL for Wedding Details
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5-6dkZH4vPnoLrXtfTmjmuKj6YfIWYS4epAlWmMD2_YZsCACbrZLC8y9-Y9euJh1I/exec'

// Wedding Details interface matching the Google Sheets structure
export interface WeddingDetails {
  couple: {
    bride: string
    brideNickname: string
    groom: string
    groomNickname: string
  }
  wedding: {
    date: string
    venue: string
    tagline: string
  }
  theme: string
  hashtag: string
  ceremony: {
    venue: string
    address: string
    time: string
    googleMapsUrl: string
  }
  reception: {
    venue: string
    address: string
    time: string
    googleMapsUrl: string
  }
  narratives: {
    bride: string
    groom: string
    shared: string
  }
  dressCode: {
    theme: string
    note: string
  }
  details: {
    rsvp: {
      deadline: string
    }
  }
  contact: {
    bridePhone: string
    groomPhone: string
    email: string
  }
}

// Empty wedding details structure
const emptyWeddingDetails: WeddingDetails = {
  couple: {
    bride: "",
    brideNickname: "",
    groom: "",
    groomNickname: "",
  },
  wedding: {
    date: "",
    venue: "",
    tagline: "",
  },
  theme: "",
  hashtag: "",
  ceremony: {
    venue: "",
    address: "",
    time: "",
    googleMapsUrl: "",
  },
  reception: {
    venue: "",
    address: "",
    time: "",
    googleMapsUrl: "",
  },
  narratives: {
    bride: "",
    groom: "",
    shared: "",
  },
  dressCode: {
    theme: "",
    note: "",
  },
  details: {
    rsvp: {
      deadline: "",
    },
  },
  contact: {
    bridePhone: "",
    groomPhone: "",
    email: "",
  },
}

// GET: Fetch wedding details from Google Sheets
export async function GET() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache wedding details
    })

    if (!response.ok) {
      console.error('Google Apps Script returned error status:', response.status)
      // Return empty values instead of error
      return NextResponse.json(emptyWeddingDetails, { status: 200 })
    }

    const data = await response.json()
    
    // Check if the response contains an error
    if (data.error) {
      console.error('Google Apps Script returned error:', data.error)
      // Return empty values instead of error
      return NextResponse.json(emptyWeddingDetails, { status: 200 })
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching wedding details:', error)
    // Return empty values instead of error
    return NextResponse.json(emptyWeddingDetails, { status: 200 })
  }
}

// PUT: Update wedding details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const updateData = {
      action: 'update',
      ...body, // Spread all the wedding details
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', // Google Apps Script uses POST for all operations
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    const responseText = await response.text()

    // Parse the response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError)
      console.error('Response text:', responseText.substring(0, 500))
      
      if (!response.ok) {
        return NextResponse.json(
          { 
            error: `Google Apps Script returned an error. Status: ${response.status}. The script may need to be updated or redeployed.`,
            details: responseText.substring(0, 200)
          },
          { status: response.status || 500 }
        )
      }
      
      // If status is ok but not JSON, assume success
      data = { status: 'ok', message: 'Wedding details updated successfully' }
    }

    // Check if the response indicates an error
    if (data.error) {
      console.error('Error in response data:', data.error)
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      )
    }

    // Check response status
    if (!response.ok) {
      const errorMessage = data.error || `Failed to update wedding details. Google Apps Script returned status ${response.status}`
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Error updating wedding details:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update wedding details' },
      { status: 500 }
    )
  }
}

// DELETE: Clear all wedding details
export async function DELETE() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'delete' }),
    })

    if (!response.ok) {
      throw new Error('Failed to clear wedding details')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Error clearing wedding details:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to clear wedding details' },
      { status: 500 }
    )
  }
}

// POST: Initialize wedding details with defaults (legacy support)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.action === 'initialize') {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'initialize' }),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize wedding details')
      }

      const data = await response.json()
      return NextResponse.json(data, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error initializing wedding details:', error)
    return NextResponse.json(
      { error: 'Failed to initialize wedding details' },
      { status: 500 }
    )
  }
}

