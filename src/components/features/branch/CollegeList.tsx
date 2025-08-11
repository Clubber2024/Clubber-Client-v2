'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { College, Department } from '@/types/college/collegeData';
import { getColleges, getDepartments } from './api/college';
import { Card } from '@/components/ui/card';
import Loading from '@/components/common/Loading';

export default function CollegeList() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [departmentsMap, setDepartmentsMap] = useState<Record<string, Department[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 단과대 목록 조회
        const collegesResponse = await getColleges();
        if (collegesResponse.success) {
          setColleges(collegesResponse.data);

          // 각 단과대별 학과 목록 조회
          const deptMap: Record<string, Department[]> = {};
          for (const college of collegesResponse.data) {
            try {
              const deptResponse = await getDepartments(college.code);
              if (deptResponse.success) {
                deptMap[college.code] = deptResponse.data;
              }
            } catch (error) {
              console.error(`Error fetching departments for ${college.code}:`, error);
              deptMap[college.code] = [];
            }
          }
          setDepartmentsMap(deptMap);
        }
      } catch (error) {
        console.error('Error fetching college data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCollegeClick = (college: College) => {
    router.push(`/college/${college.code}`);
  };

  if (loading) {
    return <Loading />;
  }

  // 첫 번째 행 (4개 단과대)
  const firstRow = colleges.slice(0, 4);
  // 두 번째 행 (나머지 단과대들)
  const secondRow = colleges.slice(4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* 첫 번째 행 */}
        <div className="flex flex-row items-center justify-center gap-6">
          {firstRow.map((college) => (
            <CollegeCard
              key={college.code}
              college={college}
              departments={departmentsMap[college.code] || []}
              onClick={() => handleCollegeClick(college)}
            />
          ))}
        </div>

        {/* 두 번째 행 */}
        {secondRow.length > 0 && (
          <div className="flex flex-row items-center justify-center gap-6">
            {secondRow.map((college) => (
              <CollegeCard
                key={college.code}
                college={college}
                departments={departmentsMap[college.code] || []}
                onClick={() => handleCollegeClick(college)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CollegeCardProps {
  college: College;
  departments: Department[];
  onClick: () => void;
}

function CollegeCard({ college, departments, onClick }: CollegeCardProps) {
  return (
    <Card
      className="overflow-hidden w-50 h-80 p-6 hover:scale-105 transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-xl border border-gray-200"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {/* 단과대명 */}
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{college.title}</h3>

        {/* 학과 목록 - 스크롤 가능 */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <div
                key={dept.code}
                className="text-sm text-gray-600 p-2 bg-gray-50 rounded-md hover:bg-secondary transition-colors"
              >
                {dept.title}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 text-center py-8">학과 정보가 없습니다</div>
          )}
        </div>
      </div>
    </Card>
  );
}
