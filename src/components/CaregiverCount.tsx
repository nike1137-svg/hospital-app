"use client";

import { useEffect, useState } from "react";
import { fetchCaregivers } from "@/lib/caregivers";

export default function CaregiverCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetchCaregivers()
      .then((data) => {
        if (alive) setCount(data.length);
      })
      .catch(() => {
        if (alive) setCount(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <p className="mt-8 text-center text-sm text-foreground/50">
      현재{" "}
      <strong className="text-foreground">{count ?? "…"}</strong>명의
      요양보호사가 등록되어 있습니다.
    </p>
  );
}
