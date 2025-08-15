'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SummaryData } from '@/types/summary/summaryData';
import { getSummaryData } from './api/summary';
import Link from 'next/link';

export default function Summary() {
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const res = await getSummaryData();
        setSummaryData(res);
        console.log(summaryData);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <Image
        src="/images/summary/summary.png"
        alt="summary"
        width={2000}
        height={2000}
        className="w-full h-auto object-cover"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-7 divide-x divide-gray-300 rounded-2xl border border-gray-300">
          {summaryData.map((summary, index) => (
            <div key={index} className="flex flex-col px-4">
              {/* 분과명 헤더 */}
              <h3
                className="font-medium text-lg text-black mb-4 text-center font-taebaek mt-5"
                style={{ fontFamily: 'TAEBAEK, Arial, sans-serif' }}
              >
                {summary.division}
              </h3>

              {/* 동아리 목록 */}
              <div>
                {summary.clubs.map((club, clubIndex) => (
                  <Link href={`/clubInfo?clubId=${club.clubId}`} key={club.clubId}>
                    <div
                      key={club.clubId}
                      className={`text-sm text-black text-center pb-2 hover:text-primary transition-colors ${
                        clubIndex === summary.clubs.length - 1 ? 'mb-3' : ''
                      }`}
                    >
                      {club.clubName}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
