'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [idRemember, setIdRemember] = useState(false);

  // 페이지가 로드될 때 저장된 아이디 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('adminId');
    if (savedId) {
      setAdminId(savedId);
      setIdRemember(true);
    }
  }, []);

  const handleLogin = () => {
    if (idRemember) {
      localStorage.setItem('adminId', adminId); // 아이디 저장
    } else {
      localStorage.removeItem('adminId'); // 체크 안 하면 저장 삭제
    }
  };

  return (
    <div className="w-[300px] mt-[30px]">
      <p
        className="font-[Pretendard] font-semibold text-[14px] leading-[120%] tracking-[0px]
mb-[9px]"
      >
        아이디
      </p>
      <Input type="text" placeholder="아이디를 입력하세요." className="mb-[19px] h-[40px]" />
      <p
        className="font-[Pretendard] font-semibold text-[14px] leading-[120%] tracking-[0px]
mb-[9px]"
      >
        비밀번호
      </p>
      <Input type="password" placeholder="비밀번호를 입력하세요." className="h-[40px]" />
      <label className="flex items-center space-x-2 cursor-pointer mt-1.5">
        <input
          type="checkbox"
          className="peer hidden"
          checked={idRemember}
          onChange={(e) => setIdRemember(e.target.checked)}
        />
        <img
          src={'/images/login/Icon.png'}
          className={`border rounded-[3px] w-[15px] h-[15px] p-0.5 active: scale-95 transition ${idRemember ? 'border-primary bg-primary' : ''}
				`}
        />
        <span className="font-[Pretendard] font-medium text-[12px] leading-[120%] ">
          아이디 저장
        </span>
      </label>
      <Button className="w-[300px] h-[40px] mt-2">관리자 로그인</Button>
      <div className="text-center">
        <span className="font-pretendard font-normal text-[10px] leading-[100%] cursor-pointer hover:text-primary">
          아이디 찾기
        </span>
        <span className="font-pretendard font-normal text-[10px] leading-[100%] ml-1 mr-1">|</span>
        <span className="font-pretendard font-normal text-[10px] leading-[100%] cursor-pointer hover:text-primary">
          비밀번호 찾기
        </span>
        <span className="font-pretendard font-normal text-[10px] leading-[100%] ml-1 mr-1">|</span>
        <Link
          href="/signup"
          className="font-pretendard font-normal text-[10px] leading-[100%] cursor-pointer hover:text-primary"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
