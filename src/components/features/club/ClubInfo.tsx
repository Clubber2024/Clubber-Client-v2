'use client';

import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarIcon, Star } from 'lucide-react';
import { getClubInfomation } from '@/components/features/club/api/clubCard';
import { getFavoriteStatus, addFavorite, deleteFavorite, getFavorites } from '../bookmark/api/bookmark';
import { FavoriteItem } from '@/types/bookmark/bookmarkData';
import Modal from '@/app/modal/Modal';

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

export default function ClubInfo({clubId}:ClubInfoProps) {
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
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('accessToken');
    const adminStatus = localStorage.getItem('isAdmin');
    setAccessToken(token);
    setIsAdmin(adminStatus === 'true');
  }, []);

  useEffect(() => {
    // const clubId = searchParams.get('clubId');
    if (clubId) {
      fetchClubInfoData(parseInt(clubId));
      console.log("clubId", clubId);
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
      console.error('Error fetching club info:', error);
      setError('동아리 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavoriteStatus = async (clubId: number) => {
    if (isAdmin) return;
    if (!accessToken) return;
    
    try {
      const res = await getFavorites();
      console.log("res", res);
      
      // The response structure is: { userId: number, userFavorites: FavoriteItem[] }
      if (!res.userFavorites) {
        console.error('No userFavorites in response:', res);
        setIsStarred(false);
        setFavoriteId(null);
        return;
      }
      
      const userFavorites = res.userFavorites;
      const clubIds = userFavorites.map((item: FavoriteItem) => item.favoriteClub.clubId);
      const isFavoriteClub = clubIds.includes(clubId);
      const favorite = userFavorites.find((item: FavoriteItem) => item.favoriteClub.clubId === clubId);
      
      
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
      router.push('/login');
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
          <Button onClick={() => router.back()} className="bg-primary hover:bg-primary/90 text-white">
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
          <Button onClick={() => router.back()} className="bg-primary hover:bg-primary/90 text-white">
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  const onClickGoToRecruit = () =>{
if(clubId){
  router.push(`/recruitList?clubId=${clubId}`);
} else{
  return;
}
}

  return (
    <>
   

      <div className="ml-0 sm:ml-[10%] mr-0 sm:mr-[10%] mt-5 flex flex-col">
        <Card className="mt-[60px] mb-9">
          <div className="flex flex-row items-center pl-5 pr-5">
            <img 
              src={club?.imageUrl || 'https://image.ssuclubber.com/common/logo/soongsil_default.png'} 
              className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]"
              onError={(e) => {
                e.currentTarget.src = 'https://image.ssuclubber.com/common/logo/soongsil_default.png';
              }}
            />
          
            <div className='ml-3'>
              <div className='flex flex-row items-center mb-2 sm:mb-0'>
                <p className="mb-2 font-bold text-[18px] w-fit">{club?.clubName}
                </p>
                {!isAdmin && (
                  isStarred ? (
                    <Star 
                      className='w-5 h-5 sm:w-6 sm:h-6 ml-2 mb-2 cursor-pointer text-yellow-500 fill-yellow-500' 
                      onClick={handleStarClick}
                    />
                  ) : (
                    <StarIcon 
                      className='w-5 h-5 sm:w-6 sm:h-6 ml-2 mb-2 cursor-pointer text-yellow-500' 
                      onClick={handleStarClick}
                    />
                  )
                )}
               
              </div>
              
              {isCenter ? (
                <Button className='mr-2 h-[33px] sm:h-[38px]'>
                  {club?.clubType} | {club?.division}
                </Button>
              ) : (
                <Button className='mr-2 h-[33px] sm:h-[38px]'>
                  {club?.college} | {club?.department}
                </Button>
              )}
              <Button className='border-primary text-primary mt-2 sm:mt-0 h-[31px] sm:h-[38px]' variant={'outline'} onClick={onClickGoToRecruit}>모집글 보러가기 {'>'}</Button>
            </div>
            </div>
          
        </Card>
        
        <Card className="rounded-[5px]">
          <div className="pl-4 sm:pl-20 pr-4 sm:pr-20 mt-10 mb-10">
            <div>
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mb-2.5">
                소속분과
              </p>
              {isCenter ? (
                <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] ">
                  • {club?.clubType} | {club?.division}
                </p>
              ) : (
                <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0]">
                  • {club?.college} | {club?.department}
                </p>
              )}
            </div>
            
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                소개
              </p>
              <div className="flex flex-row">
                •
                <p className="ml-1 font-pretendard font-normal text-[16px] leading-[22px] tracking-[0] whitespace-pre-line ">
                  {club?.introduction || ''}
                </p>
              </div>
            </div>
            
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[16px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                인스타/유튜브
              </p>
              <div className="space-y-1">
                {clubInfo?.instagram && (
                  <a 
                    href={clubInfo.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    • {clubInfo.instagram}
                  </a>
                )}
                {clubInfo?.youtube && (
                  <a 
                    href={clubInfo.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    • {clubInfo.youtube}
                  </a>
                )}
               {!clubInfo?.youtube&&!clubInfo?.instagram&&(
                <p className="ml-1 font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">•</p>
               )}
              </div>
            </div>
            
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                대표 활동
              </p>
              <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                • {clubInfo?.activity || ''}
              </p>
            </div>
            
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                동아리장
              </p>
              <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                • {clubInfo?.leader || ''}
              </p>
            </div>
            
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                동아리실
              </p>
              <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                • {clubInfo?.room || ''}
              </p>
            </div>
          </div>
        </Card>
      </div>
      {isOpenModal && (
        <Modal 
          isOpen={isOpenModal} 
          message={modalMessage} 
          onClose={() => setIsOpenModal(false)} 
        />
      )}
    </>
  );
}





