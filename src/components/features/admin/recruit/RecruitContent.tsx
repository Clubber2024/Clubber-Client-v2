'use client';

import Container from '@/components/ui/container';
import Divider from '@/components/ui/divider';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getAdminRecruitContent } from './api/recruit';
import RecruitStatusLabel from '@/components/ui/recruit-status-label';

export interface AdminRecruitContentProps {
  clubId: number;
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

interface RecruitContentProps {
  recruitId?: string;
}
export default function RecruitContent({ recruitId }: RecruitContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<AdminRecruitContentProps>();
  const [formattedStartAt, setFormattedStartAt] = useState<string | null>(null);
  const [formattedEndAt, setFormattedEndAt] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);

  const fetchData = async () => {
    if (recruitId) {
      const res = await getAdminRecruitContent(recruitId);
      console.log(res);
      setContent(res);
    }
  };

  useEffect(() => {
    fetchData();
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
    <div className='w-full lg:w-[70%] sm:mx-auto flex justify-center items-center'>
      <Container>
        <Divider className="shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-black mt-[20px] sm:mt-[46px]" />
        {content ? (
          <div className="flex flex-col justify-center items-center mt-[30px] w-full">
            <RecruitStatusLabel status={content.recruitStatus} />
            <p className="font-semibold text-[24px] leading-[100%] tracking-[0%] font-pretendard mt-[13px] mb-[14px]">
              {content.title}
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-[0%] font-pretendard text-[#a7a7a7] mb-[34px]">
              {content.createdAt} | 조회수 {content.totalView}
            </p>
            <div className='w-full px-4  md:px-7'>
            <Divider className="w-full" />
            <div className="flex flex-col sm:flex-row justify-between w-full mt-2.5 mb-2.5">
              <div className="flex flex-row justify-start sm:justify-center items-start gap-2">
                <span className="font-semibold text-[16px] leading-[150%] tracking-[0%] font-pretendard w-fit">
                  • 모집기간{' '}
                </span>
                <span className="text-[16px] leading-[150%] tracking-[0%]">
                  {content.startAt ? formatDateArray(content.startAt) : content.createdAt} ~ <br />
                  {content.endAt ? formatDateArray(content.endAt) : ''}
                </span>
              </div>
              <div className="flex flex-row justify-start sm:justify-center items-start gap-2 ">
                <span className="font-semibold text-[16px] leading-[150%] tracking-[0%] font-pretendard">
                  • 모집유형{' '}
                </span>
                <span className="font-normal text-[16px] leading-[150%] tracking-[0%] font-pretendard">
                  {content.recruitType}
                </span>
              </div>
            </div>
            <Divider className="w-full" />
            <div className="flex flex-col sm:flex-row justify-start items-start gap-2 w-full mt-2.5 mb-1 sm:my-2.5 ">
              <span className="font-semibold text-[16px] leading-[150%] tracking-[0%]">
                • 지원링크{' '}
              </span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={content.applyLink}
                className="font-normal text-[16px] leading-[150%] tracking-[0%] break-all"
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
            className="relative max-w-4xl max-h-full p-4 flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10"
              onClick={closeImageModal}
            >
              &times;
            </button> */}
            
            {/* 이미지 */}
            <img
              src={content.imageUrls[currentImageIndex]}
              alt={`Large image ${currentImageIndex + 1}`}
              className="w-[50%] max-w-full max-h-full object-contain"
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
    </div>
  );
}
