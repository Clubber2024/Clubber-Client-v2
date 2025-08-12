'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFavorites, deleteFavorite, getFavoritePage } from './api/bookmark';
import { FavoriteClub } from '@/types/bookmark/bookmarkData';
import Modal from '@/app/modal/Modal';
import { Card } from '@/components/ui/card';
import { ChevronDown, CircleChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Bookmark() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<FavoriteClub[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchFavorites = async () => {
    try {
      const data = await getFavoritePage(page);
      
      // 이전 동아리 값과 중복 제거 후 상태 저장
      setClubs((prevData) => {
        const mergedData = [...prevData, ...data.content];
        return mergedData.filter(
          (club, index, self) => index === self.findIndex((c) => c.clubId === club.clubId)
        );
      });

      setHasNextPage(data.hasNextPage);
    } catch (error) {
      setError('즐겨찾기를 불러오는데 실패했습니다.');
      console.error('Favorite fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const loadMoreBookmarks = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onClickStar = (clubId: number, favoriteId: number) => {
    setModalMessage("즐겨찾기를 해제하시겠습니까?");
    setSelectedClubId(clubId);
    setSelectedFavoriteId(favoriteId);
    setIsModalOpen(true);
  };

  const handleFavorite = async () => {
    if (!selectedClubId || !selectedFavoriteId) return;
    
    // Optimistic Update: 먼저 UI에서 제거
    setClubs((prevClubs) => prevClubs.filter((club) => club.clubId !== selectedClubId));
    
    // 모달 닫기
    setIsModalOpen(false);
    setModalMessage("");
    
    try {
      // 그 다음에 API 호출
      await deleteFavorite(selectedClubId, selectedFavoriteId);
    } catch (error) {
      console.error('Favorite delete error:', error);
      setError('즐겨찾기 해제에 실패했습니다.');
      
      // API 호출 실패 시 다시 추가 (rollback)
      const originalClub = clubs.find(club => club.clubId === selectedClubId);
      if (originalClub) {
        setClubs((prevClubs) => [...prevClubs, originalClub]);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="mb-[200px] md:mb-[200px] mb-[100px]">
      <div className="mt-20 my-10 mx-auto w-[200px] h-10 text-center md:text-2xl md:font-bold md:leading-[34.75px] text-xl font-medium leading-[34.75px]">
        나의 즐겨찾기
      </div>

      {clubs.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          즐겨찾기한 동아리가 없습니다.
        </div>
      ) : (
        <>
          {clubs.map((club) => (
            <Card key={club.clubId} className="flex w-[300px] md:w-[528px] h-[100px] md:h-[123px] rounded-[15px] bg-white shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] mx-auto mb-5 md:mb-[30px] relative p-[10px]">
              <div className='flex flex-row'>
              <div className="flex-shrink-0 w-fit h-fit">
                <Image 
                  src={club.imageUrl || '/images/coming-soon.png'} 
                  alt={club.clubName}
                  width={100}
                  height={103}
                  className="w-[80px] h-[80px] md:w-[100px] md:h-[103px] rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center flex-1 ml-4">
               
                  <div className="font-medium text-lg md:text-xl text-gray-900 mb-1">
                    {club.clubName}
                  </div>
                  <div className='flex flex-row items-center'>
                  <div className="text-sm md:text-base text-gray-600">
                    {club.clubType}
                  </div>
                  <button 
                    onClick={() => onClickStar(club.clubId, club.favoriteId)}
                    className="bg-none border-none cursor-pointer p-0 flex "
                  >
                      <Image 
                        src="/images/star-yellow.svg" 
                        alt="즐겨찾기"
                        width={18}
                        height={18}
                        className='ml-1'
                      />
                  </button>
                  </div>
              </div>
              <div className="flex items-center">
              <CircleChevronRight
              onClick={()=>router.push(`/clubInfo?clubId=${club.clubId}`)}
              className='text-white bg-[#c7c7c7] rounded-full w-fit h-fit cursor-pointer' />
              </div>
              </div>
            </Card>
          ))}

          {hasNextPage && (
            <div className="text-center mt-10">
              <Button
                onClick={loadMoreBookmarks} 
                variant="outline"
                className='bg-[#F0F0F080] text-[#52555be5] font-semibold w-[220px] h-[42px] rounded-[5px]'

              >
               더보기
               <ChevronDown className='text-[#52555be5] ml-[-3px]'/>
              </Button>
            </div>
          )}
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        message={modalMessage} 
        onClose={closeModal} 
        onConfirm={handleFavorite}
        showConfirmButton={true}
      />
    </div>
  );
}