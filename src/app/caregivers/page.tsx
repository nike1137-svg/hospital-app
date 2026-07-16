import CaregiverBrowser from "@/components/CaregiverBrowser";

export const metadata = {
  title: "요양보호사 찾기 · 병원동행",
};

export default function CaregiversPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">요양보호사 찾기</h1>
        <p className="mt-1 text-foreground/60">
          지역·경력·자격 조건으로 매칭 결과를 확인하세요.
        </p>
      </div>
      <CaregiverBrowser />
    </div>
  );
}
