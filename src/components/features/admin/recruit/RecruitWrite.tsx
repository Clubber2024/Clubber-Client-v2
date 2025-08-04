'use client';

import { Button } from '@/components/ui/button';
import TitleDiv from '@/components/ui/title-div';
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
              // onChange={handleTitleChange}
              placeholder="제목을 입력해주세요."
            />
          </div>

          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            모집기간
          </p>
          <div className="bg-white mt-2">
            <label className="mt-4 mr-[5px]">
              <input
                type="radio"
                name="recruitType"
                value="ALWAYS"
                onChange={(e) => setRecruitType(e.target.value)}
                checked={recruitType === 'ALWAYS'}
                className="mr-[5px] text-[16px]"
              />
              상시모집
            </label>
            <label className="mt-4 mr-[5px]">
              <input
                type="radio"
                name="recruitType"
                value="ADDITIONAL"
                checked={recruitType === 'ADDITIONAL'}
                onChange={(e) => setRecruitType(e.target.value)}
                className="mr-[5px] text-[16px]"
              />
              추가모집
            </label>
            <label className="mt-4 mr-[5px]">
              <input
                type="radio"
                name="recruitType"
                value="REGULAR"
                checked={recruitType === 'REGULAR'}
                onChange={(e) => setRecruitType(e.target.value)}
                className="mr-[5px] text-[16px]"
              />
              정규모집
            </label>
            {recruitType !== 'ALWAYS' && (
              <div className="flex items-center w-[100%] mt-4">
                <div className="relative">
                  <div className="flex flex-row">
                    <div className="flex items-center relative">
                      <input
                        type="text"
                        // value={formatDate(startDate)}
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
                        // onClick={handleToggleCalendar}
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
                        {/* <MyCalendar onChange={handleStartDateChange} value={startDate} /> */}
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
                        // value={formatDate(endDate)}
                        className=" max-w-[177px] h-[55px] rounded-[5px] bg-white
    border border-[#d6d6d6]
    flex mr-[6px]"
                        placeholder="YYYY-MM-DD"
                      />
                      <img
                        src="/images/admin/calendar.png"
                        className="w-6 h-6 absolute left-[145px]"
                        // onClick={handleToggleEndCalendar}
                      />
                    </div>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="
       max-w-[90px] h-[55px] rounded-[5px] bg-white
    border border-[#d6d6d6]
    flex mr-[6px]"
                      placeholder="00:00"
                    />
                  </div>
                  <div>
                    {endCalendarIsOpen && recruitType !== '상시모집' && (
                      <div className="absolute left-0">
                        {/* <MyCalendar onChange={handleEndDateChange} value={endDate} /> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <label>
            <input
              type="radio"
              name="calendarLink"
              value="캘린더 연동"
              checked={isCalendarLink === true}
              onClick={() => setIsCalendarLink(!isCalendarLink)}
              className="appearance-none w-[16px] h-[16px] border border-gray-400 rounded-[3px]
    checked:bg-primary] checked:border-primary]
    cursor-pointer"
            />
            <span
              className="font-pretendard
  font-normal
  text-[16px]
  leading-[100%]
  tracking-[0]"
            >
              {' '}
              캘린더 연동하기
            </span>
          </label>

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
              // onChange={handleApplyLinkChange}
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
              // type="text"
              className=" w-[100%] h-[600px] rounded-[5px] bg-white
    border-[#d6d6d6] border
    mt-[13px] pl-[11px] pt-[23px]
    font-['Noto_Sans'] text-[16px] font-light leading-[21.79px] text-left
    resize-none
    hover:border-[1.5px]
    focus:outline-none focus:border-[1.5px]"
              value={content}
              // onChange={handleContentChange}
              placeholder={
                '동아리 모집글에 관련된 게시글만 작성하세요. \n위반 시 게시물 삭제 및 서비스 이용기간이 일정 기간 제한될 수 있습니다.'
              }
            />
          </div>

          <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            사진 <p>(선택 / 최대 10장)</p>
          </p>
          <div className="flex bg-white mr-[10%]">
            <div className="flex flex-wrap mt-2.5 bg-white">
              <button
                className="
    flex items-center justify-center w-[107px] h-[107px] rounded-[5px]
    bg-white border border-[#d6d6d6]
    mt-[13px] mr-[10px] cursor-pointer
  "
                // onClick={() => inputFileRef.current.click()}
              >
                <img src="/images/admin/photograph.png" alt="photo" className="w-8 h-8 bg-white" />
              </button>
              <input
                type="file"
                // ref={inputFileRef}
                className="hidden"
                accept="image/*"
                multiple
                // onChange={handleFileChange} // 파일 선택 핸들러 연결
              />

              {selectedImages.length > 10 && (
                <p className="text-red-500">최대 10장까지 업로드 가능합니다.</p>
              )}

              {selectedImages.map((src, index) => (
                <div key={index} className="w-[107px] h-[107px] mr-2.5 mb-2.5 mt-2.5">
                  <button
                    // onClick={() => onOpenImageLightBox(index)}
                    // onDragOver={onDragOver}
                    // onDrop={(e) => onDragDrop(e, index)}
                    className="w-[107px] h-[107px] flex items-center justify-center box-border p-0 rounded-[5px] border border-[#d6d6d6] mt-[3px]"
                  >
                    <img
                      key={index}
                      src={src}
                      alt={`preview ${index}`}
                      draggable
                      // onDragStart={(e) => onDragStart(e, index)}
                      // onDragOver={onDragOver}
                      // onDrop={(e) => onDragDrop(e, index)}
                      className="w-full h-full object-cover box-border rounded-[12px]"
                      // className={styles.image_preview}
                    />

                    <button
                      // onClick={() => handleRemoveImage(index)}
                      className="absolute left-[80px] top-[5px] z-[1]
    bg-[#ff7e80] rounded-[3px] border-none"
                    >
                      X
                    </button>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Button className="mt-10 h-[64px] rounded-[5px]">작성 완료</Button>
        </div>
      </div>
    </>
  );
}
