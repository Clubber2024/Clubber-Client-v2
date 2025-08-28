import HashTag from '@/components/features/hashtag/HashTag';
import Banner from '@/components/features/main/Banner';
import MainCalendar from '@/components/features/main/MainCalendar';
import MainRanking from '@/components/features/main/MainRanking';
import MainRecruitList from '@/components/features/main/MainRecruitList';
import QuickServices from '@/components/features/main/QuickServices';
import GoToNotion from '@/components/features/main/GoToNotion';
import MainNotice from '@/components/features/main/MainNotice';
import MainFaq from '@/components/features/main/MainFaq';
import Link from 'next/link';

export default function MainPage() {
  return (
    <div>
      <HashTag />

      {/* 모바일: 캘린더 먼저, 그 다음 자주 찾는 서비스 */}
      <div className="md:hidden flex flex-col gap-4 mt-4">
        <Banner />
        <MainCalendar />
        <QuickServices />
      </div>

      {/* 데스크톱: 기존 레이아웃 유지 */}
      <div className="hidden md:flex flex-row gap-6 mt-4">
        <div className="flex-2">
          <Banner />
          <QuickServices />
        </div>
        <div className="flex-1">
          <MainCalendar />
        </div>
      </div>

      {/* 모집글 & 조회수 */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-[#F9FAFF] pt-0 md:pt-5 pb-6 md:pb-14 mt-4 md:mt-10">
        <div className="md:max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 px-4 md:px-15">
          <div className="flex-1 md:flex-2">
            <MainRecruitList />
          </div>
          <div className="flex-1">
            <MainRanking />
          </div>
        </div>
      </div>
      {/* 노션 & 공지사항 & 자주 묻는 질문 */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-6 mt-4 md:mt-10">
        <div className="flex-1">
          <GoToNotion />
        </div>
        <div className="flex-1 min-w-0">
          <MainNotice />
        </div>
        <Link href="/community?tab=faq" className="flex-1 min-w-0">
          <MainFaq />
        </Link>
      </div>
    </div>
  );
}
