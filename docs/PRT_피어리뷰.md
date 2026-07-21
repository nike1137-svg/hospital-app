# AIFFEL Campus Code Peer Review Template

- **코더**: 조경호
- **리뷰어**: 피하영

# PRT (Peer Review Template)

[O]  **1. 주어진 문제를 해결하는 완성된 코드가 제출되었나요?**
- 문제(PRD)가 요구하는 5개 화면 + Supabase 연동 기능이 실제로 구현되어 있음.

**근거 (코드)**

`src/lib/caregivers.ts` — Supabase 목록 조회 함수:
```ts
export async function fetchCaregivers(): Promise<Caregiver[]> {
  const { data, error } = await supabase
    .from("caregivers")
    .select("*")
    .order("career_years", { ascending: false });
  if (error) throw error;
  return (data as CaregiverRow[]).map(toCaregiver);
}
```

`src/lib/requests.ts` — 동행 요청 저장 함수:
```ts
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
```

`src/app/register/request/page.tsx` — 위 함수를 실제 폼 submit에 연결, 로딩/성공/에러 3상태 처리:
```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  setStatus("saving");
  try {
    await insertRequest({ ...(form 값 매핑)... });
    setStatus("success");
  } catch (err) {
    console.error("동행 요청 저장 실패:", err);
    setStatus("error");
  }
}
```

라이브 배포: https://nike1137-svg.github.io/hospital-app/ (README.md:11)

> ⚠️ 참고: 화면 캡쳐(스크린샷)는 이번 리뷰에서 첨부하지 못했습니다. 필요하면 배포 사이트를 직접 열어 캡쳐를 추가하는 것을 권장합니다.

---

[O]  **2. 핵심적이거나 복잡하고 이해하기 어려운 부분에 작성된 설명을 보고 해당 코드가 잘 이해되었나요?**
- 데이터 계층(`src/lib/`)에 DB(snake_case) ↔ 프론트(camelCase) 변환처럼 헷갈리기 쉬운 부분에 doc comment가 달려 있어 "왜 이렇게 짜였는지"가 코드만 봐도 이해됨.

**근거 (코드)**

`src/lib/caregivers.ts:32-33`:
```ts
/** DB row -> 앱 타입 변환 (계약 문서 기준) */
function toCaregiver(row: CaregiverRow): Caregiver {
```

`src/lib/caregivers.ts:18-30` — 타입에 필드별 의미를 주석으로 명시:
```ts
export type Caregiver = {
  id: number;
  name: string;
  /** 요양보호사 자격 유무 */
  isCertified: boolean;
  /** 경력 (년) */
  careerYears: number;
  ...
};

/** 등록 시 입력값 (id는 DB가 자동 생성) */
export type NewCaregiver = Omit<Caregiver, "id">;

/** DB row(snake_case) 모양 */
type CaregiverRow = { ... };
```

`src/lib/supabaseClient.ts:3-4` — 환경변수 노출 원리에 대한 설명:
```ts
// 환경변수에서 읽음 (.env.local / GitHub Secrets)
// NEXT_PUBLIC_ 접두사 = 브라우저에 공개되는 값. publishable 키는 공개 안전(RLS로 보호).
```

또한 `docs/병원동행_API명세.md`의 "0. 원칙" 섹션이 위 변환 코드가 왜 필요한지(계약 불일치 방지) 마크다운으로 별도 설명하고 있어, 코드 하나만으로는 알기 어려운 설계 의도까지 보완됨.

---

[O]  **3. 에러가 난 부분을 디버깅하여 "문제를 해결한 기록"을 남겼나요? 또는 "새로운 시도 및 추가 실험"을 해봤나요?**
- 요구조건(RLS 설정)을 "설정했다"에 그치지 않고, 실제 라이브 DB에 공개 키로 직접 요청을 보내 허용/차단이 의도대로 동작하는지 검증한 실험 기록이 있음.

**근거 (문서 캡쳐 — `docs/병원동행_보안점검.md:36-51`)**
```
| 시도 | 기대 | 실제 결과 |
|------|------|-----------|
| `caregivers` 조회 | 허용 | ✅ 8명 조회됨 |
| `requests` 조회 (연락처 등) | 차단 | ✅ 0건 — 개인정보 노출 안 됨 |
| `caregivers` 삭제 | 차단 | ✅ 8→8명, 삭제 안 됨 |
| `caregivers` 수정 | 차단 | ✅ 수정 반영 안 됨 |
```
→ 4가지 케이스를 직접 실행해보고 기대값과 실제값을 표로 남긴 것은 "추가 실험" 항목에 해당.

