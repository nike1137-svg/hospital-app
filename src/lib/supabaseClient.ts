import { createClient } from "@supabase/supabase-js";

// 환경변수에서 읽음 (.env.local / GitHub Secrets)
// NEXT_PUBLIC_ 접두사 = 브라우저에 공개되는 값. publishable 키는 공개 안전(RLS로 보호).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase 환경변수가 없습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 설정하세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
