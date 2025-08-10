'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

interface Division {
  code: string;
  title: string;
}

export default function BranchPage() {
  const router = useRouter();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const firstRow = divisions.slice(0, 4);
  const secondRow = divisions.slice(4, 7);

  const getCenterBranchData = async () => {
    try {
      const res = await apiClient.get(`/v1/clubs/category/divisions`);

      if (res.data.success) {
        const division = res.data.data.map((item: Division) => item);
        setDivisions(division);
        console.log(divisions);
      }
    } catch (error) {
      console.error('Error fetching data : ', error);
    }
  };

  useEffect(() => {
    getCenterBranchData();
  }, []);

  const onClickDivision = (division: Division) => {
    router.push(`/center/${division.code}`);
  };

  return (
    <>
      {/* 배경 이미지 - 전체 너비 */}
      <div
        className="relative w-screen"
        style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      >
        <Image
          src={'/images/center/Union.png'}
          alt="branch-background"
          className="w-full h-70 relative mb-14"
          width={1920}
          height={50}
        />
        <div className="absolute inset-0 items-center justify-center">
          <Image
            src={'/images/center/home.png'}
            alt="icon"
            className="absolute top-20 left-37"
            width={15}
            height={15}
          />
          <ChevronRight size={15} className="absolute top-20 left-43 text-white" />
          <p className="absolute top-19 left-48 text-white text-[13px] mt-0.5">중앙동아리</p>
          <h1 className="absolute top-27 left-36 text-3xl text-white font-semibold">중앙동아리</h1>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex flex-row items-center justify-center gap-5">
            {firstRow.map((division) => (
              <div
                key={division.code}
                className="hover:scale-105 transition-all duration-300 bg-black/20 rounded-xl group cursor-pointer"
                onClick={() => onClickDivision(division)}
              >
                {/* 분과 로고 */}
                <Image
                  src={`/images/center/${division.code}.png`}
                  alt={`${division.title} 로고`}
                  width={170}
                  height={170}
                  className="group-hover:brightness-75 transition-all duration-300"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center justify-center gap-5">
            {secondRow.map((division) => (
              <div
                key={division.code}
                className="hover:scale-105 transition-all duration-300 bg-black/20 rounded-xl group cursor-pointer"
                onClick={() => onClickDivision(division)}
              >
                {/* 분과 로고 */}
                <Image
                  src={`/images/center/${division.code}.png`}
                  alt={`${division.title} 로고`}
                  width={170}
                  height={170}
                  className="group-hover:brightness-75 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
