'use client';

import { useEffect, useState } from 'react';
import { College } from '@/types/branch/collegeData';
import { getColleges } from './api/college';
import { Card } from '@/components/ui/card';
import Loading from '@/components/common/Loading';
import Link from 'next/link';

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const collegesData = await getColleges();
        setColleges(collegesData);
      } catch (error) {
        console.error('Error fetching college data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // 첫 번째 행 (4개 단과대)
  const firstRow = colleges.slice(0, 4);
  // 두 번째 행 (나머지 단과대들)
  const secondRow = colleges.slice(4);

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-8 md:max-w-6xl md:mx-auto px-4 md:px-0">
      {/* 첫 번째 행 */}
      <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-4 md:gap-6">
        {firstRow.map((college) => (
          <CollegeCard key={college.collegeCode} college={college} />
        ))}
      </div>

      {/* 두 번째 행 */}
      {secondRow.length > 0 && (
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-4 md:gap-6">
          {secondRow.map((college) => (
            <CollegeCard key={college.collegeCode} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CollegeCardProps {
  college: College;
}

function CollegeCard({ college }: CollegeCardProps) {
  return (
    <Card className="overflow-hidden w-42 md:w-50 h-80 p-4 md:p-6 hover:scale-103 transition-all duration-300 bg-white shadow-lg hover:shadow-xl border border-gray-200">
      <div className="flex flex-col h-full">
        {/* 단과대명 */}
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">
          {college.collegeTitle}
        </h3>

        {/* 학과 목록 - 스크롤 가능 */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {college.departments.length > 0 ? (
            college.departments.map((dept) => (
              <Link href={`/college/${dept.code}`} key={dept.code}>
                <div className="text-[13px] md:text-sm text-gray-600 p-2 mb-1.5 bg-gray-50 rounded-md hover:bg-secondary transition-colors cursor-pointer">
                  {dept.title}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-400 text-center py-8">학과 정보가 없습니다</div>
          )}
        </div>
      </div>
    </Card>
  );
}
