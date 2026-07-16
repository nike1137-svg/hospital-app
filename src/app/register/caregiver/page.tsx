"use client";

import { useState } from "react";
import Link from "next/link";
import { insertCaregiver } from "@/lib/caregivers";

const fieldClass =
  "w-full rounded-lg border border-black/15 dark:border-white/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
const labelClass = "block text-sm font-medium mb-1";

type Status = "idle" | "saving" | "success" | "error";

export default function CaregiverRegisterPage() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("saving");
    try {
      await insertCaregiver({
        name: String(form.get("name") ?? ""),
        isCertified: form.get("isCertified") === "on",
        careerYears: Number(form.get("careerYears")),
        address: String(form.get("address") ?? ""),
        ageGroup: String(form.get("ageGroup") ?? ""),
        additionalCertifications: String(form.get("additionalCertifications") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setStatus("success");
    } catch (err) {
      console.error("요양보호사 등록 실패:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-4xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold">등록이 완료되었습니다</h1>
        <p className="mt-2 text-foreground/60">
          입력하신 정보가 저장되었습니다. 목록에서 확인해 보세요.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="px-4 py-2 rounded-lg border border-black/15 dark:border-white/20 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            다시 등록
          </button>
          <Link
            href="/caregivers"
            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700"
          >
            요양보호사 목록 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">요양보호사 등록</h1>
      <p className="mt-1 text-foreground/60">
        일감을 받기 위해 자격·경력·지역 정보를 등록하세요.
      </p>

      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">
            이름
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="careerYears">
            경력 (년)
          </label>
          <input
            id="careerYears"
            name="careerYears"
            type="number"
            min={0}
            defaultValue={0}
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="address">
            주소지
          </label>
          <input
            id="address"
            name="address"
            placeholder="예: 서울 강북구 수유동"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ageGroup">
            연령대
          </label>
          <select id="ageGroup" name="ageGroup" required className={fieldClass}>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대">60대</option>
            <option value="70대 이상">70대 이상</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="additionalCertifications">
            추가 자격증 사항
          </label>
          <input
            id="additionalCertifications"
            name="additionalCertifications"
            placeholder="쉼표로 구분 (예: 간호조무사, 치매전문교육)"
            className={fieldClass}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            name="isCertified"
            className="w-4 h-4 accent-teal-600"
          />
          요양보호사 자격증 보유
        </label>

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "저장 중…" : "등록하기"}
        </button>
      </form>
    </div>
  );
}
