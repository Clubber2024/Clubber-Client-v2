'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { adminLoginHandler } from './login';
import Modal from '@/app/modal/Modal';

export default function AdminLogin() {
  const router = useRouter();
  const [idRemember, setIdRemember] = useState(false);
  const [adminId, setAdminId] = useState<string>('');
  const [adminPw, setAdminPw] = useState<string>('');
  const [isId, setIsId] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  const saveAdminId = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAdminId(value);
    setIsId(true);
    console.log(value);

    if (value === '') {
      setIsId(false);
    }
  };
  const saveAdminPw = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAdminPw(value);
    setIsPw(true);

    if (value === '') {
      setIsPw(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => event.preventDefault();

  const handleLoginSubmit = async () => {
    try {
      const res = await adminLoginHandler({ adminId, adminPw });
      console.log('res', res);
      if (res.success) {
        const { accessToken, refreshToken } = res.data;

        console.log('AccessToken:', accessToken);
        console.log('RefreshToken:', refreshToken);

        // 예: localStorage 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        console.log('res', res.data);

        // 라우팅 또는 상태 업데이트 등 수행
        router.push('/');
      } else {
        setModalMessage('아이디 또는 비밀번호를 확인해주세요.');
        setIsModalOpen(true);
        setAdminPw('');
      }
    } catch (err: any) {
      setModalMessage('아이디 또는 비밀번호를 확인해주세요.');
      setIsModalOpen(true);
      setAdminPw('');
    }
  };

  return (
    <div className="w-[300px] mt-[30px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginSubmit();
        }}
      >
        <p
          className="font-[Pretendard] font-semibold text-[14px] leading-[120%] tracking-[0px]
mb-[9px]"
        >
          아이디
        </p>
        <Input
          type="text"
          placeholder="아이디를 입력하세요."
          autoComplete="current-id"
          value={adminId}
          onChange={saveAdminId}
          className="mb-[19px] h-[40px]"
        />
        <p
          className="font-[Pretendard] font-semibold text-[14px] leading-[120%] tracking-[0px]
mb-[9px]"
        >
          비밀번호
        </p>
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요."
          autoComplete="current-password"
          value={adminPw}
          onChange={saveAdminPw}
          className="h-[40px]"
        />
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
        <Button type="submit" onClick={handleLoginSubmit} className="w-[300px] h-[40px] mt-2">
          관리자 로그인
        </Button>
      </form>
      <div className="text-center">
        <Link
          href="/findId"
          className="font-pretendard font-normal text-[10px] leading-[100%] cursor-pointer hover:text-primary"
        >
          아이디 찾기
        </Link>
        <span className="font-pretendard font-normal text-[10px] leading-[100%] ml-1 mr-1">|</span>
        <Link
          href="/findPw"
          className="font-pretendard font-normal text-[10px] leading-[100%] cursor-pointer hover:text-primary"
        >
          비밀번호 찾기
        </Link>
        <span className="font-pretendard font-normal text-[10px] leading-[100%] ml-1 mr-1">|</span>
        <Link
          href="/signup"
          className="font-pretendard font-normal text-[10px] leading-[100%] cursor-pointer hover:text-primary"
        >
          회원가입
        </Link>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
