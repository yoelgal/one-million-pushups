import { createClient } from "@supabase/supabase-js";

export type Post = {
  id: string;
  created_at: Date;
  user_id: string;
  caption: string;
  pushup_count: number;
};

export type User = {
  id: string;
  name: string;
  username: string;
  password: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
