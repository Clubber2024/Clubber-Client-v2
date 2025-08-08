'use client';

import { ChevronDown, House, Search, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HashTagBar from '@/components/features/hashtag/HashTagBar';
import { getAccessToken } from '@/auth/AuthService';
import { useEffect, useState } from 'react';
import { getAdminsMe } from './api/header';
import { Button } from '../ui/button';
import Divider from '../ui/divider';
import Modal from '@/app/modal/Modal';
import { adminsLogout } from '../features/login/api/login';

interface AdminMeProps {
  username: string;
  email: string;
  contact: any;
}

export default function Header() {
  // const accessToken = getAccessToken();
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const router = useRouter();

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminMe, setAdminMe] = useState<AdminMeProps>();
  const [isOpenToggle, setIsOpenToggle] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token);
    console.log('토큰 가져오기');
  }, []);

  // 만약 로그인 상태가 바뀔 때마다 갱신하고 싶으면 storage 이벤트 사용
  useEffect(() => {
    const onStorageChange = () => setAccessToken(getAccessToken());
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token);
    if (!accessToken) {
      setAdminMe(undefined); // 토큰 없으면 초기화
      return;
    }
    console.log('토큰 가져오기');
    fetchAdminMe();
    setIsOpenToggle(false);
  }, [accessToken]);

  const handleAdminLogOut = () => {
    fetchLogoutAdmin();
  };

  const closeModal = () => {
    setIsOpenModal(false);
    router.refresh();
  };

  //api 관련
  const fetchAdminMe = async () => {
    const res = await getAdminsMe();
    console.log(res.data);

    if (res.success) {
      setAdminMe(res.data);
      // router.refresh();
    }
  };

  const fetchLogoutAdmin = async () => {
    const res = await adminsLogout();
    // console.log(res.data);

    // 상태 즉시 변경 → UI 즉시 반영
    setAccessToken(null);
    setAdminMe(undefined);

    setModalMessage('로그아웃 되었습니다.');
    setIsOpenModal(true);

    // storage 이벤트 발생 → 다른 탭/컴포넌트에서도 갱신
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="w-full bg-white">
      {/* 로그인/공지사항 */}

      <div className="py-1 mb-5 flex w-screen relative left-1/2 right-1/2 -mx-[50vw] text-xs font-medium bg-[#F6F6F6]">
        <div className="flex items-center justify-end gap-1 w-5xl mx-auto">
          {accessToken ? (
            <span className="relative">
              {adminMe ? (
                <div
                  className="flex flex-row items-center cursor-pointer"
                  onClick={() => setIsOpenToggle((prev) => !prev)}
                >
                  {adminMe.username}님 <ChevronDown size={12} />
                </div>
              ) : (
                ''
              )}
              {isOpenToggle ? (
                <div className="w-[276px] h-[138px] border border-[#E3E3E3] rounded-[10px] shadow-[0px_0px_5px_0px_#0000001A] bg-white  absolute right-1 z-1000 pl-7 pr-7 flex items-center flex-col">
                  {' '}
                  <div className="flex flex-row items-center justify-between h-[100px] w-full">
                    <UserRound size={50} strokeWidth={1} />
                    <div className="flex flex-col font-[Pretendard] font-normal text-[14px] leading-[100%] tracking-[0%] items-end mt-2">
                      {adminMe?.email}
                      <Button
                        variant="outline"
                        onClick={handleAdminLogOut}
                        className="rounded-10 w-[64px] h-[25px] mt-3 font-normal cursor-pointer"
                      >
                        로그아웃
                      </Button>
                    </div>
                  </div>
                  <Divider className="w-[276px]" />
                  <div>
                    <Link
                      href="/admin/mypage"
                      onClick={() => setIsOpenToggle(false)}
                      className="h-[38px] flex flex-row w-full justify-center items-center font-medium text-[12px] leading-[100%] text-center cursor-pointer"
                    >
                      {' '}
                      <House size={20} className="mr-1" strokeWidth={1} />
                      마이페이지
                    </Link>
                  </div>
                </div>
              ) : (
                ''
              )}
            </span>
          ) : (
            <div>
              <Link href="/login" className="hover:underline">
                로그인
              </Link>
            </div>
          )}
          <span className="mb-1">|</span>
          <Link href="#" className="hover:underline">
            공지사항
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between h-20 px-6">
        <div className="flex flex-row items-center gap-10">
          {/* 좌측: 로고 */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/clubber-logo.png"
                alt="clubber-logo"
                width={180}
                height={85}
                priority
              />
            </Link>
          </div>
          {/* 중앙: 네비게이션 */}
          <nav className="flex-1 flex justify-center gap-8 text-[19px] font-bold">
            <Link href="/">한눈에 보기</Link>
            <Link href={'/center/branch'}>중앙 동아리</Link>
            <Link href="/">자치 기구</Link>
            <Link href="/">단과대</Link>
          </nav>
        </div>
        {/* 우측: 검색 */}
        <Search size={25} strokeWidth={2} color="var(--primary)" />
      </div>
      {/* 해시태그 바 - 메인페이지와 로그인페이지가 아닐 때만 표시 */}
      {!isMainPage && !isLoginPage && <HashTagBar />}
      {isOpenModal && <Modal isOpen={isOpenModal} message={modalMessage} onClose={closeModal} />}
    </header>
  );
}
