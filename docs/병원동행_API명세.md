# 병원동행 서비스 — API 명세서 (계약 문서)

- **작성일**: 2026-07-16
- **작성자**: 조경호
- **목적**: 프론트엔드와 백엔드가 **항상 이 문서를 기준**으로 개발한다. 기능이 바뀌면 코드보다 이 문서를 먼저 고친다. (계약 불일치 예방)
- **백엔드**: Supabase (PostgreSQL) — 브라우저에서 `@supabase/supabase-js`로 직접 호출
- **관련 문서**: `병원동행서비스_PRD.md`

---

## 0. 원칙 (이 문서를 쓰는 이유)

> "프론트가 기대하는 데이터 모양 ≠ 백엔드가 주는 모양" = **계약 불일치**. 연결 단계 최대 원흉.
> → 주고받을 JSON 모양을 **먼저 문서로 고정**하고, 양쪽을 이 문서 기준으로 짠다.

- 컬럼(DB)은 `snake_case`, 프론트 코드는 `camelCase` → **데이터 계층(`src/lib/`)에서 변환**한다.
- 모든 호출은 **로딩 / 성공 / 에러** 3상태로 처리한다.

---

## 1. 환경변수 (비밀값)

| 변수명 | 값 | 공개 여부 |
|--------|-----|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 🟢 공개돼도 됨 (브라우저 노출 O) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon(public) 키 | 🟢 공개돼도 됨 — **RLS로 보호** |
| ~~`service_role` 키~~ | (마스터 키) | 🔴 **프론트에 절대 넣지 않음** |

- 로컬: `.env.local` (git 미포함)
- 배포: GitHub 저장소 → Settings → Secrets and variables → Actions
- `NEXT_PUBLIC_` 접두사 = "브라우저에 공개"라는 뜻. 그래서 anon 키만 사용.

---

## 2. 데이터 모델 (테이블 스키마)

### 2.1 `caregivers` (요양보호사)

| 컬럼 (DB) | 타입 | 제약 | 프론트 필드 |
|-----------|------|------|-------------|
| `id` | `bigint` | PK, 자동증가 | `id` |
| `name` | `text` | NOT NULL | `name` |
| `is_certified` | `boolean` | NOT NULL, default false | `isCertified` |
| `career_years` | `int` | NOT NULL, default 0, `>= 0` | `careerYears` |
| `address` | `text` | NOT NULL | `address` |
| `age_group` | `text` | NOT NULL | `ageGroup` |
| `additional_certifications` | `text[]` | default `{}` | `additionalCertifications` |
| `created_at` | `timestamptz` | default now() | (미사용) |

### 2.2 `requests` (동행 요청)

| 컬럼 (DB) | 타입 | 제약 | 프론트 필드 |
|-----------|------|------|-------------|
| `id` | `bigint` | PK, 자동증가 | `id` |
| `name` | `text` | NOT NULL | `name` |
| `contact` | `text` | NOT NULL | `contact` |
| `region` | `text` | NOT NULL | `region` |
| `date` | `date` | NOT NULL | `date` |
| `purpose` | `text` | NOT NULL | `purpose` |
| `min_career_years` | `int` | default 0, `>= 0` | `minCareerYears` |
| `certified_only` | `boolean` | default false | `certifiedOnly` |
| `created_at` | `timestamptz` | default now() | (미사용) |

> **서버측 검증** = 위 `NOT NULL`·`>= 0` 제약 + RLS. 프론트 검증만 믿지 않는다. (루브릭 ① 대응)

---

## 3. 엔드포인트 (창구)

Supabase 클라이언트 호출 기준. 4개 = 각 테이블의 **조회(Read) + 저장(Create)**.

### 3.1 요양보호사 목록 조회 — Read
- **동작**: `supabase.from('caregivers').select('*').order('career_years', { ascending: false })`
- **요청**: 없음
- **응답 (성공)**:
```json
[
  {
    "id": 1,
    "name": "김순자",
    "isCertified": true,
    "careerYears": 8,
    "address": "서울 강북구 수유동",
    "ageGroup": "50대",
    "additionalCertifications": ["치매전문 요양보호사 교육 이수", "심폐소생술(CPR) 교육"]
  }
]
```

### 3.2 요양보호사 등록 — Create
- **동작**: `supabase.from('caregivers').insert({ ... })`
- **요청 (프론트 → DB, 변환 후)**:
```json
{
  "name": "테스트요양사",
  "is_certified": true,
  "career_years": 4,
  "address": "서울 강남구 역삼동",
  "age_group": "40대",
  "additional_certifications": ["간호조무사 자격증"]
}
```
- **응답 (성공)**: 저장된 행 1개 (위 3.1 형태)
- **에러 예**: 필수값 누락 → `NOT NULL` 위반 에러 반환

### 3.3 동행 요청 목록 조회 — Read
- **동작**: `supabase.from('requests').select('*').order('created_at', { ascending: false })`
- **응답 (성공)**:
```json
[
  {
    "id": 1,
    "name": "홍길동",
    "contact": "010-1234-5678",
    "region": "서울",
    "date": "2026-07-20",
    "purpose": "정형외과 정기 진료",
    "minCareerYears": 3,
    "certifiedOnly": true
  }
]
```

### 3.4 동행 요청 저장 — Create
- **동작**: `supabase.from('requests').insert({ ... })`
- **요청 (변환 후)**:
```json
{
  "name": "홍길동",
  "contact": "010-1234-5678",
  "region": "서울",
  "date": "2026-07-20",
  "purpose": "정형외과 정기 진료",
  "min_career_years": 3,
  "certified_only": true
}
```
- **응답 (성공)**: 저장된 행 1개

---

## 4. 보안 정책 (RLS) — 필수

Supabase는 anon 키가 공개라서, **RLS를 켜야만 안전**하다. (안 켜면 누구나 읽고·고치고·지울 수 있음)

| 테이블 | 정책 | 이유 |
|--------|------|------|
| `caregivers` | RLS 켜기 | 기본 차단 후 아래 허용 |
| `caregivers` | SELECT 허용 (anon) | 목록은 공개 조회 |
| `caregivers` | INSERT 허용 (anon) | 등록 폼용 |
| `caregivers` | UPDATE/DELETE **미허용** | 함부로 수정·삭제 방지 |
| `requests` | RLS 켜기 | |
| `requests` | INSERT 허용 (anon) | 요청 저장 |
| `requests` | SELECT | (과제 범위상 미허용 또는 관리자용) 개인정보라 신중히 |

> `requests`는 연락처 등 민감정보 → 조회는 최소화. 과제에선 "저장됨"만 보여도 충분.

---

## 5. 상태 처리 규약 (프론트)

모든 호출을 3상태로:
- **로딩**: 데이터 오기 전 → "불러오는 중…" 표시
- **성공**: 데이터 렌더
- **에러**: 서버 오류 → "일시적 오류, 다시 시도" 표시 (앱 멈춤 방지)

---

## 6. 변경 이력
- 2026-07-16 v0.1 — 초안 (테이블 2개, 엔드포인트 4개)
