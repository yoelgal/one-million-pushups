import AuthForm from '@/components/auth-form'
import PostForm from '@/components/post-form'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch posts and total
  const { data: posts } = user
    ? await supabase
        .from('posts')
        .select(
          `
      id,
      count,
      comment,
      created_at,
      profiles!inner(username)
    `,
        )
        .order('created_at', { ascending: false })
    : { data: null }

  const totalResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/total`)
  const { total } = await totalResponse.json()

  return (
    <div className="mx-auto max-w-2xl p-4">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Total: {total || 0}</h1>
        {user ? (
          <form action="/auth/logout" method="POST">
            <button className="rounded bg-red-500 px-4 py-2 text-white">
              Logout
            </button>
          </form>
        ) : (
          <AuthForm />
        )}
      </header>

      {user && <PostForm />}

      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="rounded bg-white p-4 shadow">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{post.profiles.username}</h3>
                <time className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
              </div>
              <span className="text-xl font-bold text-blue-600">
                +{post.count}
              </span>
            </div>
            {post.comment && <p className="text-gray-700">{post.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
