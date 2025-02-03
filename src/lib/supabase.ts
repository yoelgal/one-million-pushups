import { createClient } from "@supabase/supabase-js";
import { UUID } from "crypto";

export type Post = {
  id: UUID;
  created_at: Date;
  user_id: UUID;
  caption: string;
  pushup_count: number;
};

export type User = {
  id: UUID;
  email: string;
  name: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
