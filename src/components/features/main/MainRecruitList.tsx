'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { getMainRecruitList } from './api/main';
import { useEffect, useState } from 'react';

interface RecruitDataProps {
  clubId: number;
  recruitId: number;
  title: string;
  createdAt: string;
  recruitStatus: string;
}

export default function MainRecruitList() {
  const router = useRouter();
  const [recruitData, setRecruitData] = useState<RecruitDataProps[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getMainRecruitList();
    setRecruitData(res.recruits);
    // console.log(res.recruits);
  };

  return (
    <>
      <h2
        className="font-bold text-[16px] md:text-lg py-3 mt-2 cursor-pointer"
        onClick={() => router.push('/recruitList')}
      >
        모집글
      </h2>
      <Card className="p-6 gap-2">
        {recruitData?.map((recruit, idx) => (
          <div
            key={idx}
            className="p-0 flex flex-row items-center justify-between text-[13px] md:text-sm hover:text-primary transition-colors"
          >
            <div>
              <Badge
                className="mr-2 h-6 rounded-3xl px-3 font-bold text-xs md:text-sm"
                style={{
                  backgroundColor: recruit.recruitStatus === '진행중' ? '#4C9DB5' : '#334A52',
                }}
              >
                {recruit.recruitStatus}
              </Badge>
              <span className="font-medium">{recruit.title}</span>
            </div>
            <span className="font-medium">{recruit.createdAt}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
