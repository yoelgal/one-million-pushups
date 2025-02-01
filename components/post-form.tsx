'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function PostForm() {
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const { count, comment } = Object.fromEntries(formData.entries())

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      await supabase.from('posts').insert({
        user_id: user.id,
        count: Number(count),
        comment: comment?.toString().slice(0, 140),
      })

      router.refresh()
      e.currentTarget.reset()
    } catch (err) {
      console.error('Post failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded bg-white p-4 shadow">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Pushups Count
          </label>
          <input
            name="count"
            type="number"
            className="w-full rounded border p-2"
            min="1"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Comment (optional)
          </label>
          <textarea
            name="comment"
            className="w-full rounded border p-2"
            rows={2}
            maxLength={140}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-green-500 px-4 py-2 text-white"
        >
          Submit Pushups
        </button>
      </div>
    </form>
  )
}
