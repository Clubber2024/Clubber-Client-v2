'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClubCard from '@/components/features/club/ClubCard';
import { ClubCardRes } from '@/types/club/clubCardData';
import { searchClub } from '@/components/features/search/api/searchClub';
import { CircleAlert } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const [clubs, setClubs] = useState<ClubCardRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const clubName = searchParams.get('clubName');
    const hashtag = searchParams.get('hashtag');
    const division = searchParams.get('division');
    const department = searchParams.get('department');

    if (clubName || hashtag || division || department) {
      setSearchTerm(clubName || hashtag || division || department || '');
      performSearch({ clubName, hashtag, division, department });
    }
  }, [searchParams]);

  const performSearch = async (params: {
    clubName?: string | null;
    hashtag?: string | null;
    division?: string | null;
    department?: string | null;
  }) => {
    setLoading(true);
    try {
      const searchData = {
        ...(params.clubName && { clubName: params.clubName }),
        ...(params.hashtag && { hashtag: params.hashtag }),
        ...(params.division && { division: params.division }),
        ...(params.department && { department: params.department }),
      };

      const result = await searchClub(searchData);
      // searchClub -> 동아리 목록 배열로 반환
      setClubs(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : clubs.length > 0 ? (
          <div
            className={`${
              clubs.length <= 4
                ? 'flex flex-wrap justify-center gap-6'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            }`}
          >
            {clubs.map((club) => (
              <ClubCard key={club.clubId} club={club} />
            ))}
          </div>
        ) : (
          searchTerm && (
            <div className="flex flex-col items-center justify-center py-10">
              {/* 메인 텍스트 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                &apos;<span className="text-primary">{searchTerm}</span>&apos;에 대한
                검색결과입니다.
              </h2>

              <CircleAlert strokeWidth={1.5} size={50} color="#202123" className="mb-4" />

              {/* 부제목 */}
              <p className="text-gray-600 mb-6 font-semibold text-md">
                &apos;<span className="text-primary">{searchTerm}</span>&apos;에 대한 검색결과가
                없습니다.
              </p>

              {/* 안내 메시지 */}
              <div className="text-gray-500 text-sm space-y-1">
                <p>• 단어의 철자가 정확한지 확인해 주세요.</p>
                <p>• 검색 단어 수를 줄이거나, 다른 검색어로 검색해 보세요.</p>
                <p>• 보다 일반적인 검색어로 다시 검색해 보세요.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">페이지 로딩 중...</p>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
