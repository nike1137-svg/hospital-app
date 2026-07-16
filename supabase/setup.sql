-- ============================================================
-- 병원동행 서비스 — Supabase 초기 설정 스크립트
-- Supabase 대시보드 → SQL Editor에 붙여넣고 [Run] 실행
-- (API 명세: 병원동행_API명세.md 기준)
-- ============================================================

-- 1) 요양보호사 테이블 -----------------------------------------
create table if not exists caregivers (
  id bigint generated always as identity primary key,
  name text not null,
  is_certified boolean not null default false,
  career_years int not null default 0 check (career_years >= 0),
  address text not null,
  age_group text not null,
  additional_certifications text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 2) 동행 요청 테이블 ------------------------------------------
create table if not exists requests (
  id bigint generated always as identity primary key,
  name text not null,
  contact text not null,
  region text not null,
  date date not null,
  purpose text not null,
  min_career_years int not null default 0 check (min_career_years >= 0),
  certified_only boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3) RLS(행 수준 보안) 켜기 — 필수! -----------------------------
-- 안 켜면 anon 공개 키로 누구나 데이터를 읽고/고치고/지울 수 있음
alter table caregivers enable row level security;
alter table requests   enable row level security;

-- 4) 접근 정책 ------------------------------------------------
-- caregivers: 조회(공개) + 등록(공개). 수정/삭제는 정책 없음 = 차단
create policy "caregivers_select" on caregivers
  for select to anon, authenticated using (true);
create policy "caregivers_insert" on caregivers
  for insert to anon, authenticated with check (true);

-- requests: 저장(공개)만. 연락처 등 민감정보라 공개 조회는 막음
create policy "requests_insert" on requests
  for insert to anon, authenticated with check (true);

-- 5) 목업 데이터 6명 넣기 (한 번만 실행) --------------------------
insert into caregivers (name, is_certified, career_years, address, age_group, additional_certifications) values
('김순자', true,  8,  '서울 강북구 수유동',  '50대', ARRAY['치매전문 요양보호사 교육 이수','심폐소생술(CPR) 교육']),
('이영희', true,  3,  '서울 노원구 상계동',  '40대', ARRAY['간호조무사 자격증']),
('박정숙', true,  12, '경기 고양시 덕양구',  '60대', ARRAY['사회복지사 2급','치매전문 요양보호사 교육 이수']),
('최미경', true,  5,  '서울 성북구 길음동',  '40대', ARRAY['응급처치 자격증','운전 가능(자차 보유)']),
('정말순', true,  15, '인천 부평구 부평동',  '60대', ARRAY['호스피스 교육 이수','치매전문 요양보호사 교육 이수']),
('한지원', false, 1,  '서울 도봉구 창동',    '30대', ARRAY['요양보호사 자격 취득 교육 수강 중']);
