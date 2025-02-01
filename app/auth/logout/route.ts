import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  await supabase.auth.signOut()
  return NextResponse.redirect('/')
}
