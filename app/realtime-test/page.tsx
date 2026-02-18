// app/realtime-test/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RealtimeTestPage() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    console.log('Starting realtime test...')
    
    const channel = supabase
      .channel('test-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks' 
        },
        (payload) => {
          console.log('✅ Realtime event received:', payload)
          setMessages(prev => [
            `[${new Date().toLocaleTimeString()}] ${payload.eventType}: ${
              payload.eventType === 'DELETE' 
                ? JSON.stringify(payload.old) 
                : JSON.stringify(payload.new)
            }`,
            ...prev
          ])
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        setMessages(prev => [`[${new Date().toLocaleTimeString()}] Status: ${status}`, ...prev])
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addTestBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please login first')
      return
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert({
        title: `Test ${new Date().toLocaleTimeString()}`,
        url: 'https://example.com',
        user_id: user.id
      })

    if (error) {
      console.error('Error adding bookmark:', error)
      alert('Error adding bookmark: ' + error.message)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Realtime Test Page</h1>
      
      <button
        onClick={addTestBookmark}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Test Bookmark
      </button>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Realtime Events:</h2>
        <div className="space-y-1">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm border-b border-gray-200 py-1">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}