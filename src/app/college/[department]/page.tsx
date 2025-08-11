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
    const clubs = await getClubCard(departmentCode);
    setClubs(clubs.clubs);
    setDepartmentTitle(clubs.department);
    setLoading(false);
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
