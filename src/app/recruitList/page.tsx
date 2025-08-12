import RecruitList from "@/components/features/recruit/RecruitList";

export default function RecruitListPage({
  searchParams,
}:{
  searchParams: { [key: string]: string };
}) {
  const clubId = searchParams.clubId ?? '';
  return <RecruitList clubId={clubId}/>
}