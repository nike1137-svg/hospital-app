# 병원동행 매칭 서비스 🏥

병원 방문이 어려운 어르신·보호자가 **우리 동네에서, 경력과 자격을 확인하고, 조건에 맞는 요양보호사**를 찾아 병원동행을 매칭받는 웹 서비스입니다.

---

## 🔗 배포 주소

- **라이브 사이트**: https://nike1137-svg.github.io/hospital-app/

---

## 📌 서비스 소개

- **무엇을**: 병원동행 서비스
- **누구를 위해**: 동행이 필요한 어르신·보호자(수요자) ↔ 요양보호사(공급자)
- **핵심 기능**: 요양보호사 등록 · 사용자(동행 요청) 등록 · 조건 기반 매칭 결과

---

## 🖥️ 화면 구성

| 화면 | 경로 | 설명 |
|------|------|------|
| 홈 | `/` | 서비스 소개 + 이용 흐름 3단계 |
| 요양보호사 찾기 | `/caregivers` | 지역·경력·자격 필터/정렬 매칭 결과 |
| 요양보호사 상세 | `/caregivers/detail?id=` | 개별 프로필 상세 |
| 요양보호사 등록 | `/register/caregiver` | 공급자 등록 폼 |
| 동행 요청 | `/register/request` | 수요자 등록 폼 |

---

## 🛠️ 기술 스택

- **프레임워크**: [Next.js 16](https://nextjs.org) (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **백엔드**: [Supabase](https://supabase.com) (PostgreSQL) — 요양보호사·동행요청 데이터 저장/조회, RLS(행 수준 보안) 적용
- **배포**: GitHub Pages (정적 export + GitHub Actions 자동 배포)

---

## 📁 프로젝트 구조

```
src/
├─ lib/
│  ├─ supabaseClient.ts        # Supabase 클라이언트 초기화
│  ├─ caregivers.ts            # 타입 정의 + 요양보호사 조회/등록 (Supabase)
│  └─ requests.ts              # 동행 요청 저장 (Supabase)
├─ components/
│  ├─ Nav.tsx                  # 상단 내비게이션
│  ├─ CaregiverCard.tsx        # 요양보호사 카드
│  ├─ CaregiverBrowser.tsx     # 필터·정렬 + 목록 조회 (클라이언트 컴포넌트)
│  └─ CaregiverCount.tsx       # 홈 화면 등록 인원 수 표시
└─ app/
   ├─ layout.tsx / page.tsx    # 공통 레이아웃 / 홈
   ├─ caregivers/
   │  ├─ page.tsx              # 목록(매칭 결과)
   │  └─ detail/page.tsx       # 상세 (쿼리 파라미터 방식, 정적 배포 호환)
   └─ register/
      ├─ caregiver/page.tsx    # 요양보호사 등록 → Supabase 저장
      └─ request/page.tsx      # 동행 요청 → Supabase 저장
```

> 백엔드 연결 정보(URL·키)는 `.env.local` 환경변수로 관리하며 저장소에 포함되지 않습니다. Supabase 테이블·RLS 정책 SQL은 `supabase/setup.sql` 참고.

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (.env.local)
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

```bash
# 프로덕션 빌드
npm run build
```

---

## 🗺️ 개발 로드맵

- [x] **Phase 1** — 프론트엔드 + 목업 데이터 (화면 5개)
- [x] **Phase 2** — GitHub Pages 배포 (GitHub Actions 자동 배포)
- [x] **Phase 3** — 백엔드(Supabase) 연동: 데이터 저장·조회 (요양보호사 등록, 동행 요청)

## 📚 상세 문서 (`docs/`)

- [`병원동행서비스_PRD.md`](docs/병원동행서비스_PRD.md) — 기획서
- [`병원동행_API명세.md`](docs/병원동행_API명세.md) — API 명세 (엔드포인트·데이터 모델)
- [`병원동행_보안점검.md`](docs/병원동행_보안점검.md) — 보안 자가점검 (RLS 실측 검증 포함)
- [`PRT_피어리뷰.md`](docs/PRT_피어리뷰.md) / [`제출_점검표.md`](docs/제출_점검표.md) — 피어 리뷰·제출 점검표
