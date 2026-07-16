"use client";

import { useEffect, useMemo, useState } from "react";
import type { Caregiver } from "@/lib/caregivers";
import { fetchCaregivers, getRegion } from "@/lib/caregivers";
import CaregiverCard from "@/components/CaregiverCard";

type SortKey = "career" | "name";
type Status = "loading" | "success" | "error";

export default function CaregiverBrowser() {
  const [status, setStatus] = useState<Status>("loading");
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);

  const [region, setRegion] = useState<string>("전체");
  const [certifiedOnly, setCertifiedOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<SortKey>("career");

  useEffect(() => {
    let alive = true;
    fetchCaregivers()
      .then((data) => {
        if (!alive) return;
        setCaregivers(data);
        setStatus("success");
      })
      .catch((e) => {
        console.error("요양보호사 조회 실패:", e);
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(caregivers.map((c) => getRegion(c.address)))),
    [caregivers]
  );

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

  // 로딩 상태
  if (status === "loading") {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-10 text-center text-foreground/60">
        요양보호사 정보를 불러오는 중…
      </div>
    );
  }

  // 에러 상태
  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
        일시적인 오류로 정보를 불러오지 못했습니다.
        <br />
        <button
          type="button"
          onClick={() => location.reload()}
          className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const selectClass =
    "rounded-lg border border-black/15 dark:border-white/20 bg-background px-3 py-2 text-sm";

  return (
    <div>
      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 dark:border-white/15 p-3 mb-5">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-foreground/60">지역</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={selectClass}
          >
            <option value="전체">전체</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-foreground/60">정렬</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={selectClass}
          >
            <option value="career">경력 많은 순</option>
            <option value="name">이름 순</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none ml-auto">
          <input
            type="checkbox"
            checked={certifiedOnly}
            onChange={(e) => setCertifiedOnly(e.target.checked)}
            className="w-4 h-4 accent-teal-600"
          />
          <span>자격 보유자만</span>
        </label>
      </div>

      <p className="text-sm text-foreground/60 mb-3">
        총 <strong className="text-foreground">{result.length}</strong>명의
        요양보호사
      </p>

      {result.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 dark:border-white/20 p-10 text-center text-foreground/60">
          조건에 맞는 요양보호사가 없습니다. 필터를 조정해 보세요.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {result.map((c) => (
            <CaregiverCard key={c.id} caregiver={c} />
          ))}
        </div>
      )}
    </div>
  );
}
