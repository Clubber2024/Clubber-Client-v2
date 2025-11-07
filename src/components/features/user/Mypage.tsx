'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Mypage() {
  const router = useRouter();

  const onClickReview = () => {
    router.push('/mypage/reviews');
  };

  return (
    <>
      <div className="flex flex-col items-center relative h-[800px] pb-32 pt-0">
        <img
          src={'/images/admin/admin-union.png'}
          alt="샘플 이미지"
          className="w-screen h-[400px] object-cover max-w-none -mx-4"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-[Pretendard] font-semibold text-[40px] leading-[100%] tracking-[0]  flex justify-center items-center flex-col">
          <p className="mb-[20px]">마이페이지</p>
          <div className="flex flex-col justify-center items-center mt-[70px]">
            <img
              src={'/images/admin/admin-profile-img.png'}
              alt="profile"
              className="w-[135px] h-[135px]  z-10 absolute top-25"
            />
            <Card className="w-[380px] h-[450px] z-1 mt-[50px] flex items-center pt-20">
              <Button
                variant={'outline'}
                className="w-[210px] h-[40px]"
                onClick={() => router.push('/bookmark')}
              >
                나의 즐겨찾기
              </Button>
              <Button variant={'outline'} className="w-[210px] h-[40px]" onClick={onClickReview}>
                내가 쓴 리뷰
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
