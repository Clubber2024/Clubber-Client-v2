'use client';

import Container from '@/components/ui/container';
import Divider from '@/components/ui/divider';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getAdminRecruitContent } from './recruit';

export interface AdminRecruitContentProps {
  clubId: number;
  recruitId: number;
  title: string;
  recruitType: string;
  startAt: Array<number>;
  endAt: Array<number>;
  content: string;
  applyLink: string;
  imageUrls: string[];
  isCalendarLinked: boolean;
  totalView: number;
  createdAt: string;
}

export default function RecruitContent() {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const recruitId = searchParams.get('recruitId');
  const [content, setContent] = useState<AdminRecruitContentProps>();
  const [formattedStartAt, setFormattedStartAt] = useState();
  const [formattedEndAt, setFormattedEndAt] = useState();

  const fetchData = async () => {
    if (recruitId) {
      const res = await getAdminRecruitContent(recruitId);
      console.log(res);
      setContent(res);
      // const formatted = dayjs(res.startAt);
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
      <Container>
        <Divider className="shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-black" />
        {content ? (
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-[24px] leading-[100%] tracking-[0%] font-pretendard mt-[13px] mb-[14px]">
              {content.title}
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-[0%] font-pretendard text-[#a7a7a7] mb-[34px]">
              {content.createdAt} | 조회수 {content.totalView}
            </p>
            <Divider className="w-full" />
            <div className="flex flex-row justify-between w-full mt-2.5 mb-2.5">
              <div className="flex flex-row justify-center items-start gap-2">
                <span className="font-semibold text-[16px] leading-[100%] tracking-[0%] font-pretendard">
                  • 모집기간{' '}
                </span>
                <span className="font-normal text-[16px] leading-[100%] tracking-[0%] font-pretendard">
                  {formatDateArray(content.startAt)} ~ <br />
                  {formatDateArray(content.endAt)}
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
            <div ref={containerRef} className="w-[90%] overflow-x-auto ">
              <div className="flex mt-10 gap-4">
                {content.imageUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`image-${index}`}
                    className="h-auto object-container flex-shrink-0"
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
    </>
  );
}
