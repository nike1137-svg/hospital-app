import Link from "next/link";

const links = [
  { href: "/", label: "홈" },
  { href: "/caregivers", label: "요양보호사 찾기" },
  { href: "/register/request", label: "동행 요청하기" },
  { href: "/register/caregiver", label: "요양보호사 등록" },
];

export default function Nav() {
  return (
    <header className="border-b border-black/10 dark:border-white/15 bg-background/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-1 sm:gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight mr-2 shrink-0">
          <span className="text-teal-600">병원</span>동행
        </Link>
        <div className="flex items-center gap-1 sm:gap-3 text-sm overflow-x-auto">
          {links.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2 py-1 rounded-md text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 whitespace-nowrap transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
