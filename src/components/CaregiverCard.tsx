import Link from "next/link";
import type { Caregiver } from "@/lib/caregivers";

export default function CaregiverCard({ caregiver }: { caregiver: Caregiver }) {
  const c = caregiver;
  return (
    <Link
      href={`/caregivers/detail?id=${c.id}`}
      className="block rounded-xl border border-black/10 dark:border-white/15 p-4 hover:border-teal-500 hover:shadow-sm transition-all bg-background"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg shrink-0">
            {c.name.at(0)}
          </div>
          <div>
            <p className="font-semibold leading-tight">{c.name}</p>
            <p className="text-sm text-foreground/60">
              {c.ageGroup} · 경력 {c.careerYears}년
            </p>
          </div>
        </div>
        {c.isCertified ? (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-700 whitespace-nowrap">
            자격 보유
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700 whitespace-nowrap">
            예비
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-foreground/70">📍 {c.address}</p>

      {c.additionalCertifications.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.additionalCertifications.map((cert) => (
            <span
              key={cert}
              className="text-xs px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-foreground/70"
            >
              {cert}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
