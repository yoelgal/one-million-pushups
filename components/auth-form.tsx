'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const supabase = createClient()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const { email, password, username } = Object.fromEntries(formData.entries())

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.toString(),
          password: password.toString(),
          options: {
            data: { username },
          },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.toString(),
          password: password.toString(),
        })
        if (error) throw error
      }
      router.refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="mb-1 block">Username</label>
            <input
              name="username"
              type="text"
              required
              className="w-full rounded border p-2"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded border p-2"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === 'login' ? (
          <button
            onClick={() => setMode('signup')}
            className="text-blue-500 hover:underline"
          >
            Create new account
          </button>
        ) : (
          <button
            onClick={() => setMode('login')}
            className="text-blue-500 hover:underline"
          >
            Already have an account?
          </button>
        )}
      </p>
    </div>
  )
}
