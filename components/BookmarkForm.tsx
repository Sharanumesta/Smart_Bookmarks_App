'use client'

import { useState } from 'react'

export default function BookmarkForm({ onAdd }: any) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')

    function isValidUrl(value: string) {
        try {
            new URL(value)
            return true
        } catch {
            return false
        }
    }

    const handleSubmit = () => {
        if (!title || !url) {
            setError('Title and URL are required')
            return
        }

        if (!isValidUrl(url)) {
            setError('Please enter a valid URL (include https://)')
            return
        }

        setError('')
        onAdd(title, url)

        setTitle('')
        setUrl('')
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    placeholder="Title"
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    placeholder="https://example.com"
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                    Add
                </button>
            </div>
            <p className="text-red-600 text-sm mt-2 min-h-5">{error}</p>
        </div>
    )
}
