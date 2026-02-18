'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import BookmarkForm from './BookmarkForm'
import BookmarkItem from './BookmarkItem'
import Spinner from './Spinner'

export default function BookmarkList({ user }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<any>(null)

  const fetchBookmarks = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      setError('Failed to load bookmarks')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) {
      return
    }

    let isSubscribed = true

    const setupRealtime = async () => {
      await fetchBookmarks()

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }

      const channelName = `bookmarks-${user.id}-${Date.now()}`
      console.log('Creating channel:', channelName)

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (!isSubscribed) return

            if (payload.eventType === 'INSERT') {
              setBookmarks(prev => {
                if (prev.some(b => b.id === payload.new.id)) {
                  return prev
                }
                return [payload.new as any, ...prev]
              })
            } else if (payload.eventType === 'DELETE') {
              setBookmarks(prev => {
                return prev.filter(b => b.id !== payload.old.id)
              })
            } else if (payload.eventType === 'UPDATE') {
              setBookmarks(prev =>
                prev.map(item =>
                  item.id === payload.new.id ? payload.new as any : item
                )
              )
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status, 'for channel:', channelName)
        })

      channelRef.current = channel
    }

    setupRealtime()

    return () => {
      isSubscribed = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [user?.id, fetchBookmarks])

  const addBookmark = async (title: string, url: string) => {
    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required')
      return
    }

    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setError(null)

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{
          title: title.trim(),
          url: url.trim(),
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      if (data) {
        setBookmarks(prev => [data, ...prev])
      }
    } catch (error) {
      console.error('Error adding bookmark:', error)
      setError('Failed to add bookmark')
    }
  }

  const deleteBookmark = async (id: string) => {
    const bookmarkToDelete = bookmarks.find(b => b.id === id)

    setBookmarks(prev => prev.filter(b => b.id !== id))
    setError(null)

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      setError('Failed to delete bookmark')

      if (bookmarkToDelete) {
        setBookmarks(prev => [bookmarkToDelete, ...prev])
      }
    }
  }

  const handleLogout = async () => {
    const confirm = window.confirm('Are you sure you want to logout?')
    if (!confirm) return

    try {
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error logging out:', error)
      setError('Failed to logout')
    }
  }
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-2xl font-semibold">
              My Bookmarks
            </h1>
            <p className="text-sm text-gray-800 mt-1">
              Welcome back, <span className='font-bold'>{firstName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 
                     bg-red-50 border border-red-200 rounded-lg 
                     hover:bg-red-100 hover:border-red-300 
                     transition duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>

        </div>

        <BookmarkForm onAdd={addBookmark} />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {loading && <Spinner />}

          {!loading && bookmarks.length === 0 && !error && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No bookmarks found.</p>
              <p className="text-gray-400 text-xs mt-1">
                Add your first bookmark above.
              </p>
            </div>
          )}

          {bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={deleteBookmark}
            />
          ))}
        </div>

      </div>
    </div>

  )
}