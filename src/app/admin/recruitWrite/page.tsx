import RecruitWrite from '@/components/features/admin/recruit/RecruitWrite';

export default function RecruitWritePage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const recruitId = searchParams.recruitId ?? '';
  return <RecruitWrite recruitId={recruitId} />;
}
