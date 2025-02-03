import { kv } from "@vercel/kv";

export const TOTAL_PUSHUPS_KEY = "total_pushups";

export async function incrementTotalPushups(count: number): Promise<number> {
  const newTotal = await kv.incrby(TOTAL_PUSHUPS_KEY, count);
  return newTotal;
}

export async function getTotalPushups(): Promise<number> {
  const total = await kv.get<number>(TOTAL_PUSHUPS_KEY);
  return total || 0;
}
