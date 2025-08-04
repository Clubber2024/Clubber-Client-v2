'use client';

import { getAccessToken } from '@/auth/AuthService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TitleDiv from '@/components/ui/title-div';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { getAdminRecruit } from './recruit';

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAdminRecruit(currentPage, pageSize);
      console.log(res.content);
      setRecruitList(res.content);
      setTotalPages(res.totalPages);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  // const onClickRecruit = (recruitId) => {
  //     navigate(`/admin/recruit/${recruitId}`, {
  //         state: { recruitId: recruitId },
  //     });
  // };

  return (
    <>
      <TitleDiv>
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#202123] ml-[10px]">
          나의 모집글
        </p>
      </TitleDiv>
      <div className="ml-[10%] mr-[10%] mt-10 mb-10">
        {recruitList?.map((item) => (
          <Card
            key={item.recruitId}
            className="mb-6 h-[200px] pl-[20px] pr-[20px] flex flex-row justify-between"
          >
            <div className="w-full">
              <p className="font-pretendard font-semibold text-[18px] leading-[100%] tracking-[0] text-[#202123] mb-[15px] truncate">
                {item.title}
              </p>
              <p className="font-pretendard font-normal text-[16px] leading-[1] tracking-[0] text-[#888888] line-clamp-4">
                {item.content}
              </p>
            </div>
            {item.imageUrl && (
              <img src={item.imageUrl} className=" w-fit min-w-[178px] aspect-square" />
            )}
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            className="rounded-[3px] h-[41px]"
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
          containerClassName="flex justify-center mt-5 list-none gap-[3px]"
          pageLinkClassName="px-3 py-2 border border-gray-200  text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          activeLinkClassName="px-3 py-2 bg-primary text-white border border-primary rounded hover:bg-primary hover:text-white"
          previousLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          nextLinkClassName="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded cursor-pointer hover:bg-[#d3e2e6] hover:text-gray-800"
          disabledLinkClassName="text-gray-400 cursor-not-allowed"
        />
      </div>
    </>
  );
}
