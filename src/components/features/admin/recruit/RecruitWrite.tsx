'use client';

import { Button } from '@/components/ui/button';
import TitleDiv from '@/components/ui/title-div';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import MyCalendar from './Calendar';
import {
  getAdminRecruitContent,
  handleSubmitRecruit,
  linkCalendar,
  patchAdminRecruitWrite,
  uploadImages,
} from './api/recruit';
import Modal from '@/app/modal/Modal';
import { AdminRecruitContentProps } from './RecruitContent';
import { Square, SquareCheck } from 'lucide-react';
import { postCalendarDuplicate } from '../scheduleManage/api/scheduleManage';

interface RecruitWriteProps {
  recruitId?: string;
}

export default function RecruitWrite({ recruitId }: RecruitWriteProps) {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const recruitId = searchParams.get('recruitId');
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isErrorTitle, setIsErrorTitle] = useState(false);
  const [ErrorTitleMessage, setErrorTitleMessage] = useState<string>('');
  const [isErrorType, setIsErrorType] = useState(false);
  const [ErrorTypeMessage, setErrorTypeMessage] = useState<string>('');
  const [isErrorLink, setIsErrorLink] = useState(false);
  const [isErrorContent, setIsErrorContent] = useState(false);
  const [ErrorContentMessage, setErrorContentMessage] = useState<string>('');
  const [modalMessage, setModalMessage] = useState('');
  const [titleCount, setTitleCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [applyLink, setApplyLink] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  //모집글 수정인 경우로 넘어올 때 recruitId 존재
  //그냥 모집글 작성인 경우는 recruitId 존재x
  // const recruitId = location.state?.recruitId;
  //삭제할 파일들을 저장
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  // 새로 추가된 파일들을 저장
  const [newAddedFiles, setNewAddedFiles] = useState<File[]>([]);
  // 새로 추가된 이미지 URL들을 저장
  const [newAddedImages, setNewAddedImages] = useState<string[]>([]);
  // (삭제x, 추가x)기존 이미지들을 저장
  const [remainedImages, setRemainedImages] = useState<string[]>([]);
  //
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [endCalendarIsOpen, setEndCalendarIsOpen] = useState(false);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  // const [isOngoing, setIsOngoing] = useState(false);
  const [recruitType, setRecruitType] = useState('');
  //캘린더 연동 유무
  const [isCalendarLink, setIsCalendarLink] = useState(false);
  const [recruitData, setRecruitData] = useState<AdminRecruitContentProps>();

  /*모집글 수정 시*/

  //모집글 내용 불러올 때 모집글 타입이 한글값으로 들어와서
  // 영어로 전환 해줘야 함
  const typeMap: { [key: string]: string } = {
    정규모집: 'REGULAR',
    추가모집: 'ADDITIONAL',
    상시모집: 'ALWAYS',
  };
  // 모집글 내용 불러오기
  const getRecruitContent = async () => {
    if (recruitId) {
      const res = await getAdminRecruitContent(recruitId);
      
      

      setRecruitData(res);
      setTitle(res.title);
      setTitleCount(res.title.length);

      setRecruitType(typeMap[res.recruitType]);
      setContent(res.content);
      setContentCount(res.content.length);
      setSelectedImages(res.imageUrls);
      setRemainedImages(res.imageUrls);
      setApplyLink(res.applyLink);
      setIsCalendarLink(res.isCalendarLinked);
      
    
      
      const endDate = res.endAt;
      const fullDate = new Date(
        res.startAt[0],
        res.startAt[1] - 1,
        res.startAt[2],
        res.startAt[3],
        res.startAt[4]
      );
      const fullEndDate = new Date(endDate[0], endDate[1] - 1, endDate[2], endDate[3], endDate[4]);

      const formattedStartTime = `${String(fullDate.getHours()).padStart(2, '0')}:${String(fullDate.getMinutes()).padStart(2, '0')}`;
      const formattedEndTime = `${String(fullDate.getHours()).padStart(2, '0')}:${String(fullDate.getMinutes()).padStart(2, '0')}`;

      setStartDate(fullDate);
      setEndDate(fullEndDate);

      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
    }
  };

  useEffect(() => {
    if (recruitId) {
      getRecruitContent();
    } else {
      return;
    }
  }, [recruitId]);

  // isCalendarLink 상태 변경 추적
  useEffect(() => {
    console.log('isCalendarLink 상태 변경:', isCalendarLink);
  }, [isCalendarLink]);

  //캘린더 관련 함수
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleToggleCalendar = () => {
    if (recruitType === 'ADDITIONAL' || recruitType === 'REGULAR') {
      setCalendarIsOpen(!calendarIsOpen);
     
    } else {
      return;
    }
  };



  const handleToggleEndCalendar = () => {
    if (recruitType === 'ADDITIONAL' || recruitType === 'REGULAR') {
      setEndCalendarIsOpen(!endCalendarIsOpen);
    } else {
      return;
    }
  };

  const handleStartDateChange = (selectedData: Date) => {
    setStartDate(selectedData);
    // setCalendarIsOpen(false);
  };

  const handleEndDateChange = (selectedData: Date) => {
    setEndDate(selectedData);
    // setCalendarIsOpen(false);
  };

  const formatDateTime = (dateObjOrStr: Date, timeStr: string) => {
    // 1. date가 문자열이면 그대로 사용, 아니면 YYYY-MM-DD 형식으로 변환
    const date =
      typeof dateObjOrStr === 'string' ? dateObjOrStr : dateObjOrStr.toISOString().slice(0, 10);

    // 2. timeStr은 그대로 붙이기
    return `${date} ${timeStr}`;
  };

  const lookCalendar = () => {
    setIsModalOpen(false);
    //관리자 캘린더 링크로 -> 링크 정해지면 주소 수정!!
    router.push(`/admin/calendar`);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsErrorTitle(false);
    setTitle(e.target.value);
    setTitleCount(e.target.value.length);
   
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsErrorContent(false);
    setContent(e.target.value);
    setContentCount(e.target.value.length);
  };

  const handleApplyLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplyLink(e.target.value);
  
  };

  // 파일 선택 핸들러
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedImages.length >= 10) {
      alert('최대 10장까지만 업로드할 수 있습니다.');
      event.preventDefault(); // 이벤트를 중지하여 더 이상 파일 선택을 처리하지 않음
      return; // 함수를 빠져나와 추가 로직 실행을 방지
    }
    const files = event.target.files;

    if (!files) return;

    if (files.length > 10) {
      alert('최대 10장까지 업로드할 수 있습니다.');
      if (inputFileRef.current) {
        inputFileRef.current.value = ''; // 파일 선택 초기화
      }
      return;
    }

    const newImageFiles = Array.from(files);
    const newImageURLs = newImageFiles.map((file) => URL.createObjectURL(file));

    //모집글 수정 시
    if (recruitId) {
      // 새로 추가된 파일과 이미지 URL 상태 업데이트
      setRemainedImages(selectedImages);

      setNewAddedFiles(newImageFiles);
      setNewAddedImages(newImageURLs);
    }

    setSelectedFiles((prevFiles) => {
      return [...prevFiles, ...newImageFiles];
    });
    setSelectedImages((prevImages) => {
      return [...prevImages, ...newImageURLs];
    });
  };

  //이미지 드래그 기능
  const onOpenImageLightBox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightBoxOpen(true);
  };

  const onCloseLightBox = () => {
    setIsLightBoxOpen(false);
  };

  const onDragStart = (e: React.DragEvent<HTMLElement>, id: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('imgIndex', String(id));
  };

  const onDragDrop = (e: React.DragEvent<HTMLButtonElement | HTMLImageElement>, index: number) => {
    e.preventDefault();

    const sourceIndex = Number(e.dataTransfer.getData('imgIndex'));
    if (sourceIndex === index) return;
    const updateImages = [...selectedImages];
    const [movedImage] = updateImages.splice(sourceIndex, 1);

    updateImages.splice(index, 0, movedImage);
    setSelectedImages(updateImages);
    setRemainedImages(updateImages);
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => {
      const imageToDelete = prevImages[index]; // 삭제될 이미지 찾음
      //모집글 수정 시
      if (recruitId) {
        // deletedFiles 배열에 삭제될 이미지 추가
        setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, imageToDelete]);
      }

      // 필터를 사용하여 선택된 이미지 목록에서 해당 이미지를 제거
      const updatedImages = prevImages.filter((_, i) => i !== index);

      //모집글 수정 시
      if (recruitId) {
        // 남은 이미지들을 remainingImages 상태에 저장
        setRemainedImages(updatedImages);
      }

      // 필터를 사용하여 선택된 이미지 목록에서 해당 이미지를 제거
      return updatedImages;
    });
  };

  const handleSubmitButton = async () => {
    let hasError = false;

    if (title === '' || !title.trim()) {
      setIsErrorTitle(true);
      setErrorTitleMessage('제목을 입력해주세요.');
      hasError = true;
    }

    if (title.length > 100) {
      setErrorTitleMessage('제목은 최대 100자까지 입력할 수 있습니다.');
      hasError = true;
    }

    if (content === '' || !content.trim()) {
      setIsErrorContent(true);
      setErrorContentMessage('내용을 입력해주세요.');
      hasError = true;
    }

    if (content.length > 2000) {
      setErrorContentMessage('내용은 최대 2000자까지 입력할 수 있습니다.');
      hasError = true;
    }

    if (recruitType === '' || !recruitType.trim()) {
      setIsErrorType(true);
      setErrorTypeMessage('모집분야를 선택해주세요.');
      hasError = true;
    }

    if (hasError) return;

    try {
      const imageUrls = await uploadImages({ selectedFiles });
      console.log('imageUrls');
      let formattedStart: string | null = null;
      let formattedEnd: string | null = null;
      
      if(recruitType==='ALWAYS'){
         formattedStart = null;
        formattedEnd = null;
      } else{
        formattedStart = formatDateTime(startDate, startTime);
        formattedEnd = formatDateTime(endDate, endTime);
      }
     

      if (recruitId) {
        const combinedImages = [...remainedImages, ...imageUrls];

        const res = await patchAdminRecruitWrite(
          {
            title: title,
            content: content,
            recruitType: recruitType,
            startAt: formattedStart,
            endAt: formattedEnd,
            applyLink: applyLink,
            isCalendarLinked: isCalendarLink,
            deletedImageUrls: deletedFiles,
            newImageKeys: imageUrls,
            remainImageUrls: remainedImages ? remainedImages : selectedImages,
            images: combinedImages,
          },
          recruitId
        );
     
        if (res.success) {
          if(res.data && res.data.shouldCreateCalendar){
            console.log("캘린더 연동 시도 중...");
            try {
              // 중복 검사
              if(isDuplicate){
//중복 검사 완료했으므로 중복 안함
// 캘린더 연동 진행
const resLinkCalendar = await linkCalendar(recruitId);
console.log("캘린더 연동 결과:", resLinkCalendar);

if(resLinkCalendar.success){
  setIsModalOpen(true);
  setModalMessage('모집글 수정이 완료되었습니다.');
} else {
  console.error("캘린더 연동 실패:", resLinkCalendar);
  setIsModalOpen(true);
  setModalMessage('모집글 수정이 완료되었습니다.');
}

              } else{
                const resDuplicate = await postCalendarDuplicate({recruitType: recruitType, startAt:formattedStart});

                if(resDuplicate.success){
                  if(resDuplicate.data.isExist){
                    const duplicateRecruitType = resDuplicate.data.recruitType;
                    const recruitTypeText = duplicateRecruitType === 'REGULAR' ? '정규모집' : 
                                            duplicateRecruitType === 'ALWAYS' ? '상시모집' : 
                                            duplicateRecruitType === 'ADDITIONAL' ? '추가모집' : '모집';
                    
                    setIsOpenModal2(true);
                    setModalMessage(`해당 월에는 이미 ${recruitTypeText} 일정이 등록되어 있습니다. \n중복 등록 시 사용자에게 혼란을 줄 수 있으니 확인 후 진행해 주세요.`);
                    return;
                  } else {
                    // 중복이 없으면 캘린더 연동 진행
                    const resLinkCalendar = await linkCalendar(recruitId);
                    console.log("캘린더 연동 결과:", resLinkCalendar);
  
                    if(resLinkCalendar.success){
                      setIsModalOpen(true);
                      setModalMessage('모집글 수정이 완료되었습니다.');
                    } else {
                      console.error("캘린더 연동 실패:", resLinkCalendar);
                      setIsModalOpen(true);
                      setModalMessage('모집글 수정이 완료되었습니다.');
                    }
                  }             
                } else {
                  console.error("중복 검사 실패:", resDuplicate);
                  setIsModalOpen(true);
                  setModalMessage('모집글 수정이 완료되었습니다.');
                }     
              }
               
            } catch (error) {
              console.error("캘린더 연동 중 에러:", error);
              setIsModalOpen(true);
              setModalMessage('모집글 수정이 완료되었습니다.');
            }
          } else {
            console.log("캘린더 연동 조건 불충족:", res.data?.shouldCreateCalendar);
            setIsModalOpen(true);
            setModalMessage('모집글 수정이 완료되었습니다.');
          }
        }
      } else {
        const res = await handleSubmitRecruit({
          title: title,
          content: content,
          imageKey: imageUrls,
          recruitType: recruitType,
          startAt: formattedStart,
          endAt: formattedEnd,
          applyLink: applyLink,
          isCalendarLinked: isCalendarLink,
        });
        if (res.success) {
          if(res.data && res.data.isCalendarLinked && res.data.recruitId){
            console.log("캘린더 연동 시도 중...");
            try {
              const recruitId = res.data.recruitId;

              if(isDuplicate){
//중복 검사 없이 바로 캘린더 연동
 // 중복이 없으면 캘린더 연동 진행
 const resLinkCalendar = await linkCalendar(recruitId);
 console.log("캘린더 연동 결과:", resLinkCalendar);

 if(resLinkCalendar.success){
   setIsModalOpen(true);
   setModalMessage('모집글 작성이 완료되었습니다.');
 } else {
   console.error("캘린더 연동 실패:", resLinkCalendar);
   setIsModalOpen(true);
   setModalMessage('모집글 작성이 완료되었습니다.');
 }
                
              } else{
 // 중복 검사
 const resDuplicate = await postCalendarDuplicate({recruitType: recruitType, startAt:formattedStart});

 if(resDuplicate.success){
   if(resDuplicate.data.isExist){
     const duplicateRecruitType = resDuplicate.data.recruitType;
     const recruitTypeText = duplicateRecruitType === 'REGULAR' ? '정규모집' : 
                             duplicateRecruitType === 'ALWAYS' ? '상시모집' : 
                             duplicateRecruitType === 'ADDITIONAL' ? '추가모집' : '모집';
     
     setIsOpenModal2(true);
     setModalMessage(`해당 월에는 이미 ${recruitTypeText} 일정이 등록되어 있습니다. \n중복 등록 시 사용자에게 혼란을 줄 수 있으니 확인 후 진행해 주세요.`);
     return;
   } else {
     // 중복이 없으면 캘린더 연동 진행
     const resLinkCalendar = await linkCalendar(recruitId);
     console.log("캘린더 연동 결과:", resLinkCalendar);

     if(resLinkCalendar.success){
       setIsModalOpen(true);
       setModalMessage('모집글 작성이 완료되었습니다.');
     } else {
       console.error("캘린더 연동 실패:", resLinkCalendar);
       setIsModalOpen(true);
       setModalMessage('모집글 작성이 완료되었습니다.');
     }
   }             
 } else {
   console.error("중복 검사 실패:", resDuplicate);
   setIsModalOpen(true);
   setModalMessage('모집글 작성이 완료되었습니다.');
 }

              }
             
            } catch (error) {
              console.error("캘린더 연동 중 에러:", error);
              setIsModalOpen(true);
              setModalMessage('모집글 작성이 완료되었습니다.');
            }
          } else {
            console.log("캘린더 연동 조건 불충족:", res.data?.shouldCreateCalendar);
            setIsModalOpen(true);
            setModalMessage('모집글 작성이 완료되었습니다.');
          }
        }
      }
    } catch {}
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.back();
  };

  const closeDuplicateModal = () => {
    setIsOpenModal2(false);
  };

  const confirmModal2 = () => {
    setIsOpenModal2(false);
    setIsDuplicate(true);
  };


  return (
    <>
      <TitleDiv>
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] ml-[10px]">
          모집글 작성
        </p>
      </TitleDiv>
      <div className="flex items-center justify-center mt-[32px] mb-[32px] flex-col">
        <div className="flex flex-col shadow-sm w-[80%] pl-8 pr-8 pb-[32px]">
          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            제목
          </p>
          <div className="bg-[#ffffff]">
            <input
              type="text"
              className="
    w-[100%] h-[55px] rounded-[5px] bg-[#ffffff]  border-[#d6d6d6] border
    mt-[13px] pl-[11px]
    font-['Noto_Sans'] text-[16px] font-medium leading-[21.79px] text-left
    hover:border-[2px] focus:border-[2px] focus:outline-none
  "
              value={title}
              onChange={handleTitleChange}
              placeholder="제목을 입력해주세요."
            />
          </div>
          {isErrorTitle ? (
            <div className="mt-2 flex h-3">
              <img src="/images/admin/warning-icon.png" className="w-4 h-4 mr-0.5" />
              <span className="text-[#fd3c56] text-[13px] font-light">{ErrorTitleMessage}</span>
            </div>
          ) : (
            ''
          )}

          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            모집기간
          </p>
          <div className="bg-white mt-2 ">
            <div className="flex flex-row">
              {[
                { label: '정규모집', value: 'REGULAR' },
                { label: '추가모집', value: 'ADDITIONAL' },
                { label: '상시모집', value: 'ALWAYS' },
              ].map((option) => (
                <label key={option.value} className="mt-4 mr-[5px] flex items-center">
                  {recruitType === option.value ? (
                    <img
                      src={`/images/admin/check-circle.png`}
                      alt={`${option.label} 선택됨`}
                      onClick={() => {
                        setIsErrorType(false);
                        setRecruitType(option.value);
                      }}
                      className="w-[16px] h-[16px] mr-[5px] cursor-pointer"
                    />
                  ) : (
                    <input
                      type="radio"
                      name="recruitType"
                      value={option.value}
                      checked={recruitType === option.value}
                      onChange={(e) => {
                        setIsErrorType(false);
                        setRecruitType(e.target.value);
                      }}
                      className="mr-[5px] w-[16px] h-[16px] appearance-none border border-gray-400 rounded-[25px] cursor-pointer"
                    />
                  )}
                  <span className="text-[16px] font-pretendard font-normal leading-none tracking-normal">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {isErrorType ? (
              <div className="mt-2 flex h-3">
                <img src="/images/admin/warning-icon.png" className="w-4 h-4 mr-0.5" />
                <span className="text-[#fd3c56] text-[13px] font-light">{ErrorTypeMessage}</span>
              </div>
            ) : (
              ''
            )}

            {recruitType !== 'ALWAYS' && (
              <div className="flex items-center w-[100%] mt-4">
                <div className="relative">
                  <div className="flex flex-row">
                    <div className="flex items-center relative">
                      <input
                        type="text"
                        readOnly
                        value={formatDate(startDate)}
                        className="
    max-w-[177px] h-[55px] rounded-[5px] bg-white
    border border-[#d6d6d6]
    flex mr-[6px]
  "
                        placeholder="YYYY-MM-DD"
                      />
                      <img
                        src="/images/admin/calendar.png"
                        className="w-6 h-6 absolute left-[145px]"
                        onClick={handleToggleCalendar}
                      />
                    </div>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="
    max-w-[90px] h-[55px] rounded-[5px] bg-white
    border border-[#d6d6d6]
    flex mr-[6px]
"
                      placeholder="00:00"
                    />
                  </div>
                  <div>
                    {calendarIsOpen && recruitType !== '상시모집' && (
                      <div className="absolute left-0">
                        <MyCalendar date={startDate} onChange={handleStartDateChange} />
                      </div>
                    )}
                  </div>
                </div>

                <p className="ml-[5%] mr-[5%]">~</p>

                <div className="relative">
                  <div className="flex flex-row">
                    <div className="flex items-center relative">
                      <input
                        type="text"
                        readOnly
                        value={formatDate(endDate)}
                        className=" max-w-[177px] h-[55px] rounded-[5px] bg-white
    border border-[#d6d6d6]
    flex mr-[6px]"
                        placeholder="YYYY-MM-DD"
                      />
                      <img
                        src="/images/admin/calendar.png"
                        className="w-6 h-6 absolute left-[145px]"
                        onClick={handleToggleEndCalendar}
                      />
                    </div>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="max-w-[90px] h-[55px] rounded-[5px] bg-white
    border border-[#d6d6d6]
    flex mr-[6px]"
                      placeholder="00:00"
                    />
                  </div>
                  <div>
                    {endCalendarIsOpen && recruitType !== '상시모집' && (
                      <div className="absolute left-0">
                        <MyCalendar date={endDate} onChange={handleEndDateChange} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center mt-4">
            {isCalendarLink ? (
              <SquareCheck onClick={() => setIsCalendarLink(false)} size={20} color="#71b1dd" />
            ) : (
              <Square onClick={() => setIsCalendarLink(true)} size={20} color="#d6d6d6" />
            )}

            <span className="ml-2 font-pretendard font-normal text-[16px] leading-[100%] tracking-[0] ">
              캘린더 연동
            </span>
          </div>

          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            지원링크
          </p>
          <div className="bg-white mt-2">
            <input
              type="text"
              className="
    w-[100%] h-[55px] rounded-[5px] bg-[#ffffff]  border-[#d6d6d6] border
    mt-[13px] pl-[11px]
    font-['Noto_Sans'] text-[16px] font-medium leading-[21.79px] text-left
    hover:border-[2px] focus:border-[2px] focus:outline-none
  "
              value={applyLink}
              onChange={handleApplyLinkChange}
              placeholder="구글폼, 지원 가능한 링크 등"
            />
          </div>

          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            {' '}
            내용
            {/* 내용 <p className={styles.write_title_sub}>({contentCount}/2000)</p> */}
          </p>

          <div className="bg-white mt-2">
            <textarea
              className=" w-[100%] h-[600px] rounded-[5px] bg-white
    border-[#d6d6d6] border
    mt-[13px] pl-[11px] pt-[23px]
    font-['Noto_Sans'] text-[16px] font-medium leading-[21.79px] text-left
    resize-none
    hover:border-[1.5px]
    focus:outline-none focus:border-[1.5px]"
              value={content}
              onChange={handleContentChange}
              placeholder={
                '동아리 모집글에 관련된 게시글만 작성하세요. \n위반 시 게시물 삭제 및 서비스 이용기간이 일정 기간 제한될 수 있습니다.'
              }
            />
          </div>
          {isErrorContent ? (
            <div className="mt-2 flex h-3">
              <img src="/images/admin/warning-icon.png" className="w-4 h-4 mr-0.5" />
              <span className="text-[#fd3c56] text-[13px] font-light">{ErrorContentMessage}</span>
            </div>
          ) : (
            ''
          )}

          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            사진 (선택 / 최대 10장)
          </p>
          <div className="flex bg-white mr-[10%]">
            <div className="flex flex-wrap mt-2.5 bg-white">
              <button
                className="
    flex items-center justify-center w-[107px] h-[107px] rounded-[5px]
    bg-white border border-[#d6d6d6]
    mt-[13px] mr-[10px] cursor-pointer
  "
                onClick={() => inputFileRef.current?.click()}
              >
                <img src="/images/admin/photograph.png" alt="photo" className="w-8 h-8 bg-white" />
              </button>
              <input
                type="file"
                ref={inputFileRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange} // 파일 선택 핸들러 연결
              />

              {selectedImages.length > 10 && (
                <p className="text-red-500">최대 10장까지 업로드 가능합니다.</p>
              )}

              {selectedImages.map((src, index) => (
                <div key={index} className="w-[107px] h-[107px] mr-2.5 mb-2.5 mt-2.5">
                  <button
                    onClick={() => onOpenImageLightBox(index)}
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDragDrop(e, index)}
                    className="w-[107px] h-[107px] flex items-center justify-center box-border p-0 rounded-[5px] border border-[#d6d6d6] mt-[3px] relative"
                  >
                    <img
                      key={index}
                      src={src}
                      alt={`preview ${index}`}
                      // draggable
                      // onDragStart={(e) => onDragStart(e, index)}
                      // onDragOver={onDragOver}
                      // onDrop={(e) => onDragDrop(e, index)}
                      className="w-full h-full object-cover box-border rounded-[5px] "
                    />

                    <div
                      onClick={() => handleRemoveImage(index)}
                      className="absolute left-[90px] top-[5px] z-[10]
  text-red-500 rounded-[3px] border-none"
                    >
                      X
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
         
        </div>
        <Button className="mt-10 h-[60px] rounded-[5px] w-[80%] text-[16px] font-semibold" onClick={handleSubmitButton}>
            작성 완료
          </Button>
        {isModalOpen && <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />}
        {isOpenModal2 && <Modal isOpen={isOpenModal2} message={modalMessage} confirmText='계속등록' cancelText='취소' onConfirm={confirmModal2} onCancel={closeDuplicateModal} showConfirmButton={true}/>}
      </div>
    </>
  );
}
