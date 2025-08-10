'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { kakaoLoginWithCode, saveTokens, getUserInfo } from './api/kakaoLogin';
import { useLoginStore } from '../../../stores/login/useLoginStore';

function KakaoRedirectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { login } = useLoginStore();

  const handleKakaoLogin = async (code: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await kakaoLoginWithCode(code);

      // 토큰 로컬 스토리지에 저장
      saveTokens(response.data.accessToken, response.data.refreshToken);

      // Header 컴포넌트에 로그인 상태 변경 알림
      window.dispatchEvent(new Event('storage'));

      // 실제 사용자 정보 가져오기
      try {
        const userInfo = await getUserInfo();

        // 스토어에 로그인 상태 저장
        login(response.data.accessToken, response.data.refreshToken, userInfo);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }

      // 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      // 에러 발생 시 로그인 페이지로 이동
      router.push('/login');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleKakaoLogin(code);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">카카오 로그인 처리중...</p>
      </div>
    </div>
  );
}

export default function KakaoRedirection() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">로딩중...</p>
          </div>
        </div>
      }
    >
      <KakaoRedirectionContent />
    </Suspense>
  );
}
