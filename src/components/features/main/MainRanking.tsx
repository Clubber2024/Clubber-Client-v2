'use client';

import { Card } from '@/components/ui/card';
import { getMainPopualrClubs } from './api/main';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RankData {
  clubId: number;
  clubName: string;
  totalViews: number;
}

export default function MainRanking() {
  const router = useRouter();
  const [rank, setRank] = useState<RankData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getMainPopualrClubs();
    setRank(res);
    console.log(res);
  };

  return (
    <>
      <h2 className="font-bold text-lg py-3 mt-2 pr-8">조회수</h2>
      <Card>
        <div className="grid grid-cols-2 px-7 font-medium text-sm pb-1 cursor-pointer">
          <div className="space-y-3">
            {rank.slice(0, 5).map((club, idx) => (
              <p
                key={idx}
                className="hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => router.push(`/clubInfo?clubId=${club.clubId}`)}
              >
                {idx + 1}. {club.clubName}
              </p>
            ))}
          </div>
          <div className="space-y-3">
            {rank.slice(5, 10).map((club, idx) => (
              <p
                key={idx}
                className="hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => router.push(`/clubInfo?clubId=${club.clubId}`)}
              >
                {idx + 6}. {club.clubName}
              </p>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
