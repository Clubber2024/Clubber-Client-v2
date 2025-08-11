'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

interface Division {
  code: string;
  title: string;
}

export default function CenterList() {
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
                width={200}
                height={200}
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
                width={200}
                height={200}
                className="group-hover:brightness-75 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
