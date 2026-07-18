# 병원동행 매칭 서비스 🏥

병원 방문이 어려운 어르신·보호자가 **우리 동네에서, 경력과 자격을 확인하고, 조건에 맞는 요양보호사**를 찾아 병원동행을 매칭받는 웹 서비스입니다.

> 모두의연구소 과정 과제 프로젝트 · 작성자: 조경호

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
| 요양보호사 상세 | `/caregivers/[id]` | 개별 프로필 상세 |
| 요양보호사 등록 | `/register/caregiver` | 공급자 등록 폼 |
| 동행 요청 | `/register/request` | 수요자 등록 폼 |

---

## 🛠️ 기술 스택

- **프레임워크**: [Next.js 16](https://nextjs.org) (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **데이터**: 목업 JSON (`src/data/caregivers.json`) — 추후 Supabase 연동 예정
- **배포**: GitHub Pages (정적 export + GitHub Actions)

---

## 📁 프로젝트 구조

```
src/
├─ data/
│  └─ caregivers.json          # 목업 데이터 (요양보호사 6명)
├─ lib/
│  └─ caregivers.ts            # 타입 정의 + 데이터 조회 함수
├─ components/
│  ├─ Nav.tsx                  # 상단 내비게이션
│  ├─ CaregiverCard.tsx        # 요양보호사 카드
│  └─ CaregiverBrowser.tsx     # 필터·정렬 (클라이언트 컴포넌트)
└─ app/
   ├─ layout.tsx / page.tsx    # 공통 레이아웃 / 홈
   ├─ caregivers/
   │  ├─ page.tsx              # 목록(매칭 결과)
   │  └─ [id]/page.tsx         # 상세
   └─ register/
      ├─ caregiver/page.tsx    # 요양보호사 등록
      └─ request/page.tsx      # 동행 요청
```

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
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
- [x] **Phase 2** — GitHub Pages 배포
- [x] **Phase 3** — 백엔드(Supabase) 연동: 데이터 저장·로그인·매칭

> 상세 기획은 저장소 밖 `병원동행서비스_PRD.md` 참고.
