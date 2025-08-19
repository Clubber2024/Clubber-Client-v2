'use client';

import Container from '@/components/ui/container';
import Divider from '@/components/ui/divider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getRecruitData } from './api/recruit';
import RecruitStatusLabel from '@/components/ui/recruit-status-label';
import { getAccessToken, getIsAdmin } from '@/auth/AuthService';
import { addFavorite, deleteFavorite, getFavoriteStatus } from '@/components/features/bookmark/api/bookmark';
import { apiClient } from '@/lib/apiClient';
import Modal from '@/app/modal/Modal';

export interface RecruitContentProps {
  clubId: number;
  clubImage: string;
  clubName: string;
  clubType: string;
  recruitId: number;
  title: string;
  recruitType: string;
  startAt: Array<number> | null;
  endAt: Array<number> | null;
  content: string;
  applyLink: string;
  imageUrls: string[];
  isCalendarLinked: boolean;
  totalView: number;
  createdAt: string;
  recruitStatus: string;
}

interface ClubInfo {
  clubId: number;
  clubName: string;
  clubType: string;
  division: string;
  college: string;
  department: string;
  imageUrl: string;
}

interface RecruitContentComponentProps {
  recruitId?: number;
}

export default function RecruitContent({ recruitId }: RecruitContentComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [content, setContent] = useState<RecruitContentProps>();
  const [club, setClub] = useState<ClubInfo>();
  const [isStarred, setIsStarred] = useState(false);
  const [isAdmin, setIsAdminState] = useState(false);
  const [isCenter, setIsCenter] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // const [formattedStartAt, setFormattedStartAt] = useState<string | null>(null);
  // const [formattedEndAt, setFormattedEndAt] = useState<string | null>(null);

  const fetchData = async () => {
    if (recruitId) {
      const res = await getRecruitData(recruitId);
      console.log(res);
      setContent(res);
      
      // 동아리 정보 가져오기
      if (res.clubId) {
        // await fetchClubInfo(res.clubId);
        await checkFavoriteStatus(res.clubId);
      }
    } else{
      console.log("recruitId is null");
    }
  };

  // const fetchClubInfo = async (clubId: number) => {
  //   try {
  //     const response = await apiClient.get(`/v1/clubs/${clubId}`);
  //     if (response.data.success) {
  //       const clubData = response.data.data;
  //       setClub(clubData);
  //       setIsCenter(clubData.clubType !== '해당 없음');
  //     }
  //   } catch (error) {
  //     console.error('동아리 정보 가져오기 실패:', error);
  //   }
  // };

  const checkFavoriteStatus = async (clubId: number) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) return;
      
      const response = await getFavoriteStatus(clubId);
      setIsStarred(response.isFavorite);
    } catch (error) {
      console.error('즐겨찾기 상태 확인 실패:', error);
    }
  };

  const handleStarClick = async () => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setIsOpenLoginModal(true);
        setModalMessage('로그인 후 이용해주세요.');
        return;
      }

      if (!club?.clubId) return;

      if (isStarred) {
        // 즐겨찾기 삭제
        await deleteFavorite(club.clubId, 0); // favoriteId는 실제로는 API에서 받아와야 함
        setIsStarred(false);
      } else {
        // 즐겨찾기 추가
        await addFavorite(club.clubId);
        setIsStarred(true);
      }
    } catch (error) {
      console.error('즐겨찾기 처리 실패:', error);
    }
  };

  useEffect(() => {
    const adminStatus = getIsAdmin();
    setIsAdminState(adminStatus);
    fetchData();
    console.log(recruitId);
    console.log(content);
  }, [recruitId]);

  function formatDateArray(arr: number[]): string {
    const [year, month, day, hour, minute] = arr;

    // 월, 일, 시, 분을 2자리로 맞추기 위해 padStart 사용
    const MM = String(month).padStart(2, '0');
    const DD = String(day).padStart(2, '0');
    const HH = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');

    return `${year}-${MM}-${DD} ${HH}:${mm}`;
  }

  const ImageSlider = ({ imageUrls }: { imageUrls: string[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0; // 처음 위치로 강제 이동
      }
    }, [imageUrls]);
  };

  return (
    <>
    <div className='flex justify-center mb-[-50px]'>
     <Card className="mt-[60px] w-[100%] sm:w-[80%] ">
          <div className="flex flex-row items-center pl-5">
            <img 
              src={content?.clubImage || 'https://image.ssuclubber.com/common/logo/soongsil_default.png'} 
              className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]"
              onError={(e) => {
                e.currentTarget.src = 'https://image.ssuclubber.com/common/logo/soongsil_default.png';
              }}
            />
          
            <div className='ml-3'>
              <div className='flex flex-row items-center'>
                <p className="mb-2 font-bold text-[20px]">{content?.clubName}</p>
                
                {!isAdmin && (
                  isStarred ? (
                    <Star 
                      className='w-5 h-5 ml-2 mb-2 cursor-pointer text-yellow-500 fill-yellow-500' 
                      onClick={handleStarClick}
                    />
                  ) : (
                    <Star 
                      className='w-5 h-5 ml-2 mb-2 cursor-pointer text-yellow-500' 
                      onClick={handleStarClick}
                    />
                  )
                )}
              </div>
             <Button className='h-[30px]'>
              {content?.clubType}
             </Button>
              
            </div>
          </div>
        </Card></div>
        <Container>
        <Divider className="shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-black mt-[46px]" />
        {content ? (
          <div className="flex flex-col justify-center items-center mt-[30px]">
            <RecruitStatusLabel status={content.recruitStatus} />
            <p className="font-semibold text-[24px] leading-[100%] tracking-[0%] font-pretendard mt-[13px] mb-[14px]">
              {content.title}
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-[0%] font-pretendard text-[#a7a7a7] mb-[34px]">
              {content.createdAt} | 조회수 {content.totalView}
            </p>
            <Divider className="w-full" />
            <div className="flex flex-row justify-between w-full mt-2.5 mb-2.5">
              <div className="flex flex-row justify-start sm:justify-center items-start gap-2">
                <span className="font-semibold text-[16px] leading-[150%] tracking-[0%] font-pretendard">
                  • 모집기간{' '}
                </span>
                <span className="font-normal text-[16px] leading-[150%] tracking-[0%] font-pretendard">
                  {content.startAt ? formatDateArray(content.startAt) : content.createdAt} ~ <br />
                  {content.endAt ? formatDateArray(content.endAt) : ''}
                </span>
              </div>
              <div className="flex flex-row justify-center items-start gap-2 ">
                <span className="font-semibold text-[16px] leading-[100%] tracking-[0%] font-pretendard">
                  • 모집유형{' '}
                </span>
                <span className="font-normal text-[16px] leading-[100%] tracking-[0%] font-pretendard">
                  {content.recruitType}
                </span>
              </div>
            </div>
            <Divider className="w-full" />
            <div className="flex flex-row justify-start items-start gap-2 w-full mt-2.5 mb-2.5 ">
              <span className="font-semibold text-[16px] leading-[100%] tracking-[0%] font-pretendard">
                • 지원링크{' '}
              </span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={content.applyLink}
                className="font-normal text-[16px] leading-[100%] tracking-[0%] font-pretendard"
              >
                {content.applyLink}
              </a>
            </div>
            <Divider className="w-full" />

            <div ref={containerRef} className="w-[90%] overflow-x-auto">
              <div className="flex mt-10 gap-4 justify-center min-w-fit px-[5%]">
                {content.imageUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`image-${index}`}
                    className="h-auto max-w-[300px] sm:max-w-[500px] object-contain flex-shrink-0"
                  />
                ))}
              </div>
            </div>
            <div className="mt-10 mb-25">
              <p className="font-normal text-[16px] leading-[100%] tracking-[0%] font-pretendard text-center">
                {content.content}
              </p>
            </div>
          </div>
        ) : (
          ''
        )}
      </Container>
      {isOpenLoginModal&&(<Modal isOpen={isOpenLoginModal} message={modalMessage} confirmText='로그인 하러가기' cancelText='취소' onConfirm={() => router.push('/login')} onCancel={() => setIsOpenLoginModal(false)} showConfirmButton={true}/>)}
    </>
  );
}
