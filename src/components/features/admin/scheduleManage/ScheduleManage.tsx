'use client'

import TitleDiv from "@/components/ui/title-div";
import { useEffect, useState, useCallback } from "react";
import { CalendarPros, deleteCalendar, deletedCalendarLink, getCalendar, getCalendarList, patchCalendar, postCalendar, postCalendarDuplicate } from "./api/scheduleManage";
import ReactPaginate from "react-paginate";
import { ChevronDown, PencilLine, Trash2 } from "lucide-react";
import Divider from "@/components/ui/divider";
import Modal from "@/app/modal/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MyCalendar from "../recruit/Calendar";
import { count } from "console";
import { useRouter } from "next/navigation";

interface CalendarGetProps extends CalendarPros{
recruitStatus:string;
isCalendarLinked:boolean;
}

interface CalendarProps extends CalendarGetProps{
  writeRole:string;
}
const recruitTypeMap: { [key: string]: string } = {
  ALWAYS: "상시",
  REGULAR: "정규",
  ADDITIONAL: "추가"
  // 다른 타입 있으면 추가
};

const optionsData = {
  정렬: ['최신순', '오래된순'],
  상태: ['전체', '진행중', '마감됨'],
  유형: ['상시', '정규', '추가'],
} as const;

  //모집글 내용 불러올 때 모집글 타입이 한글값으로 들어와서
  // 영어로 전환 해줘야 함
  const typeMap: { [key: string]: string } = {
    정규모집: 'REGULAR',
    추가모집: 'ADDITIONAL',
    상시모집: 'ALWAYS',
  };

type Category = keyof typeof optionsData; // '정렬' | '상태' | '유형'

