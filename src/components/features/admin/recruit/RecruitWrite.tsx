'use client';

import TitleDiv from '@/components/ui/title-div';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RecruitWrite() {
  // const router = useRouter();
  const [accessToken, setAccessToken] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [everytimeUrl, setEverytimeUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [titleCount, setTitleCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [applyLink, setApplyLink] = useState('');

  //모집글 수정인 경우로 넘어올 때 recruitId 존재
  //그냥 모집글 작성인 경우는 recruitId 존재x
  // const recruitId = location.state?.recruitId;
  //삭제할 파일들을 저장
  const [deletedFiles, setDeletedFiles] = useState([]);
  // 새로 추가된 파일들을 저장
  const [newAddedFiles, setNewAddedFiles] = useState([]);
  // 새로 추가된 이미지 URL들을 저장
  const [newAddedImages, setNewAddedImages] = useState([]);
  // (삭제x, 추가x)기존 이미지들을 저장
  const [remainedImages, setRemainedImages] = useState([]);
  //
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [endCalendarIsOpen, setEndCalendarIsOpen] = useState(false);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  // const [isOngoing, setIsOngoing] = useState(false);
  const [recruitType, setRecruitType] = useState('');
  //캘린더 연동 유무
  const [isCalendarLink, setIsCalendarLink] = useState(false);

  return (
    <>
      <TitleDiv>
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] ml-[10px]">
          모집글 작성
        </p>
      </TitleDiv>
      <div className="flex items-center justify-center mt-[32px]">
        <div className="flex flex-col shadow-sm w-[80%] pl-8 pr-8">
          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            제목
          </p>
        </div>
      </div>
    </>
  );
}
