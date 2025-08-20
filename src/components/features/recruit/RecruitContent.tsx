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
import Modal from '@/app/modal/Modal';
import Image from 'next/image';

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
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isImgModalOpen) {
        if (event.key === 'Escape') {
          closeImageModal();
        } else if (event.key === 'ArrowLeft') {
          prevImage();
        } else if (event.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    if (isImgModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImgModalOpen, currentImageIndex, content?.imageUrls]);

  function formatDateArray(arr: number[]): string {
    const [year, month, day, hour, minute] = arr;

    // 월, 일, 시, 분을 2자리로 맞추기 위해 padStart 사용
    const MM = String(month).padStart(2, '0');
    const DD = String(day).padStart(2, '0');
    const HH = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');

    return `${year}-${MM}-${DD} ${HH}:${mm}`;
  }

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImgModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImgModalOpen(false);
  };

  const prevImage = () => {
    if (content?.imageUrls && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (content?.imageUrls && currentImageIndex < content.imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const ImageSlider = ({ imageUrls }: { imageUrls: string[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0; // 처음 위치로 강제 이동
      }
    }, [imageUrls]);
  };

  return (
    <div className='w-full md:w-[70%] mx-auto'>
    <div className='flex justify-center mb-[-50px]'>
     <Card className="mt-[60px] w-[100%]">
          <div className="flex flex-row items-center px-5">
             <Image
              src={content?.clubImage || 'https://image.ssuclubber.com/common/logo/soongsil_default.png'} 
              className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]"
              onError={(e) => {
                e.currentTarget.src = 'https://image.ssuclubber.com/common/logo/soongsil_default.png';
              }}
              alt='club-image'
              width={100}
              height={100}
            />
          
            <div className='ml-3'>
              <div className='flex flex-row items-center mb-2 sm:mb-0'>
                <p className="mb-2 font-bold text-[20px] leading-[100%] tracking-[0]">{content?.clubName}</p>
                
                {!isAdmin && (
                  isStarred ? (
                    <Star 
                      className='size-5.5 ml-2 mb-2 cursor-pointer text-yellow-500 fill-yellow-500 hover:scale-110 hover:fill-yellow-500  transition-all duration-200 ease-in-out' 
                      onClick={handleStarClick}
                    />
                  ) : (
                    <Star 
                      className='size-5.5 ml-2 mb-2 cursor-pointer text-yellow-500 hover:scale-110 hover:fill-yellow-500  transition-all duration-200 ease-in-out' 
                      onClick={handleStarClick}
                    />
                  )
                )}
              </div>
             <Button className='h-8 rounded-[3px] hover:bg-primary'>
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
            <p className="font-semibold text-[24px] leading-[100%] tracking-[0%] mt-[13px] mb-[14px]">
              {content.title}
            </p>
            <p className="text-[14px] leading-[100%] tracking-[0%] text-[#a7a7a7] mb-[34px]">
              {content.createdAt} | 조회수 {content.totalView}
            </p>
            <div className='w-full px-5 md:px-7 lg:px-10'>
            <Divider className="w-full" />
            <div className="flex flex-col sm:flex-row justify-between w-full mt-2.5 mb-2.5">
              <div className="flex flex-row justify-start sm:justify-center items-start gap-2">
                <span className="font-semibold text-[16px] leading-[150%] tracking-[0%]">
                  • 모집기간{' '}
                </span>
                <span className="font-normal text-[16px] leading-[150%] tracking-[0%] font-pretendard">
                  {content.startAt ? formatDateArray(content.startAt) : content.createdAt} ~ <br />
                  {content.endAt ? formatDateArray(content.endAt) : ''}
                </span>
              </div>
              <div className="flex flex-row justify-start sm:justify-center items-start gap-2 ">
                <span className="font-semibold text-[16px] leading-[150%] tracking-[0%]">
                  • 모집유형{' '}
                </span>
                <span className="font-normal text-[16px] leading-[150%] tracking-[0%]">
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
                className="text-[16px] leading-[100%] tracking-[0%] text-blue-800 hover:underline"
              >
                {content.applyLink}
              </a>
            </div>

           
            <Divider className="w-full" />
            <div className="mt-10 mb-25">
              <p className="font-normal text-[16px] leading-[100%] tracking-[0%] font-pretendard text-center">
                {content.content}
              </p>
            </div>

            <div ref={containerRef} className="w-full">
              {/* 모바일: 가로 스크롤 */}
              <div className="lg:hidden overflow-x-auto mb-10">
                <div className="flex gap-2 min-w-fit">
                  {content.imageUrls.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`image-${index}`}
                      className="w-[100px] h-[100px] object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openImageModal(index)}
                    />
                  ))}
                </div>
              </div>
              
              {/* 데스크톱: 4개씩 그리드 */}
              <div className="hidden lg:flex justify-center mb-10">
                <div className="grid grid-cols-4 gap-4 justify-center items-center">
                  {content.imageUrls.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`image-${index}`}
                      className="w-[150px] md:w-[190px] h-[150px] md:h-[190px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openImageModal(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </Container>
      
      {/* 이미지 확대 모달 */}
      {isImgModalOpen && content?.imageUrls && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10"
              onClick={closeImageModal}
            >
              &times;
            </button>
            
            {/* 이미지 */}
            <img
              src={content.imageUrls[currentImageIndex]}
              alt={`Large image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* 이전 버튼 */}
            {currentImageIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl font-bold hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                onClick={prevImage}
              >
                &#10094;
              </button>
            )}
            
            {/* 다음 버튼 */}
            {currentImageIndex < content.imageUrls.length - 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl font-bold hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                onClick={nextImage}
              >
                &#10095;
              </button>
            )}
            
            {/* 이미지 카운터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
              {currentImageIndex + 1} / {content.imageUrls.length}
            </div>
          </div>
        </div>
      )}
      
      {isOpenLoginModal&&(<Modal isOpen={isOpenLoginModal} message={modalMessage} confirmText='로그인 하러가기' cancelText='취소' onConfirm={() => router.push('/login')} onCancel={() => setIsOpenLoginModal(false)} showConfirmButton={true}/>)}
      </div>
  );
}
