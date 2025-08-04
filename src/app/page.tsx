import HashTag from '@/components/features/hashtag/HashTag';
import Banner from '@/components/features/main/Banner';
import MainCalendar from '@/components/features/main/MainCalendar';
import MainRanking from '@/components/features/main/MainRanking';
import MainRecruitList from '@/components/features/main/MainRecruitList';
import QuickServices from '@/components/features/main/QuickServices';
import GoToNotion from '@/components/features/main/GoToNotion';
import MainNotice from '@/components/features/main/MainNotice';
import MainFaq from '@/components/features/main/MainFaq';

export default function MainPage() {
  return (
    <div className="mx-6">
      <HashTag />
      {/* 배너, 자주 찾는 서비스 & 캘린더 */}
      <div className="flex flex-row gap-6">
        <div className="flex-2">
          <Banner />
          <QuickServices />
        </div>
        <div className="flex-1">
          <MainCalendar />
        </div>
      </div>
      {/* 모집글 & 조회수 */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-[#F9FAFF] pt-5 pb-14 mt-10">
        <div className="max-w-6xl mx-auto flex flex-row gap-6 px-15">
          <div className="flex-2">
            <MainRecruitList />
          </div>
          <div className="flex-1">
            <MainRanking />
          </div>
        </div>
      </div>
      {/* 노션 & 공지사항 & 자주 묻는 질문 */}
      <div className="flex flex-row gap-6 mt-10">
        <div className="flex-1">
          <GoToNotion />
        </div>
        <div className="flex-1">
          <MainNotice />
        </div>
        <div className="flex-1">
          <MainFaq />
        </div>
      </div>
    </div>
  );
}
