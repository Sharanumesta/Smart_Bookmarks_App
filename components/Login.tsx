'use client'

import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-6">
          Smart Bookmarks
        </h1>

        <button
          onClick={login}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Sign in with Google
          </span>
        </button>
      </div>
    </div>
  )
}
