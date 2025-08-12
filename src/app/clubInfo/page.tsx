import ClubInfo from "@/components/features/club/ClubInfo"

export default function ClubInfoPage({
  searchParams,
}:{
  searchParams: { [key: string]: string };
}){
  const clubId = searchParams.clubId ?? '';
  return <ClubInfo clubId={clubId}/>
}