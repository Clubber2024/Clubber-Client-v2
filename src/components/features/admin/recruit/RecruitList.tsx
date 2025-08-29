'use client';

import { getAccessToken } from '@/auth/AuthService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { deleteAdminRecruit, getAdminRecruit } from './api/recruit';
import { Divide, EllipsisVertical, PencilLine, Trash2 } from 'lucide-react';
import Divider from '@/components/ui/divider';
import Modal from '@/app/modal/Modal';

interface RecruitListProps {
  recruitId: number;
  title: string;
  recruitType: string;
  statAt: string;
  endAt: string;
  content: string;
  applyLink: string;
  imageUrl: string;
}

export default function RecruitList() {
  const router = useRouter();
  const [recruitList, setRecruitList] = useState<RecruitListProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(6); // 한 페이지에 표시할 항목 수
  const [sort] = useState('desc'); // 정렬 기준
  const [openToggle, setOpenToggle] = useState(false);
  const [openToggleId, setOpenToggleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mdoalmessage, setModalMessage] = useState('');
  
  const fetchData = async () => {
    const res = await getAdminRecruit(currentPage, pageSize);
    console.log(res.content);
    setRecruitList(res.content);
    setTotalPages(res.totalPages);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleDeleteRecruit = async (recruitId: number) => {
    const res = await deleteAdminRecruit(recruitId);
    console.log('res', res);

    if (res.success) {
      setIsModalOpen(true);
      setModalMessage('해당 모집글 삭제가 완료되었습니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <>
      <TitleDiv>
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] ml-[10px]">
          나의 모집글
        </p>
      </TitleDiv>
      <div className="mx-2 sm:mx-[10%] mt-10 mb-10">
        {recruitList?.map((item) => (
          <Card
            key={item.recruitId}
            className="mb-6 h-[150px] sm:h-[200px] pl-4 sm:pl-[20px] pr-4 sm:pr-[20px] pt-4 sm:pt-5 pb-4 sm:pb-5 flex flex-row justify-between cursor-pointer"
          >
            <div
             
              className="flex flex-row justify-between cursor-pointer w-full"
            >
          
              {item.imageUrl && (
                <img src={item.imageUrl} className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] aspect-square mr-2 my-auto" />
              )}
              <div className="flex-1 min-w-0 flex flex-col h-full mx-1 my-2" onClick={() => router.push(`/admin/recruitContent?recruitId=${item.recruitId}`)}>
                <p className=" font-semibold text-[18px] leading-[100%] tracking-[0] text-[#202123] mb-[15px] truncate cursor-pointer w-full max-w-full overflow-hidden whitespace-nowrap">
                  {item.title}
                </p>
                <p className="cursor-pointer font-normal text-[16px] leading-[120%] tracking-[0] text-[#888888] line-clamp-4 md:line-clamp-5 break-all w-full max-w-full overflow-hidden">
                  {item.content}
                </p>
              </div>
              
              <div className="relative w-fit h-fit">
              <EllipsisVertical
                size={18}
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 방지
                  setOpenToggleId((prev) => (prev === item.recruitId ? null : item.recruitId));
                }}
              />
              {openToggleId === item.recruitId && (
                <div className="border-[1px] border-[#D6D6D6] shadow-[0_2px_4px_0_rgba(0,0,0,0.15)] w-[117px] h-[75px] absolute top-5 right-0 sm:left-0 m-0  rounded-xs bg-white cursor-pointer">
                  <p
                    className="flex items-center text-[#a7a7a7] justify-between font-pretendard text-[16px] font-normal leading-none tracking-[0%] pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer"
                    onClick={() => router.push(`/admin/recruitWrite?recruitId=${item.recruitId}`)}
                  >
                    수정하기 <PencilLine size={15} color="#a7a7a7" className="ml-1" />
                  </p>
                  <Divider className="w-full" />
                  <p
                    className="flex items-center text-[#fd3c56] justify-between font-pretendard text-[16px] font-normal leading-none tracking-[0%] pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer"
                    onClick={() => handleDeleteRecruit(item.recruitId)}
                  >
                    삭제하기 <Trash2 size={15} color="#fd3c56" className="ml-1" />
                  </p>
                </div>
              )}
            </div>
            </div>
          
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            className="rounded-[3px] h-[38px] sm:h-[41px] w-[100px] sm:w-fit"
            onClick={() => router.push(`/admin/recruitWrite`)}
          >
            <img src={'/images/admin/edit-2.png'} className="w-[19px] h-[19px]" />
            글쓰기
          </Button>
        </div>

        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={totalPages}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center mt-6 list-none gap-[3px] sm:gap-0"
          pageLinkClassName="px-3 py-2 border border-gray-200  text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          activeLinkClassName="px-3 py-2 bg-primary text-white border border-primary rounded hover:bg-primary hover:text-white"
          previousLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          nextLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          disabledLinkClassName="text-gray-400 cursor-not-allowed"
        />
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen} message={mdoalmessage} onClose={closeModal} />}
    </>
  );
}
