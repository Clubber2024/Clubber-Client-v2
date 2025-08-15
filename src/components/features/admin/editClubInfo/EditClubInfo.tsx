'use client';

import { getAccessToken } from '@/auth/AuthService';
import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import { apiClient } from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import { getClubInfo } from './api/editClubInfo';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function EditClubInfo() {
  const router = useRouter();
  const [club, setClub] = useState<ClubProps>();
  const [clubInfo, setClubInfo] = useState<Club>();
  const [isCenter, setIsCenter] = useState(false);

  useEffect(() => {
    fetchClubInfoData();
  }, []);

  const fetchClubInfoData = async () => {
    const res = await getClubInfo();
    if (res.success) {
      setClub(res.data);
      setClubInfo(res.data.clubInfo);
      if (res.data.clubType === '해당 없음') {
        //소모임
        setIsCenter(false);
      } else {
        //중앙동이리 or 공식단체
        setIsCenter(true);
      }
    }
  };

  return (
    <>
      <TitleDiv>
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] pl-10px">
          동아리정보 수정
        </p>
      </TitleDiv>

      <div className="ml-0 sm:ml-[10%] mr-0 sm:mr-[10%] mt-5 flex flex-col">
        <Card className="mt-[60px] mb-9">
          <div className="flex flex-row items-center pl-5">
            <img src={club?.imageUrl} className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]" />
            <div className='ml-3'>
              <p className="mb-2 font-bold text-[18px]">{club?.clubName}</p>
              {isCenter ? (
                <Button className='w-[150px] h-[33px] sm:w-fit sm:h-fit'>
                  {club?.clubType} | {club?.division}{' '}
                </Button>
              ) : (
                <Button className='w-[150px] h-[33px] sm:w-fit sm:h-fit'>
                  {club?.college} | {club?.department}{' '}
                </Button>
              )}
            </div>
          </div>
        </Card>
        <Card className="rounded-[5px]">
          <div className="pl-5 sm:pl-20 pr-5 sm:pr-20 mt-10 mb-10">
            <div>
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mb-2.5">
                소속분과
              </p>
              {isCenter ? (
                <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] ">
                  {' '}
                  • {club?.clubType} | {club?.division}
                </p>
              ) : (
                <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0]">
                  {' '}
                  • {club?.college} | {club?.department}
                </p>
              )}
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                소개
              </p>
              <div className="flex floex-row">
                •
                <p className="ml-1 font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                  {club?.introduction}
                </p>
              </div>
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                인스타/유튜브
              </p>
              <a href={clubInfo?.instagram ? clubInfo.instagram : ''}>• {clubInfo?.instagram}</a>
              <a href={clubInfo?.youtube ? clubInfo.youtube : ''}> {clubInfo?.youtube}</a>
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                대표 활동
              </p>
              <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                • {clubInfo?.activity}
              </p>
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                동아리장
              </p>
              <p className="font-pretendard font-normal text-[16px] leading-[18px] tracking-[0] whitespace-pre-line">
                • {clubInfo?.leader}
              </p>
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[16px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                동아리실
              </p>
              <p className="font-pretendard font-normal text-[18px] leading-[18px] tracking-[0] whitespace-pre-line">
                • {clubInfo?.room}
              </p>
            </div>
          </div>
        </Card>

        <Button
          onClick={() => router.push('/admin/writeClubInfo')}
          className="w-[120px] sm:w-[145px] h-[40px] sm:h-[45px] rouned-[5px] m-auto mt-10 sm:mt-15 cursor-pointer font-pretendard font-medium text-[16px] sm:text-[17px] leading-[120%] tracking-[0]"
        >
          수정하기
        </Button>
      </div>
    </>
  );
}
