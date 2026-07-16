import { supabase } from "./supabaseClient";

export type Caregiver = {
  id: number;
  name: string;
  /** 요양보호사 자격 유무 */
  isCertified: boolean;
  /** 경력 (년) */
  careerYears: number;
  /** 주소지 */
  address: string;
  /** 연령대 (예: "50대") */
  ageGroup: string;
  /** 추가 자격증 사항 */
  additionalCertifications: string[];
};

/** 등록 시 입력값 (id는 DB가 자동 생성) */
export type NewCaregiver = Omit<Caregiver, "id">;

/** DB row(snake_case) 모양 */
type CaregiverRow = {
  id: number;
  name: string;
  is_certified: boolean;
  career_years: number;
  address: string;
  age_group: string;
  additional_certifications: string[] | null;
};

/** DB row -> 앱 타입 변환 (계약 문서 기준) */
function toCaregiver(row: CaregiverRow): Caregiver {
  return {
    id: row.id,
    name: row.name,
    isCertified: row.is_certified,
    careerYears: row.career_years,
    address: row.address,
    ageGroup: row.age_group,
    additionalCertifications: row.additional_certifications ?? [],
  };
}

/** 요양보호사 목록 조회 (경력 많은 순) */
export async function fetchCaregivers(): Promise<Caregiver[]> {
  const { data, error } = await supabase
    .from("caregivers")
    .select("*")
    .order("career_years", { ascending: false });
  if (error) throw error;
  return (data as CaregiverRow[]).map(toCaregiver);
}

/** 요양보호사 1명 조회 */
export async function fetchCaregiverById(
  id: number
): Promise<Caregiver | null> {
  const { data, error } = await supabase
    .from("caregivers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toCaregiver(data as CaregiverRow) : null;
}

/** 요양보호사 등록 (저장) */
export async function insertCaregiver(c: NewCaregiver): Promise<void> {
  const { error } = await supabase.from("caregivers").insert({
    name: c.name,
    is_certified: c.isCertified,
    career_years: c.careerYears,
    address: c.address,
    age_group: c.ageGroup,
    additional_certifications: c.additionalCertifications,
  });
  if (error) throw error;
}

/** 주소지에서 시/도 단위 지역만 추출 (예: "서울 강북구 수유동" -> "서울") */
export function getRegion(address: string): string {
  return address.split(" ")[0] ?? "";
}
