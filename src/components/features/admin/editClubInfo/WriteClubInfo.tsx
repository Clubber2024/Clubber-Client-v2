'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import { getClubInfo, patchClubInfo, postImageFile } from './api/editClubInfo';
import { useRouter } from 'next/navigation';
import { Club, ClubProps } from './EditClubInfo';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import Modal from '@/app/modal/Modal';

export default function WriteClubInfo() {
  const router = useRouter();
  const [club, setClub] = useState<ClubProps>({
    clubId: undefined,
    clubName: '',
    clubType: '',
    hashTag: '',
    division: '',
    college: '',
    department: '',
    imageUrl: '',
    introduction: '',
    clubInfo: {} as Club,
  });
  const [clubInfo, setClubInfo] = useState<Club>({
    instagram: '',
    youtube: '',
    leader: '',
    room: null,
    totalView: 0,
    activity: '',
  });
  const [isCenter, setIsCenter] = useState(false);
  const [clubId, setClubId] = useState();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [extension, setExtension] = useState('');
  const [imgType, setImageType] = useState('0');
  const [introCount, setIntroCount] = useState(0);
  const [actiCount, setActiCount] = useState(0);
  const { NEXT_PUBLIC_BASE_LOGO_URL } = process.env;
  //->이미지 파일 선택 시 imaType=1, 로고 삭제 시, imgType=2, 미변경시 imgType=0

  useEffect(() => {
    fetchClubInfoData();
  }, []);

  const fetchClubInfoData = async () => {
    const res = await getClubInfo();
    if (res.success) {
     
      setClub(res.data);
      setClubInfo(res.data.clubInfo);
      {
        res.clubInfo?.activity !== null && res.clubInfo?.activity.length > 0
          ? setActiCount(res.clubInfo?.activity.length)
          : setActiCount(0);
      }
      // 이미지 URL을 올바른 형식으로 설정
      const imageUrl = res.data.imageUrl ? res.data.imageUrl : `https://image.ssuclubber.com/${NEXT_PUBLIC_BASE_LOGO_URL}`;
      setImageUrl(imageUrl);
      setImagePreview(imageUrl);
      
      const clubID = res.clubId;
      const intClubID = parseInt(clubID);
      setClubId(clubID);
      return intClubID;
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return; // 파일이 없을 경우 처리 종료
    setImageType('1');
    setImageFile(file);
    
    // 파일 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setExtension(file.name.split('.').pop()?.toUpperCase() ?? ''); // 확장자 추출
    
    // club 상태도 즉시 업데이트하여 UI 반영 ??
    setClub(prev => ({
      ...prev,
      imageUrl: previewUrl
    }));
  };

  const deleteImage = async () => {
    try {
      setImageType('2');
      // 기본 이미지로 설정
      const defaultImageUrl = 'common/logo/soongsil_default.png';
      const defaultImagePreview = 'https://image.ssuclubber.com/common/logo/soongsil_default.png';
      
      setImageUrl(defaultImageUrl);
      setImagePreview(defaultImagePreview);
      
      // club 상태도 업데이트하여 UI 반영
      setClub(prev => ({
        ...prev,
        imageUrl: defaultImagePreview
      }));
      
     
    } catch (error) {
      console.error('Image deletion failed:', error);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  const handleIntroductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const introValue = e.target.value;

    if (introValue.length > 1000) return;

    setClub((prevState) => ({
      ...prevState,
      introduction: introValue,
    }));
    setIntroCount(introValue.length);
  };
  const handleInstagramChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClubInfo((prevState) => ({
      ...prevState,
      instagram: e.target.value,
    }));
  };

  const handleLeaderChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClubInfo((prevState) => ({
      ...prevState,
      leader: e.target.value,
    }));
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const activityValue = e.target.value;

    if (activityValue.length > 1500) return;

    setClubInfo((prevState) => ({
      ...prevState,
      activity: activityValue,
    }));
    setActiCount(activityValue.length);
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClubInfo((prevState) => ({
      ...prevState,
      room: e.target.value,
    }));
  };
  const handleKeyPress = (event: any) => {
    // 숫자만 입력 가능하도록 키 이벤트 필터링
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert('동아리실은 숫자만 입력할 수 있습니다.');
    }
  };

  //수정 완료 후
  const handleSave = async () => {
    if ((clubInfo?.activity?.length ?? 0) > 1500) {
      setIsModalOpen(true);
      setModalMessage("'📌 대표활동 ' 은 최대 1500자까지 작성 가능합니다.");
    } else if ((club?.introduction?.length ?? 0) > 1000) {
      setIsModalOpen(true);
      setModalMessage("'📌 소개 ' 는 최대 100자까지 작성 가능합니다. ");
    } else {
      if (imgType === '1') {
        if (imageFile) {
          try {
            const res = await postImageFile({ imageFileExtension: extension, imageFile: imageFile });
            console.log('data', res);

            if (res.success) {
              // 이미지 업로드 성공 후 상태 업데이트
              // const uploadedImageUrl = `https://image.ssuclubber.com/${res.data.imageKey}`;
              setImageUrl(res.data.imageKey);
              // setImagePreview(uploadedImageUrl);
              
              const data = await patchClubInfo({
                imageKey: res.data.imageKey,
                introduction: club.introduction ?? '',
                instagram: clubInfo.instagram ?? '',
                youtube: clubInfo.youtube ?? '',
                activity: clubInfo.activity ?? '',
                leader: clubInfo.leader ?? '',
                room: clubInfo.room ? Number(clubInfo.room) : null,
              });

              if (data.success) {
                // club 상태도 업데이트
                // setClub(prev => ({
                //   ...prev,
                //   imageUrl: uploadedImageUrl
                // }));
                setIsModalOpen(true);
                setModalMessage('동아리 정보 수정이 완료되었습니다.');
              }
            }
          } catch (error) {
            console.error('Image upload failed:', error);
            setIsModalOpen(true);
            setModalMessage('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          }
        }
      } else {
        const data = await patchClubInfo({
          imageKey: imageUrl,
          introduction: club.introduction ?? '',
          instagram: clubInfo.instagram ?? '',
          youtube: clubInfo.youtube ?? '',
          activity: clubInfo.activity ?? '',
          leader: clubInfo.leader ?? '',
          room: clubInfo.room ? Number(clubInfo.room) : null,
        });

        if (data.success) {
          setIsModalOpen(true);
          setModalMessage('동아리 정보 수정이 완료되었습니다.');
        }
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/admin/editClubInfo');
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
          <div className="flex flex-row items-center pl-5 relative">
            <img
              src={imagePreview ? imagePreview : club?.imageUrl || 'https://image.ssuclubber.com/common/logo/soongsil_default.png'}
              alt="logo"
              className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]"
              onError={(e) => {
                console.log('Image failed to load, using default image');
                e.currentTarget.src = 'https://image.ssuclubber.com/common/logo/soongsil_default.png';
              }}
            />
            
            <label className="cursor-pointer">
              <div className="w-8 h-8 sm:w-9 sm:h-9 border-white bg-[#dddddd] flex items-center justify-center rounded-4xl absolute bottom-2 left-23 sm:left-30">
                <Camera fill="#585656" color="white" strokeWidth={'1'} />
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </label>
           

            <div className='flex flex-col'>
              <p className="mb-2 font-bold">{club?.clubName}</p>
              
              {isCenter ? (
                <Button>
                  {club?.clubType} | {club?.division}{' '}
                </Button>
              ) : (
                <Button>
                  {club?.college} | {club?.department}{' '}
                </Button>
              )}
                <Button onClick={deleteImage} variant={"outline"} className='mt-2'>로고 삭제</Button>
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
                <p className="font-pretendard font-normal text-[18px] leading-[18px] tracking-[0] ">
                  {' '}
                  • {club?.clubType} | {club?.division}
                </p>
              ) : (
                <p className="font-pretendard font-normal text-[18px] leading-[18px] tracking-[0]">
                  {' '}
                  • {club?.college} | {club?.department}
                </p>
              )}
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                소개
              </p>
              <textarea
                value={club?.introduction ?? ''}
                onChange={handleIntroductionChange}
                rows={5}
                cols={50}
                placeholder=" 동아리 소개를 입력하세요."
                className="font-pretendard font-normal text-[14px] leading-[18px] tracking-[0] border border-[#9c9c980] w-full min-h-[70px]"
              />
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                인스타/유튜브
              </p>
              <textarea
                value={clubInfo?.instagram ?? ''}
                onChange={handleInstagramChange}
                rows={5}
                cols={50}
                placeholder=" 동아리 인스타 URL을 입력하세요."
                className="font-pretendard font-normal text-[14px] leading-[18px] tracking-[0] border border-[#9c9c980] w-full min-h-[70px]"
              />
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                대표 활동
              </p>
              <textarea
                value={clubInfo?.activity ?? ''}
                onChange={handleActivityChange}
                rows={5}
                cols={50}
                placeholder=" 동아리 대표활동을 입력하세요."
                className="font-pretendard font-normal text-[14px] leading-[18px] tracking-[0] border border-[#9c9c980] w-full min-h-[70px]"
              />
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                동아리장
              </p>
              <textarea
                value={clubInfo?.leader ?? ''}
                onChange={handleLeaderChange}
                rows={2}
                cols={50}
                placeholder=" 동아리장 이름을 입력하세요."
                className="font-pretendard font-normal text-[14px] leading-[18px] tracking-[0] border border-[#9c9c980] w-full"
              />
            </div>
            <div className="mt-[30px]">
              <p className="font-pretendard font-semibold text-[18px] leading-[18px] tracking-[0] mt-2.5 mb-2.5">
                동아리실
              </p>
              <textarea
                value={clubInfo?.room ?? ''}
                onChange={handleRoomChange}
                onKeyPress={handleKeyPress}
                rows={2}
                cols={10}
                placeholder=" 동아리실을 입력하세요."
                className="font-pretendard font-normal text-[14px] leading-[18px] tracking-[0] border border-[#9c9c980] w-full"
              />
            </div>
          </div>
        </Card>
        <div className="m-auto">
          <Button
            onClick={handleSave}
           className="w-[145px] h-[45px] rouned-[5px] m-auto mt-15 cursor-pointer font-pretendard font-semibold text-[16px] leading-[120%] tracking-[0]"
          >
            완료
          </Button>{' '}
          <Button
            className="w-[145px] h-[45px] rouned-[5px] m-auto mt-15 cursor-pointer font-pretendard font-semibold text-[16px] leading-[120%] tracking-[0]"
            variant="outline"
            onClick={()=>router.back()}
          >
            취소
          </Button>
        </div>
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />}
    </>
  );
}
