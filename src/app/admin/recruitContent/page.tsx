import RecruitContent from '@/components/features/admin/recruit/RecruitContent';

export default function RecruitContentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const recruitId = searchParams.recruitId ?? '';
  return <RecruitContent recruitId={recruitId} />;
}
