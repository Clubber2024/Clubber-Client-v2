'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
interface Division {
  id: number;
  name: string;
  logoUrl: string;
}

export default function BranchPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const firstRow = divisions.slice(0, 4);
  const secondRow = divisions.slice(4, 7);
  const getCenterBranchData = async () => {
    try {
      // const res = await customAxios.get(`/v1/clubs/category/divisions`);
      const res = await axios.get('https://dev.ssuclubber.com/api/v1/clubs/category/divisions', {
        withCredentials: true,
      });

      if (res.data.success) {
        const division = res.data.data.map((item: any) => item);
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

  return (
    <>
      <div className="relative">
        <img
          src={'/images/center/Union.png'}
          alt="background"
          className="w-full h-full object-cover relative"
        />
        <img
          src={'/images/center/home.png'}
          alt="icon"
          className="absolute top-10 left-30 w-5 h-5"
        />
        <img src={'/images/center/right_line.png'} className="absolute top-11 left-39 w-3 h-3" />
        <p className="absolute top-9.5 left-44 text-white">중앙동아리</p>
        <h1 className="absolute top-20 left-30 text-3xl text-white font-semibold">중앙동아리</h1>
      </div>
      <div>
        {divisions.map((division) => (
          <Card key={division.id} className="p-4 flex flex-col items-center">
            {/* 분과 로고 */}
            <img
              src={division.logoUrl} // division 안에 로고 URL이 있다고 가정
              alt={`${division.name} 로고`}
              className="w-24 h-24 object-contain mb-4"
            />
            {/* 분과명 */}
            <h2 className="font-semibold text-lg text-center">{division.name}</h2>
          </Card>
        ))}
      </div>
    </>
  );
}
