'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import EmptyState from '@/components/ui/empty-state';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { getClubRecruitList, getRecruitList } from './api/recruit';

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

export default function RecruitList({clubId}:{clubId:string}) {
  const router = useRouter();
  const [recruitList, setRecruitList] = useState<RecruitListProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(8); // 한 페이지에 표시할 항목 수 (2행 4열)
  const [sort] = useState('desc'); // 정렬 기준

  const fetchData = async () => {
    // TODO: 일반 사용자용 모집글 조회 API 호출
    const res = await getRecruitList(currentPage, pageSize);
    console.log(res);
    setRecruitList(res.content);
    setTotalPages(res.totalPages);
  };

  const fetchClubData = async () => {
    const res = await getClubRecruitList(parseInt(clubId));
    console.log(res);
    setRecruitList(res.content);
    setTotalPages(res.totalPages);
  }

  useEffect(() => {
    if(clubId){
    fetchClubData();
    } else{
      fetchData();
    }
  }, [currentPage]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <>
      <div className="flex justify-center mt-15 mb-20 ">
        <p className="font-[Pretendard Variable] font-semibold text-[30px] leading-[100%] tracking-[0%] text-center">
          모집글
        </p>
        </div>
      <div className="mt-10 mb-10">
        {recruitList && recruitList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
              {recruitList.map((item) => (
                <Card
                  key={item.recruitId}
                  className="mb-6 h-[150px] sm:h-[200px] pl-4 sm:pl-[20px] pr-4 sm:pr-[20px] pt-4 sm:pt-5 pb-4 sm:pb-5 flex flex-row justify-between cursor-pointer"
                >
                  <div
                    onClick={() => router.push(`/recruitContent?recruitId=${item.recruitId}`)}
                    className="flex flex-row justify-between cursor-pointer w-full"
                  >
                    {item.imageUrl && (
                      <img src={item.imageUrl} className="w-[130px] sm:w-fit sm:min-w-[170px] aspect-square mr-2" />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-[#202123] mb-[15px] truncate whitespace-nowrap overflow-hidden w-full max-w-full cursor-pointer">
                        {item.title}
                      </p>
                      <p className="cursor-pointer font-pretendard font-normal text-[16px] leading-[1] tracking-[0] text-[#888888] line-clamp-2 break-all w-full max-w-full overflow-hidden">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <ReactPaginate
              previousLabel="<"
              nextLabel=">"
              pageCount={totalPages}
              onPageChange={handlePageChange}
              containerClassName="flex justify-center mt-5 list-none gap-[3px]"
              pageLinkClassName="px-3 py-2 border border-gray-200 text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
              activeLinkClassName="px-3 py-2 bg-primary text-white border border-primary rounded hover:bg-primary hover:text-white"
              previousLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
              nextLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
              disabledLinkClassName="text-gray-400 cursor-not-allowed"
            />
          </>
                 ) : (
           <EmptyState 
             title="모집글이 없습니다."
             description="현재 등록된 모집글이 없습니다."
           />
         )}
      </div>
    </>
  );
}