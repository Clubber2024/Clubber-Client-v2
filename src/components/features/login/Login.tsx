'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Divider from '@/components/ui/divider';
import UserLogin from './UserLogin';
import AdminLogin from './AdminLogin';

export default function Login() {
  const [isUser, setIsUser] = useState<boolean>(true);
  return (
    <div>
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <Divider />
      </div>
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
          <div className="mt-5">
            <Button
              className="w-[150px] mr-0.5"
              variant={isUser ? 'default' : 'outline'}
              onClick={() => setIsUser(true)}
            >
              회원
            </Button>
            <Button
              className="w-[150px] ml-0.5"
              variant={isUser ? 'outline' : 'default'}
              onClick={() => setIsUser(false)}
            >
              관리자
            </Button>
          </div>
          {isUser ? <UserLogin /> : <AdminLogin />}
        </div>
      </div>
    </div>
  );
}
