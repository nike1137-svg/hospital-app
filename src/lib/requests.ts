import { supabase } from "./supabaseClient";

/** 동행 요청 입력값 */
export type NewRequest = {
  name: string;
  contact: string;
  region: string;
  /** YYYY-MM-DD */
  date: string;
  purpose: string;
  minCareerYears: number;
  certifiedOnly: boolean;
};

/** 동행 요청 저장 */
export async function insertRequest(r: NewRequest): Promise<void> {
  const { error } = await supabase.from("requests").insert({
    name: r.name,
    contact: r.contact,
    region: r.region,
    date: r.date,
    purpose: r.purpose,
    min_career_years: r.minCareerYears,
    certified_only: r.certifiedOnly,
  });
  if (error) throw error;
}
