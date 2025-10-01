'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarIcon, Star, ChevronRightIcon } from 'lucide-react';
import { getClubInfomation } from '@/components/features/club/api/clubCard';
import { addFavorite, deleteFavorite, getFavorites } from '../bookmark/api/bookmark';
import { FavoriteItem } from '@/types/bookmark/bookmarkData';
import Modal from '@/app/modal/Modal';
import Image from 'next/image';
import ClubReview from './review/ClubReview';

export type Club = {
  instagram: string | null;
  youtube: string | null;
  leader: string | null;
  room: string | null;
  totalView: number;
  activity: string | null;
};

export interface ClubProps {
  clubId: number | undefined;
  clubName: string;
  clubType: string;
  introduction: string | null;
  hashTag: string;
  division: string;
  college: string;
  department: string;
  imageUrl: string;
  clubInfo: Club;
}

interface ClubInfoProps {
  clubId?: string;
}

export default function ClubInfo({ clubId }: ClubInfoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [club, setClub] = useState<ClubProps | null>(null);
  const [clubInfo, setClubInfo] = useState<Club | null>(null);
  // const [clubId, setClubId] = useState<number | null>(null);
  const [isCenter, setIsCenter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'intro' | 'review'>('intro');

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('accessToken');
    const adminStatus = localStorage.getItem('isAdmin');
    setAccessToken(token);
    setIsAdmin(adminStatus === 'true');

    // URL 파라미터에서 tab 정보 읽기
    const tab = searchParams.get('tab');
    if (tab === 'review') {
      setActiveTab('review');
    }
  }, [searchParams]);

  useEffect(() => {
    // const clubId = searchParams.get('clubId');
    if (clubId) {
      fetchClubInfoData(parseInt(clubId));
      if (accessToken && !isAdmin) {
        fetchFavoriteStatus(parseInt(clubId));
      }
    } else {
      setError('동아리 ID가 필요합니다.');
      setIsLoading(false);
    }
  }, [searchParams, accessToken, isAdmin, clubId]);

  const fetchClubInfoData = async (clubId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await getClubInfomation(clubId);

      if (!res) {
        throw new Error('동아리 정보를 찾을 수 없습니다.');
      }

      setClub(res);
      setClubInfo(res.clubInfo);

      // Determine if it's a center club or college club
      if (res.clubType === '해당 없음') {
        setIsCenter(false);
      } else {
        setIsCenter(true);
      }
    } catch (error) {
      setError('동아리 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching club info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavoriteStatus = async (clubId: number) => {
    if (isAdmin) return;
    if (!accessToken) return;

    try {
      const res = await getFavorites();

      // The response structure is: { userId: number, userFavorites: FavoriteItem[] }
      if (!res.userFavorites) {
        setIsStarred(false);
        setFavoriteId(null);
        return;
      }

      const userFavorites = res.userFavorites;
      const clubIds = userFavorites.map((item: FavoriteItem) => item.favoriteClub.clubId);
      const isFavoriteClub = clubIds.includes(clubId);
      const favorite = userFavorites.find(
        (item: FavoriteItem) => item.favoriteClub.clubId === clubId
      );

      setIsStarred(isFavoriteClub);
      if (favorite) {
        setFavoriteId(favorite.favoriteId);
      } else {
        setFavoriteId(null);
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
      setIsStarred(false);
      setFavoriteId(null);
    }
  };

  const handleStarClick = async () => {
    if (!accessToken) {
      // Redirect to login if not authenticated
      setIsOpenLoginModal(true);
      setModalMessage('로그인 후 이용해주세요.');
      return;
    }
    if (!clubId) return;

    try {
      if (isStarred) {
        if (favoriteId) {
          await deleteFavorite(parseInt(clubId), favoriteId);
        }
        setIsStarred(false);
        setFavoriteId(null);
        setModalMessage('즐겨찾기에서 제거되었습니다.');
        setIsOpenModal(true);
      } else {
        await addFavorite(parseInt(clubId));
        setIsStarred(true);
        // Refresh favorite status to get the new favoriteId
        await fetchFavoriteStatus(parseInt(clubId));
        setModalMessage('즐겨찾기에 추가되었습니다.');
        setIsOpenModal(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">동아리 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            onClick={() => router.back()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">동아리 정보를 찾을 수 없습니다.</p>
          <Button
            onClick={() => router.back()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  const onClickGoToRecruit = () => {
    if (clubId) {
      router.push(`/recruitList?clubId=${clubId}`);
    } else {
      return;
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto flex flex-col">
        <Card className="mx-4 sm:mx-10 mt-12 mb-10">
          <div className="flex flex-row items-center px-5">
            <Image
              src={
                club?.imageUrl || 'https://image.ssuclubber.com/common/logo/soongsil_default.png'
              }
              className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] rounded-full mx-0 md:mx-4"
              onError={(e) => {
                e.currentTarget.src =
                  'https://image.ssuclubber.com/common/logo/soongsil_default.png';
              }}
              alt="club-image"
              width={100}
              height={100}
            />

            <div className="ml-3">
              <div className="flex flex-row items-center mb-2 sm:mb-0">
                <p className="mb-2 text-sm md:text-md font-bold text-[20px] leading-[100%] tracking-[0] w-fit">
                  {club?.clubName}
                </p>
                {!isAdmin &&
                  (isStarred ? (
                    <Star
                      className="size-5.5 ml-2 mb-2 cursor-pointer text-yellow-500 fill-yellow-500 hover:scale-110 transition-all duration-200 ease-in-out"
                      onClick={handleStarClick}
                    />
                  ) : (
                    <StarIcon
                      className="size-5.5 ml-2 mb-2 cursor-pointer text-yellow-500 hover:scale-110 hover:fill-yellow-500  transition-all duration-200 ease-in-out"
                      onClick={handleStarClick}
                    />
                  ))}
              </div>

              {isCenter ? (
                <Button className="mr-2 rounded-[3px] h-8 hover:bg-primary text-sm md:text-md">
                  {club?.clubType} | {club?.division}
                </Button>
              ) : (
                <Button className="mr-2 rounded-[3px] h-8 hover:bg-primary text-sm md:text-md">
                  {club?.college} | {club?.department}
                </Button>
              )}
              <Button
                className="mt-2 sm:mt-0 rounded-[3px] h-8 cursor-pointer text-sm md:text-md"
                onClick={onClickGoToRecruit}
              >
                모집글 보러가기 <ChevronRightIcon className="size-4.5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* 탭 네비게이션 */}
        <div className="mx-10 relative">
          <div className="absolute -top-6 md:-top-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex w-64 md:w-180 bg-[#c6e0f1] rounded-full shadow-sm">
              <button
                onClick={() => setActiveTab('intro')}
                className={`flex-1 pl-6 pr-4 rounded-none font-medium transition-all duration-200 `}
              >
                <p
                  className={`font-medium transition-all duration-200 text-center pt-3 pb-2.5 text-sm md:text-[17px] ${
                    activeTab === 'intro'
                      ? 'font-bold border-b-3 border-primary md:w-60 mx-auto'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  소개
                </p>
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`flex-1 pr-6 pl-4 rounded-none font-medium transition-all duration-200 `}
              >
                <p
                  className={`font-medium transition-all duration-200 text-center pt-3 pb-2.5 text-sm md:text-[17px] ${
                    activeTab === 'review'
                      ? 'font-bold border-b-3 border-primary md:w-60 mx-auto'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  리뷰
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'intro' ? (
          <Card className="mx-4 md:mx-10">
            <div className="px-7 md:px-20 my-10">
              <div>
                <p className=" font-semibold text-[18px] leading-[18px] tracking-[0] mb-2.5">
                  소속분과
                </p>
                {isCenter ? (
                  <p className=" font-normal text-[16px] leading-[18px] tracking-[0] ">
                    • {club?.clubType} | {club?.division}
                  </p>
                ) : (
                  <p className=" font-normal text-[16px] leading-[18px] tracking-[0]">
                    • {club?.college} | {club?.department}
                  </p>
                )}
              </div>

              <div className="mt-[30px]">
                <p className=" font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                  소개
                </p>
                <div className="flex flex-row">
                  •
                  <p className="ml-1  font-normal text-[16px] leading-[22px] tracking-[0] whitespace-pre-line ">
                    {club?.introduction || ''}
                  </p>
                </div>
              </div>

              <div className="mt-[30px]">
                <p className=" font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                  인스타/유튜브
                </p>
                <div className="space-y-1">
                  {clubInfo?.instagram && (
                    <a
                      href={clubInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline break-all"
                    >
                      • {clubInfo.instagram}
                    </a>
                  )}
                  {clubInfo?.youtube && (
                    <a
                      href={clubInfo.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline break-all"
                    >
                      • {clubInfo.youtube}
                    </a>
                  )}
                  {!clubInfo?.youtube && !clubInfo?.instagram && (
                    <p className="ml-1 font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                      •
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-[30px]">
                <p className="font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                  대표 활동
                </p>
                <p className="   font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                  • {clubInfo?.activity || ''}
                </p>
              </div>

              <div className="mt-[30px]">
                <p className="font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                  동아리장
                </p>
                <p className=" font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                  • {clubInfo?.leader || ''}
                </p>
              </div>

              <div className="mt-[30px]">
                <p className="font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                  동아리실
                </p>
                <p className=" font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                  • {clubInfo?.room || ''}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          clubId && !isNaN(parseInt(clubId)) && <ClubReview clubId={parseInt(clubId)} />
        )}
      </div>
      {isOpenModal && (
        <Modal isOpen={isOpenModal} message={modalMessage} onClose={() => setIsOpenModal(false)} />
      )}
      {isOpenLoginModal && (
        <Modal
          isOpen={isOpenLoginModal}
          message={modalMessage}
          confirmText="로그인 하러가기"
          cancelText="취소"
          onConfirm={() => router.push('/login')}
          onCancel={() => setIsOpenLoginModal(false)}
          showConfirmButton={true}
        />
      )}
    </>
  );
}
