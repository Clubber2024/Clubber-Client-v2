'use client';

import { getAccessToken } from '@/auth/AuthService';
import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import { apiClient } from '@/lib/apiClient';
import { useEffect, useState } from 'react';

type Club = {
  instagram: string | null;
  youtube: string | null;
  leader: string | null;
  room: string | null;
  totalView: number;
  activity: string | null;
};

interface ClubProps {
  clubId: number;
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
  const [club, setClub] = useState<ClubProps>();

  const getClubInfo = async () => {
    try {
      const accessToken = getAccessToken();
      const res = await apiClient.get(`/v1/admins/mypage`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('res', res.data);
      if (res.data.success) {
        setClub(res.data.data);
      }
    } catch {}
  };

  useEffect(() => {
    getClubInfo();
  }, []);

  return (
    <>
      <TitleDiv>
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] pl-10px">
          동아리정보 수정
        </p>
      </TitleDiv>

      <div className="ml-[10%] mr-[10%] mt-5">
        <Card></Card>
      </div>
    </>
  );
}
