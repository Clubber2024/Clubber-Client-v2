'use client';

import { Card } from '@/components/ui/card';
import { getMainPopularClubs } from './api/main';
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
    // fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getMainPopularClubs();
    setRank(res);

  };

  return (
    <>
      <h2 className="font-bold text-[16px] md:text-lg py-3 mt-2 pr-8">조회수</h2>

      <Card>
        <div className='text-center text-lg font-bold text-gray-500 h-[152px] flex flex-col items-center justify-center'>
         
          D-1 <br/> 조회수 TOP 10 랭킹 공개!<br/>
         <p className='text-sm text-primary'> COMING SOON!</p>
          </div>

        {/* <div className="grid grid-cols-2 px-7 font-medium text-sm pb-1 cursor-pointer gap-6">
          <div className="space-y-3">
            {rank.slice(0, 5).map((club, idx) => (
              <p
                key={idx}
                className="hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
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
                className="hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => router.push(`/clubInfo?clubId=${club.clubId}`)}
              >
                {idx + 6}. {club.clubName}
              </p>
            ))}
          </div>
        </div> */}
      </Card>
    </>
  );
}
