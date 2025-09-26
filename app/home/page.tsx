import { HomeInterface } from "@/components/home-interface";

export default async function HomePage({
  searchParams,
}: {
  // Next 15+: searchParams는 Promise로 들어옵니다
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;      // ✅ 반드시 await
  const raw = sp?.v;
  const v = Array.isArray(raw) ? raw[0] : raw ?? "0";

  return <HomeInterface key={v} />;   // remount 키로 사용
}
