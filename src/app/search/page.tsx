'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClubCardRes } from '@/types/club/clubCardData';
import { searchClub } from '@/components/features/search/api/searchClub';
import { CircleAlert } from 'lucide-react';
import ClubCard from '@/components/features/club/ClubCard';

interface ClubTypes {
  clubs: {
    중앙동아리: ClubCardRes[];
    소모임: ClubCardRes[];
    공식단체: ClubCardRes[];
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [clubData, setClubData] = useState<ClubTypes | null>(null);
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
      // searchClub -> 동아리 목록 객체로 반환
      setClubData(result);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setClubData(null);
    } finally {
      setLoading(false);
    }
  };

  const hasResults =
    clubData &&
    (clubData.clubs.중앙동아리.length > 0 ||
      clubData.clubs.소모임.length > 0 ||
      clubData.clubs.공식단체.length > 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : hasResults ? (
          <div className="space-y-8">
            {/* 검색 결과 헤더 */}
            <div className="text-left mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                &apos;<span className="text-primary">{searchTerm}</span>&apos; 검색 결과
              </h1>
              <p className="text-gray-600">
                총{' '}
                {clubData.clubs.중앙동아리.length +
                  clubData.clubs.소모임.length +
                  clubData.clubs.공식단체.length}
                개의 동아리를 찾았습니다.
              </p>
            </div>

            {/* 중앙동아리 */}
            {clubData.clubs.중앙동아리.length > 0 && (
              <div>
                <h2 className="text-md font-semibold text-gray-900 mb-4 w-fit px-5 py-1.5 rounded-full bg-primary/30">
                  중앙동아리
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {clubData.clubs.중앙동아리.map((club) => (
                    <ClubCard key={club.clubId} club={club} />
                  ))}
                </div>
              </div>
            )}

            {/* 소모임 */}
            {clubData.clubs.소모임.length > 0 && (
              <div>
                <h2 className="text-md font-semibold text-gray-900 mb-4 w-fit px-5 py-1.5 rounded-full bg-primary/30">
                  소모임
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {clubData.clubs.소모임.map((club) => (
                    <ClubCard key={club.clubId} club={club} />
                  ))}
                </div>
              </div>
            )}

            {/* 공식단체 */}
            {clubData.clubs.공식단체.length > 0 && (
              <div>
                <h2 className="text-md font-semibold text-gray-900 mb-4 w-fit px-5 py-1.5 rounded-full bg-primary/30">
                  공식단체
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {clubData.clubs.공식단체.map((club) => (
                    <ClubCard key={club.clubId} club={club} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          searchTerm && (
            <div className="flex flex-col items-center justify-center py-10">
              {/* 메인 텍스트 */}
              <h2 className="text-[22px] md:text-2xl font-bold text-gray-900 mb-4">
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
