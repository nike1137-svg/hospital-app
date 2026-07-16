import Link from "next/link";
import CaregiverCount from "@/components/CaregiverCount";

export default function Home() {
  return (
    <div>
      {/* 히어로 */}
      <section className="text-center py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          병원 갈 때, 믿을 만한
          <br />
          <span className="text-teal-600">요양보호사</span>와 함께
        </h1>
        <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
          우리 동네에서 · 경력과 자격을 확인하고 · 조건에 맞는 요양보호사를
          찾아 병원동행을 매칭받으세요.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/caregivers"
            className="px-5 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            요양보호사 찾기
          </Link>
          <Link
            href="/register/request"
            className="px-5 py-3 rounded-lg border border-black/15 dark:border-white/20 font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            동행 요청하기
          </Link>
        </div>
      </section>

      {/* 이용 흐름 3단계 */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            step: "1",
            title: "요양보호사 등록",
            desc: "자격·경력·지역 정보를 등록해 일감을 받습니다.",
            href: "/register/caregiver",
          },
          {
            step: "2",
            title: "사용자 등록",
            desc: "동행이 필요한 날짜·지역·조건을 등록합니다.",
            href: "/register/request",
          },
          {
            step: "3",
            title: "매칭 결과",
            desc: "조건에 맞는 요양보호사를 찾아 연결합니다.",
            href: "/caregivers",
          },
        ].map((s) => (
          <Link
            key={s.step}
            href={s.href}
            className="rounded-xl border border-black/10 dark:border-white/15 p-5 hover:border-teal-500 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              {s.step}
            </div>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-foreground/60">{s.desc}</p>
          </Link>
        ))}
      </section>

      <CaregiverCount />
    </div>
  );
}
