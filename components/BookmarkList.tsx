'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BookmarkList({ user }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel('realtime bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        () => fetchBookmarks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      { title, url, user_id: user.id }
    ])

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

return (
  <div className="min-h-screen bg-gray-100">
    <div className="max-w-2xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          My Bookmarks
        </h1>

        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-600 hover:text-black"
        >
          Logout
        </button>
      </div>

      {/* Add Bookmark Form */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Title"
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="URL"
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addBookmark}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Bookmark List */}
      <div className="space-y-3">
        {bookmarks.length === 0 && (
          <p className="text-gray-500 text-sm">
            No bookmarks yet.
          </p>
        )}

        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  </div>
)

}
