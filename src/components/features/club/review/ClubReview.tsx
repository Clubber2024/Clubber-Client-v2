import { Card } from '@/components/ui/card';
// import Image from 'next/image';
import ReviewStatics from './ReviewStatics';
import Divider from '@/components/ui/divider';
import ReviewList from './ReviewList';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/login/useLoginStore';
import Image from 'next/image';
export default function ClubReview({ clubId }: { clubId: number }) {
  const router = useRouter();
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  return (
    <Card className="mx-4 md:mx-10">
      {isLoggedIn ? (<div className="mx-4 sm:mx-24">
        <ReviewStatics clubId={clubId} />
        <Divider className="mt-12" />
        <ReviewList clubId={clubId} />
      </div>):(
          <div className="flex items-center justify-center flex-col gap-4 my-12">
            <p className="text-sm font-medium text-gray-600 text-center">🔐 로그인 후 동아리 리뷰를 확인해보세요!<br/>이 동아리에 작성된 모든 리뷰는 로그인 시 열람 가능합니다.</p>
            <Button
          onClick={() => router.push('/login')}
          className="rounded-[5px] w-[288px] xs:w-72 h-11 flex justify-center items-center bg-[#FEE500] hover:bg-[#E6D100] font-medium leading-[150%] transition-colors duration-200"
        >
          <Image src={'/images/login/kakao.png'} alt="login" width={20} height={20} />
          <span className="text-gray-900 text-center ml-3">카카오 로그인/회원가입</span>
        </Button>
        </div>
        
      )}
    </Card>
  );
}
