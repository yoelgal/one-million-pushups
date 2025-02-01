import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  const total = await kv.get('total_pushups')
  return NextResponse.json({ total: total || 0 })
}
