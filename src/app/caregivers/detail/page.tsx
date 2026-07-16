"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Caregiver } from "@/lib/caregivers";
import { fetchCaregiverById } from "@/lib/caregivers";

type Status = "loading" | "success" | "error" | "notfound";

function DetailContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [status, setStatus] = useState<Status>("loading");
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);

  useEffect(() => {
    const id = Number(idParam);
    if (!idParam || Number.isNaN(id)) {
      setStatus("notfound");
      return;
    }
    let alive = true;
    fetchCaregiverById(id)
      .then((c) => {
        if (!alive) return;
        if (!c) {
          setStatus("notfound");
        } else {
          setCaregiver(c);
          setStatus("success");
        }
      })
      .catch((e) => {
        console.error("요양보호사 상세 조회 실패:", e);
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [idParam]);

  if (status === "loading") {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-10 text-center text-foreground/60">
        불러오는 중…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
        일시적인 오류로 정보를 불러오지 못했습니다.
      </div>
    );
  }

  if (status === "notfound" || !caregiver) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 dark:border-white/20 p-10 text-center text-foreground/60">
        해당 요양보호사를 찾을 수 없습니다.
        <br />
        <Link
          href="/caregivers"
          className="mt-3 inline-block px-4 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700"
        >
          목록으로
        </Link>
      </div>
    );
  }

  const c = caregiver;

  return (
    <div className="max-w-2xl">
      <Link
        href="/caregivers"
        className="text-sm text-foreground/60 hover:text-foreground"
      >
        ← 목록으로
      </Link>

      <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/15 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-2xl shrink-0">
            {c.name.at(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{c.name}</h1>
              {c.isCertified ? (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-700">
                  자격 보유
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                  예비 (교육 중)
                </span>
              )}
            </div>
            <p className="text-foreground/60 mt-0.5">
              {c.ageGroup} · 경력 {c.careerYears}년
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-foreground/50">주소지</dt>
            <dd className="mt-0.5 font-medium">{c.address}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">경력</dt>
            <dd className="mt-0.5 font-medium">{c.careerYears}년</dd>
          </div>
          <div>
            <dt className="text-foreground/50">연령대</dt>
            <dd className="mt-0.5 font-medium">{c.ageGroup}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">자격 유무</dt>
            <dd className="mt-0.5 font-medium">
              {c.isCertified ? "요양보호사 자격 보유" : "미보유 (교육 수강 중)"}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <p className="text-foreground/50 text-sm">추가 자격증 사항</p>
          {c.additionalCertifications.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {c.additionalCertifications.map((cert) => (
                <span
                  key={cert}
                  className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/10"
                >
                  {cert}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-foreground/50">없음</p>
          )}
        </div>

        <button
          type="button"
          className="mt-8 w-full py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
        >
          이 요양보호사에게 동행 요청하기
        </button>
        <p className="mt-2 text-center text-xs text-foreground/40">
          * 요청 연결은 동행 요청 페이지에서 접수됩니다.
        </p>
      </div>
    </div>
  );
}

export default function CaregiverDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-black/10 dark:border-white/15 p-10 text-center text-foreground/60">
          불러오는 중…
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  );
}
