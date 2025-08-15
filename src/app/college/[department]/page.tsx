'use client';

import BranchHeader from '@/components/common/BranchHeader';
import ClubList from '@/components/features/club/ClubList';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getClubCard } from '@/components/features/club/api/clubCard';
import { ClubCardRes } from '@/types/club/clubCardData';
import Loading from '@/components/common/Loading';

export default function DepartmentPage() {
  const params = useParams();
  const departmentCode = params.department as string;
  const [departmentTitle, setDepartmentTitle] = useState<string>('');
  const [clubs, setClubs] = useState<ClubCardRes[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubCardData = async () => {
    try {
      // 학과 코드로 제목 설정

      // 동아리 목록 가져오기
      const clubsData = await getClubCard(departmentCode, false);
      setClubs(clubsData.clubs);
      setDepartmentTitle(clubsData.department);
    } catch (error) {
      console.error('Error fetching data:', error);
      setClubs([]);
      setDepartmentTitle(`학과 코드: ${departmentCode}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubCardData();
  }, [departmentCode]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <BranchHeader mainTitle={departmentTitle} subTitle="단과대" />
      <ClubList clubs={clubs} />
    </>
  );
}