export default function ScheduleManage(){
  const router=useRouter();
  const [selected, setSelected] = useState<Record<Category, string>>({
    정렬: '최신순',
    상태: '전체',
    유형: '상시',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10); // 한 페이지에 표시할 항목 수
  const [sort, setSort] = useState('desc'); // 정렬 기준
  const [calendarList, setCalendarList] = useState<CalendarGetProps[]>([]);
  const [calendarFilterType, setCalendarFilterType] = useState('ALL');
const [isOpenToggle, setIsOpenToggle] = useState(false);
const [isOpenOption, setIsOpenOption] = useState<number | null>(null);
const [isOpenModal, setIsOpenModal] = useState(false);
const [isOpenModal2, setIsOpenModal2] = useState(false);
const [modalMessage, setModalMessage] = useState("")
const [selectedId, setSelectedId] = useState<number>();
const [isLinkedModal, setIsLinkedModal] = useState(false);
  const [isOpenWriteContent,setIsOpenWriteContent] = useState(false);
const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [endCalendarIsOpen, setEndCalendarIsOpen] = useState(false);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  // const [isOngoing, setIsOngoing] = useState(false);
  const [recruitType, setRecruitType] = useState('');
  const [title, setTitle] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [isErrorTitle, setIsErrorTitle] = useState(false);
  const [ErrorTitleMessage, setErrorTitleMessage] = useState<string>('');
  const [isErrorType, setIsErrorType] = useState(false);
  const [ErrorTypeMessage, setErrorTypeMessage] = useState<string>('');
  const [isErrorLink, setIsErrorLink] = useState(false);
  const [calendarData, setCalendarData]= useState<CalendarProps>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [url,setUrl] = useState('');

  const handleClick = (category: Category, option: string) => {
    setSelected((prev) => ({ ...prev, [category]: option }));
    
    // 옵션 변경 시 필터링 적용
    if (category === '정렬') {
      // 정렬 옵션 처리
      const sortOrder = option === '최신순' ? 'desc' : 'asc';
      setSort(sortOrder);
    } else if (category === '상태') {
      // 상태 옵션 처리
      const statusMap: { [key: string]: string } = {
        '전체': 'ALL',
        '진행중': 'RECRUITING',
        '마감됨': 'CLOSED'
      };
      setCalendarFilterType(statusMap[option] || 'ALL');
    } else if (category === '유형') {
      // 유형 옵션 처리
      const typeMap: { [key: string]: string } = {
        '상시': 'ALWAYS',
        '정규': 'REGULAR',
        '추가': 'ADDITIONAL'
      };
      setCalendarFilterType(typeMap[option] || 'ALL');
    }
    
    // 페이지를 1페이지로 리셋
    setCurrentPage(1);
  };

  const fetchCalendarList = useCallback(async() => {
    const res = await getCalendarList(currentPage, pageSize, calendarFilterType, sort);
    if(res.success){
      setCalendarList(res.data.content);
      setTotalPages(res.data.totalPages)
    } else{
      return;
    }
  }, [currentPage, pageSize, calendarFilterType, sort]);

  const deleteCalendarData = async(id:number) => {
    
      const res =await deleteCalendar(id)
      if(res.success){
         // 1) 즉시 로컬 상태 반영
      setCalendarList((prev) => prev.filter(item => item.id !== isOpenOption));

      // 2) 서버에서 최신 데이터 재요청 (확인용)
      await fetchCalendarList();

      // 옵션 & 모달 닫기
      setIsOpenOption(null);
      setIsOpenModal(false);
      } else{
        return;
      }
   
  }

  const openModal = (id:number) => {
    setSelectedId(id);
      setIsOpenModal(true)
      setModalMessage(`삭제한 글을 복구할 수 없습니다. \n삭제하시겠습니까?`)
   
  }

  const closeModal = () => {
setIsOpenModal(false);
  }

  const confrimModal = async() => {
    //캘린더 삭제시
    if(selectedId!==undefined){
   await deleteCalendarData(selectedId);
   
   
    }

  }

//수정하기 버튼 클릭 시
  const modifyCalendar=async(id:number) => {
    // 해당 아이템의 isCalendarLinked 확인
    const targetItem = calendarList.find(item => item.id === id);
setSelectedId(id);
    if (targetItem?.isCalendarLinked) {
      // isCalendarLinked가 true인 경우 모달 띄우기
      setModalMessage("해당 일정은 모집글과 연동되어 있습니다.");
      setIsLinkedModal(true);
      return;
    }
    
    setIsOpenWriteContent(true);
    setIsEditMode(true);
    // setSelectedId(id);

    if(id!==null){
     const res = await getCalendar(id);

     if(res.success){
      setCalendarData(res.data);
      setTitle(res.data.title);
      setApplyLink(res.data.url);
      
      // 날짜 처리
      const startDateObj = new Date(res.data.startAt);
      const endDateObj = new Date(res.data.endAt);
      setStartDate(startDateObj);
      setEndDate(endDateObj);
      
      // 시간 추출 (HH:MM 형식)
      const startTimeStr = startDateObj.toTimeString().slice(0, 5);
      const endTimeStr = endDateObj.toTimeString().slice(0, 5);
      setStartTime(startTimeStr);
      setEndTime(endTimeStr);
      
      setRecruitType(res.data.recruitType);
     }
    }
    
  }

  const handleUnlinkCalendar = async () => {
    if(selectedId!==undefined){
    const res = await deletedCalendarLink(selectedId);
    console.log("연동 끊기:", res.data);
    setIsLinkedModal(false);
    if(res.success){
setIsOpenModal(true);
setModalMessage("연동이 해제되었습니다.");   
  }
  }
}
  
  const handleViewRecruitPost = () => {
    if(selectedId!==undefined){
      // 해당 아이템의 URL 찾기
      const targetItem = calendarList.find(item => item.id === selectedId);
      if (targetItem?.url) {
        // URL이 있으면 해당 URL로 이동
        router.push(targetItem.url);
      } else {
        console.log("모집글 URL이 없습니다:", selectedId);
      }
      console.log("모집글 보러가기:", selectedId);
      setIsLinkedModal(false);
    }
  }

useEffect(()=>{
  fetchCalendarList()
}, [fetchCalendarList]);

const handlePageChange = ({ selected }: { selected: number }) => {
  setCurrentPage(selected + 1);
};

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
    console.log(recruitType);
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
  setCalendarIsOpen(false);     // 달력 닫기
  
  // setCalendarIsOpen(false);
};

const handleEndDateChange = (selectedData: Date) => {
  setEndDate(selectedData);
  setEndCalendarIsOpen(false);
  // setCalendarIsOpen(false);
};

const formatDateTime = (dateObjOrStr: Date, timeStr: string) => {
 
  // 1. date가 문자열이면 그대로 사용, 아니면 YYYY-MM-DD 형식으로 변환
  const date =
    typeof dateObjOrStr === 'string' ? dateObjOrStr : dateObjOrStr.toISOString().slice(0, 10);
    
  // 2. timeStr은 그대로 붙이기
  return `${date} ${timeStr}`;
};

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // setIsErrorTitle(false);
  setTitle(e.target.value);
  console.log(e.target.value);
};

const handleApplyLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setApplyLink(e.target.value);
  console.log(e.target.value);
};

const cancelWriteButton= ()=>{
  if(isEditMode){
    //수정모드 일 때
setIsOpenWriteContent(false);

   }else{
    //수정모드 아닐 때
  setIsOpenWriteContent(false);
  setIsEditMode(false);
  setApplyLink("");
  setTitle("");
  setStartDate(new Date());
  setEndDate( new Date());
  setStartTime("00:00")
  setEndTime("00:00")
  setErrorTitleMessage("");
  setIsErrorTitle(false);
  setIsErrorType(false);
  setErrorTypeMessage("");
   }
  
}

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

  if (recruitType === '' || !recruitType.trim()) {
    setIsErrorType(true);
    setErrorTypeMessage('모집분야를 선택해주세요.');
    hasError = true;
  }

  if (hasError) return;

  try{
    const formattedStart = formatDateTime(startDate, startTime);
    const formattedEnd = formatDateTime(endDate, endTime);
    
    if(isEditMode){
      // 수정 모드일 때는 patchCalendar 호출
      if(selectedId !== undefined){
        const res = await patchCalendar({
          id: selectedId,
          title: title,
          recruitType: recruitType,
          startAt: formattedStart,
          endAt: formattedEnd,
          url: applyLink
        });
        if(res.success){
          setIsOpenWriteContent(false);
          setModalMessage("모집일정이 수정되었습니다.");
          setIsOpenModal2(true);
        }
      }
    } else {
      // 새 등록 모드일 때는 중복 확인 후 postCalendar 호출
      const duplicateConfirm = await postCalendarDuplicate({recruitType:recruitType, startAt:formattedStart});
      if(duplicateConfirm.success){
        if(duplicateConfirm.data.isExist){
          setIsOpenWriteContent(false);
          setIsOpenModal2(true);
          setModalMessage("해당 월에는 이미 모집 일정이 등록되어 있습니다. \n 중복 등록 시 사용자에게 혼란을 줄 수 있으니 확인 후 진행해 주세요.")
        } else{
          const res = await postCalendar({title:title,recruitType:recruitType,startAt:formattedStart,endAt: formattedEnd,applyLink:applyLink})
          if(res.success){
            setIsOpenWriteContent(false);
            setModalMessage("모집일정이 캘린더에 등록되었습니다.")
            setIsOpenModal2(true);
          }
        }
      }
    }
  }catch{}
}


const closeModal2 = () =>{

    //캘린더 등록 후 확인 모달
    setIsOpenModal2(false);
    fetchCalendarList();
    setApplyLink("");
    setTitle("");
    setStartDate(new Date());
    setEndDate( new Date());
    setStartTime("00:00")
    setEndTime("00:00")

}

