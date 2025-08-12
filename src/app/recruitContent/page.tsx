import RecruitContent from "@/components/features/recruit/RecruitContent";

export default function RecruitContentPage({
  searchParams,
}: {
  searchParams: { recruitId?: string };
}) {
  const recruitId = searchParams.recruitId ? parseInt(searchParams.recruitId) : undefined;
  
  return <RecruitContent recruitId={recruitId} />;
}
