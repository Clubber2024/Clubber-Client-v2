'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClubCard from '@/components/features/club/ClubCard';
import { ClubCardRes } from '@/types/club/clubCardData';
import { getClubCard } from '@/components/features/club/api/clubCard';
import BranchHeader from '@/components/common/BranchHeader';

export default function DivisionPage() {
  const params = useParams();
  const divisionCode = params.division as string;
  const [divisionTitle, setDivisionTitle] = useState<string>('');
  const [clubs, setClubs] = useState<ClubCardRes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubCardData = async () => {
      setLoading(true);
      const clubs = await getClubCard(divisionCode, true);
      setClubs(clubs.clubs);
      setDivisionTitle(clubs.division);
      setLoading(false);
    };

    if (divisionCode) {
      fetchClubCardData();
    }
  }, [divisionCode, divisionTitle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* 헤더 섹션 */}
      <BranchHeader mainTitle={divisionTitle} subTitle="중앙동아리" />

      {/* 동아리 목록 */}
      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.clubId} club={club} />
          ))}
        </div>

        {clubs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">해당 분과에 등록된 동아리가 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