const closeLinkedModal = () => {
  setIsLinkedModal(false);
}



  return(
    <>
    <TitleDiv><p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] ml-[10px]">모집일정 관리</p></TitleDiv>
    <div className="w-full mt-15">
      <span className="flex items-center text-[#707070] font-medium text-base leading-[100%] tracking-normal cursor-pointer mb-1" onClick={()=>setIsOpenToggle((prev)=>!prev)}>옵션 <ChevronDown size={12} /></span>
    {isOpenToggle?(   <div className="flex space-x-8 text-sm text-gray-600 font-normal select-none flex-col w-full mt-1">
    {(Object.entries(optionsData) as [Category, readonly string[]][]).map(([category, options]) => (
      <div key={category} className="flex items-center space-x-4 border-t m-0 pt-1 pb-1">
        <span className="text-[#707070]">{category}</span>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleClick(category, option)}
            className={`cursor-pointer whitespace-nowrap ${
              selected[category] === option
                ? 'font-semibold text-primary'
                : 'text-gray-400 hover:text-gray-700'
            }`}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    ))}
  </div>):""}
 
     
      <table className="w-full border-collapse text-left">
        <thead className="bg-[#dddddd4d]">
          <tr className="border-b border-gray-300" style={{ borderTop: '1px solid var(--gray-font, #707070)' }}>
            <th className="py-3 px-4 text-gray-600 text-center">유형</th>
            <th className="py-3 px-4 text-gray-600">제목</th>
            <th className="py-3 px-4 text-gray-600 text-center">모집기간</th>
            <th className="py-3 px-4 text-gray-600 text-center">상태</th>
            <th className="py-3 px-4 text-gray-600"> </th>
          </tr>
        </thead>
        <tbody>
          {calendarList.map(({ id, recruitType, title, startAt, endAt, recruitStatus }) => (
            <tr key={id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-4 px-4 whitespace-nowrap font-pretendard font-normal text-[16px] leading-[100%] tracking-[0] text-center text-[#9c9c9c]"> {recruitTypeMap[recruitType] || recruitType}</td>
              <td className="py-4 px-4 text-gray-900">{title}</td>
              <td className="py-4 px-4 whitespace-nowrap font-pretendard font-normal text-[16px] leading-[100%] tracking-[0] text-center text-[#9c9c9c]">{startAt} ~ {endAt}</td>
              <td className={`py-4 px-4 whitespace-nowrap font-pretendard font-normal text-[16px] leading-[100%] tracking-[0] text-center text-[#9c9c9c]`}>
                {recruitStatus}
              </td>
              <td className="py-4 px-4 text-gray-400 cursor-pointer hover:text-gray-700 text-right relative" onClick={()=>setIsOpenOption((prev)=>(prev === id? null : id))}>
                {isOpenOption === id &&(
                  <div className="border-[1px] border-[#D6D6D6] shadow-[0_2px_4px_0_rgba(0,0,0,0.15)] w-[117px] h-[75px] absolute top-10 right-2 m-0  rounded-xs bg-white cursor-pointer">
                  <p
                    className="flex items-center text-[#a7a7a7] justify-between font-pretendard text-[16px] font-normal leading-none tracking-[0%] pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer"
                    onClick={()=>modifyCalendar(id)}
                  >
                    수정하기 <PencilLine size={15} color="#a7a7a7" className="ml-1" />
                  </p>
                  <Divider className="w-full" />
                  <p
                    className="flex items-center text-[#fd3c56] justify-between font-pretendard text-[16px] font-normal leading-none tracking-[0%] pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer"
                    onClick={()=>openModal(id)}
                  >
                    삭제하기 <Trash2 size={15} color="#fd3c56" className="ml-1" />
                  </p>
                
                </div>)}
                ⋮
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end mt-4">
<Button className="rounded-[5px] text-[15px] cursor-pointer" onClick={()=>{
  setIsOpenWriteContent(true);
  setIsEditMode(false);
  // 새 등록 시 폼 초기화
  setTitle("");
  setApplyLink("");
  setStartDate(new Date());
  setEndDate(new Date());
  setStartTime("00:00");
  setEndTime("00:00");
  setRecruitType("");
}}><PencilLine size={15} color="white" className="ml-1" />등록하기</Button>
</div>
      <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={totalPages}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center mt-5 list-none gap-[3px]"
          pageLinkClassName="px-3 py-2 border border-gray-200  text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          activeLinkClassName="px-3 py-2 bg-primary text-white border border-primary rounded hover:bg-primary hover:text-white"
          previousLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          nextLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          disabledLinkClassName="text-gray-400 cursor-not-allowed"
        />
      </div>
             {isOpenModal&&(<Modal isOpen={isOpenModal} message={modalMessage} onConfirm={confrimModal} onClose={closeModal} showConfirmButton={true}/>)}
       {isOpenModal2&&(<Modal isOpen={isOpenModal2} message={modalMessage} onClose={closeModal2} closeText="확인" />)}
       {isLinkedModal&&(
         <Modal 
           isOpen={isLinkedModal} 
           message={modalMessage} 
           onConfirm={handleViewRecruitPost} 
           onCancel={handleUnlinkCalendar}
           onClose={closeLinkedModal} 
           showConfirmButton={true}
           confirmText="모집글 보러가기"
           cancelText="연동 끊기"
         />
       )}
      {isOpenWriteContent && (
   <div
   className="fixed flex inset-0 bg-black/50 z-50 justify-center items-center"
  
 >
  <div
          className={`fixed z-100  bg-white rounded-lg shadow-lg p-5 flex flex-col justify-center items-center text-left font-[Noto Sans KR] ${
        'w-[80%] max-w-[852px] h-[620px] text-sm' 
          }`}
          role="dialog"
          aria-modal="true"
        >
          {isEditMode&&calendarData?.isCalendarLinked?<div className="mb-10 font-pretendard font-semibold text-[24px] leading-[125%] tracking-[0]"
            >연동된 모집글</div>:""}
          <div className="w-[80%]">
         <h2 className="text-lg font-semibold mb-2 mt-[20px] w-full">제목</h2>
     {isEditMode && calendarData?.isCalendarLinked ? (
       <div className="flex items-center bg-gray-50 font-pretendard font-normal text-[16px] leading-[100%] tracking-[0%]">
         {title}
       </div>
     ) : (
       <Input className="h-[55px] w-full" placeholder="모집글 제목" value={title} onChange={handleTitleChange}/>
     )}
   
    {isErrorTitle ? (
            <div className="mt-2 flex h-3">
              <img src="/images/admin/warning-icon.png" className="w-4 h-4 mr-0.5" />
              <span className="text-[#fd3c56] text-[13px] font-light">{ErrorTitleMessage}</span>
            </div>
          ) : (
            ''
          )}

    <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            모집유형
          </p>
                                           <div className="bg-white mt-2 ">
              {isEditMode && calendarData?.isCalendarLinked ? (
                <div className="flex items-center bg-gray-50 mt-3 font-pretendard font-normal text-[16px] leading-[100%] tracking-[0%]">
                  {recruitType === 'REGULAR' ? '정규모집' : 
                   recruitType === 'ADDITIONAL' ? '추가모집' : 
                   recruitType === 'ALWAYS' ? '상시모집' : ''}
                </div>
              ) : (
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
                         // setIsErrorType(false);
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
                         // setIsErrorType(false);
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
             )}


            {isErrorType ? (
              <div className="mt-2 flex h-3">
                <img src="/images/admin/warning-icon.png" className="w-4 h-4 mr-0.5" />
                <span className="text-[#fd3c56] text-[13px] font-light">{ErrorTypeMessage}</span>
              </div>
            ) : (
              ''
            )}
    <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-black mt-8">
            모집기간
          </p>

                                           {recruitType !== 'ALWAYS' && (
              <div className="flex items-center w-full max-w-full mt-4 flex-wrap gap-x-4 gap-y-2">
                {isEditMode && calendarData?.isCalendarLinked ? (
                  <div className="flex items-center bg-gray-50 font-pretendard font-normal text-[16px] leading-[100%] tracking-[0%]">
                    {formatDate(startDate)} {startTime} ~ {formatDate(endDate)} {endTime}
                  </div>
                ) : (
                 <>
                   {/* 시작 날짜+시간 */}
                   <div className="relative flex items-center">
                     <input
                       type="text"
                       readOnly
                       value={formatDate(startDate)}
                       className="w-[150px] h-[55px] rounded-[5px] bg-white border border-[#d6d6d6] pr-10"
                       placeholder="YYYY-MM-DD"
                     />
                     <img
                       src="/images/admin/calendar.png"
                       className="w-6 h-6 absolute left-30 top-1/2 -translate-y-1/2 cursor-pointer"
                       onClick={handleToggleCalendar}
                     />
                     <input
                       type="time"
                       value={startTime}
                       onChange={(e) => setStartTime(e.target.value)}
                       className="w-[110px] h-[55px] ml-3 rounded-[5px] bg-white border border-[#d6d6d6]"
                       placeholder="00:00"
                     />
                   </div>

                   <p className="mx-4 select-none">~</p>

                   {/* 종료 날짜+시간 */}
                   <div className="relative flex items-center">
                     <input
                       type="text"
                       readOnly
                       value={formatDate(endDate)}
                       className="w-[150px] h-[55px] rounded-[5px] bg-white border border-[#d6d6d6] pr-10"
                       placeholder="YYYY-MM-DD"
                     />
                     <img
                       src="/images/admin/calendar.png"
                       className="w-6 h-6 absolute left-30 top-1/2 -translate-y-1/2 cursor-pointer"
                       onClick={handleToggleEndCalendar}
                     />
                     <input
                       type="time"
                       value={endTime}
                       onChange={(e) => setEndTime(e.target.value)}
                       className="w-[110px] h-[55px] ml-3 rounded-[5px] bg-white border border-[#d6d6d6]"
                       placeholder="00:00"
                     />
                   </div>

                   {/* 달력 컴포넌트는 필요한 위치에 absolute로 띄우기 */}
                   {calendarIsOpen && recruitType !== '상시모집' && (
                     <div className="absolute left-60 p-2 mt-2 z-10 bg-white shadow-md rounded-md border border-gray-300">
                       <MyCalendar date={startDate} onChange={handleStartDateChange} />
                     </div>
                   )}
                   {endCalendarIsOpen && recruitType !== '상시모집' && (
                     <div className="absolute left-60 p-2 mt-2 z-10 bg-white shadow-md rounded-md border border-gray-300">
                       <MyCalendar date={endDate} onChange={handleEndDateChange} />
                     </div>
                   )}
                 </>
               )}
             </div>
           )}

     <h2 className="text-lg font-semibold mb-2 mt-8 w-full">관련링크 (선택)</h2>
   {isEditMode && calendarData?.isCalendarLinked ? (
     <div className="flex items-center bg-gray-50 font-pretendard font-normal text-[16px] leading-[100%] tracking-[0%]">
       {applyLink || '링크가 없습니다'}
     </div>
   ) : (
     <Input className="h-[55px] w-full" placeholder="구글폼, 지원 가능한 링크 등" value={applyLink} onChange={handleApplyLinkChange}/>
   )}
   

          </div>

             <div className="mt-10 flex justify-center space-x-2">
       <Button onClick={handleSubmitButton} className="h-[55px] w-[40%] text-[16px]">
         {isEditMode ? '수정' : '등록'}
       </Button>
         <Button variant="outline" onClick={cancelWriteButton} className="text-[16px] h-[55px] w-[40%]">
           {isEditMode ? '취소' : '취소'}
         </Button>
       
       </div>
      </div>
    </div>
    </div>
)}

    
    </>
  )
}
