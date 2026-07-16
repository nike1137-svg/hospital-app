"use client";

import { useState } from "react";
import Link from "next/link";
import { insertRequest } from "@/lib/requests";

const fieldClass =
  "w-full rounded-lg border border-black/15 dark:border-white/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
const labelClass = "block text-sm font-medium mb-1";

type Status = "idle" | "saving" | "success" | "error";

export default function RequestRegisterPage() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("saving");
    try {
      await insertRequest({
        name: String(form.get("name") ?? ""),
        contact: String(form.get("contact") ?? ""),
        region: String(form.get("region") ?? ""),
        date: String(form.get("date") ?? ""),
        purpose: String(form.get("purpose") ?? ""),
        minCareerYears: Number(form.get("minCareerYears")),
        certifiedOnly: form.get("certifiedOnly") === "on",
      });
      setStatus("success");
    } catch (err) {
      console.error("동행 요청 저장 실패:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-4xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold">동행 요청이 접수되었습니다</h1>
        <p className="mt-2 text-foreground/60">
          요청이 저장되었습니다. 조건에 맞는 요양보호사를 확인해 보세요.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="px-4 py-2 rounded-lg border border-black/15 dark:border-white/20 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            다시 요청
          </button>
          <Link
            href="/caregivers"
            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700"
          >
            매칭 결과 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">동행 요청하기</h1>
      <p className="mt-1 text-foreground/60">
        동행이 필요한 날짜·지역·조건을 알려주시면 요양보호사를 매칭해 드립니다.
      </p>

      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">
            신청자 이름
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="contact">
            연락처
          </label>
          <input
            id="contact"
            name="contact"
            placeholder="예: 010-1234-5678"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="region">
            지역
          </label>
          <select id="region" name="region" required className={fieldClass}>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="date">
            희망 일시
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="purpose">
            진료 목적
          </label>
          <input
            id="purpose"
            name="purpose"
            placeholder="예: 정형외과 정기 진료, 검사 동행"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="minCareerYears">
            최소 경력 (년)
          </label>
          <input
            id="minCareerYears"
            name="minCareerYears"
            type="number"
            min={0}
            defaultValue={0}
            className={fieldClass}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            name="certifiedOnly"
            className="w-4 h-4 accent-teal-600"
          />
          자격 보유 요양보호사만 매칭
        </label>

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "전송 중…" : "요청 보내기"}
        </button>
      </form>
    </div>
  );
}