**보완이 필요한 부분**
- git 커밋 이력에 `Move deploy workflow to reference (no workflow scope on token)` (커밋 `502a96d`)라는 항목이 있어 배포 과정에서 GitHub 토큰 권한 에러를 겪고 해결한 것으로 보이나, 커밋 메시지 한 줄 외에 **원인·해결 과정을 설명하는 별도 기록은 없음**. 이 부분은 짧게라도 문서화하면 더 좋음.

---

[X]  **4. 회고를 잘 작성했나요?**
- 저장소 전체(`README.md`, `docs/*.md`)를 확인했으나 배운점/아쉬운점/느낀점/어려웠던 점을 담은 회고 문서를 찾지 못함.

**근거**
```
$ ls docs/
병원동행_API명세.md
병원동행_보안점검.md
병원동행서비스_PRD.md
```
→ 회고에 해당하는 파일이 없음. (참고: 이 프로젝트는 웹 서비스라 "인풋→아웃풋 모델 아키텍처 도식화" 항목은 해당 없음(N/A)으로 판단.)

**제안**: `docs/회고.md`를 추가해 아래 틀을 채우는 것을 권장합니다.
```markdown
## 배운 점
## 아쉬운 점
## 느낀 점
## 어려웠던 점
```

---

[X]  **5. 코드가 간결하고 효율적인가요?**
- (Python 프로젝트가 아니므로 PEP8 대신 ESLint/TypeScript 컨벤션 준수 여부로 대체 확인)
- 실제로 `npx eslint .`를 실행한 결과, **에러 1건**이 발견되어 X로 판단함.

**근거 (lint 실행 결과)**
```
C:\Users\피하영\Desktop\hospital-app-fork\src\app\caregivers\detail\page.tsx
  21:7  error  Error: Calling setState synchronously within an effect can trigger cascading renders

  19 |     const id = Number(idParam);
  20 |     if (!idParam || Number.isNaN(id)) {
> 21 |       setStatus("notfound");
     |       ^^^^^^^^^ Avoid calling setState() directly within an effect
  22 |       return;
  23 |     }
  24 |     let alive = true;  react-hooks/set-state-in-effect

✖ 1 problem (1 error, 0 warnings)
```
→ `useEffect` 안에서 조건이 안 맞으면 바로 `setState`를 호출하는 패턴(`src/app/caregivers/detail/page.tsx:21`)이 React 공식 권장 패턴에 어긋남 (연쇄 렌더링 유발 가능). `id`가 유효한지 판단하는 로직을 effect 바깥(렌더링 중 계산)으로 옮기거나, `useMemo`로 유효성 여부를 미리 계산하는 방식으로 고치는 것을 권장.

**근거 (모듈화 — 이 부분은 잘 되어 있음)**

컴포넌트가 역할별로 잘 분리되어 있음 (`src/components/`):
- `CaregiverBrowser.tsx` — 상태·필터링·정렬 로직 (클라이언트 컴포넌트)
- `CaregiverCard.tsx` — 카드 UI만 담당, `caregiver` prop만 받는 순수 표시 컴포넌트
- `Nav.tsx`, `CaregiverCount.tsx` — 각각 단일 책임

`src/components/CaregiverBrowser.tsx:41-55` — 필터·정렬 로직이 `useMemo`로 캡슐화되어 중복 없이 재사용됨:
```tsx
const result = useMemo(() => {
  let list = [...caregivers];
  if (region !== "전체") {
    list = list.filter((c) => getRegion(c.address) === region);
  }
  if (certifiedOnly) {
    list = list.filter((c) => c.isCertified);
  }
  list.sort((a, b) =>
    sort === "career"
      ? b.careerYears - a.careerYears
      : a.name.localeCompare(b.name, "ko")
  );
  return list;
}, [caregivers, region, certifiedOnly, sort]);
```

`src/lib/caregivers.ts` — `toCaregiver()` 변환 함수를 만들어 `fetchCaregivers`/`fetchCaregiverById` 양쪽에서 재사용 (중복 제거).

**보완이 필요한 부분**
- `src/app/register/request/page.tsx`와 `src/app/register/caregiver/page.tsx`가 폼 처리 로직(로딩/성공/에러 상태, `handleSubmit` 패턴)이 거의 동일한 구조로 반복되는 것으로 보임 — 공통 훅(`useSubmitForm` 등)으로 추출하면 더 간결해질 여지 있음. (두 파일을 나란히 비교해 확정 필요)

---

# 참고 링크 및 코드 개선

```
- 원본 PRT 항목 5번은 "PEP8"(Python 스타일 가이드) 기준이나, 본 프로젝트는 TypeScript/Next.js이므로
  ESLint(`eslint.config.mjs`, `next lint`) 준수 여부로 대체 평가함.
```
