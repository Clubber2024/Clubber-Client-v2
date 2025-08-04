'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import UserLogin from './UserLogin';
import AdminLogin from './AdminLogin';
import { useRouter } from 'next/navigation';
import { customAxios } from '@/lib/customAxios';

export default function Login() {
  const router = useRouter();
  const [isUser, setIsUser] = useState<boolean>(true);
  const [activeForm, setActiveForm] = useState('sign-in-form-active');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (accessToken) {
      // 이미 로그인된 상태면 메인 페이지로 이동
      router.push('/');
    }
  });

  return (
    <div
      className="flex flex-col
			 justify-center items-center"
    >
      <div
        className="shadow-sm w-[460px] h-[418px] rounded-[25px] flex flex-col
			 justify-center items-center mt-20"
      >
        <h1 className="font-bold text-[34px] leading-[100%] tracking-normal text-center font-pretendard">
          로그인
        </h1>
        <div className="mt-[20px]">
          <Button
            className="w-[150px]"
            variant={isUser ? 'default' : 'outline'}
            onClick={() => setIsUser(true)}
          >
            회원
          </Button>
          <Button
            className="w-[150px]"
            variant={isUser ? 'outline' : 'default'}
            onClick={() => setIsUser(false)}
          >
            관리자
          </Button>
        </div>
        {isUser ? <UserLogin /> : <AdminLogin />}
      </div>
    </div>
  );
}
