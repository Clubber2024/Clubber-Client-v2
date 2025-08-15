'use client';

import { ChevronDown, House, Search, X, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HashTagBar from '@/components/features/hashtag/HashTagBar';
import { getAccessToken } from '@/auth/AuthService';
import SearchBar from '../features/search/SearchBar';
import { useEffect, useState } from 'react';
import { getAdminsMe } from './api/header';
import { Button } from '../ui/button';
import Divider from '../ui/divider';
import Modal from '@/app/modal/Modal';
import { getIsAdmin } from '@/auth/AuthService';
import { getUserInfo } from '../features/login/api/kakaoLogin';
import { User } from '@/types/login/kakaoLoginData';
import { kakaoLogout, removeTokens } from '../features/login/api/kakaoLogin';
// import { adminsLogout } from '../features/login/api/login';

interface AdminMeProps {
  username: string;
  email: string;
  contact: string;
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isAdmin = getIsAdmin();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setIsAnimating(true);
  };

  const handleSearchClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsSearchOpen(false);
    }, 300); // 애니메이션 완료 후 컴포넌트 제거
  };
  const router = useRouter();

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminMe, setAdminMe] = useState<AdminMeProps>();
  const [user, setUser] = useState<User>();
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
    if (isAdmin) {
      fetchAdminMe();
    } else {
      fetchUserInfo();
    }

    setIsOpenToggle(false);
  }, [accessToken, isAdmin]);

  const handleAdminLogOut = () => {
    fetchLogoutAdmin();
    setIsOpenToggle(false);
    setAccessToken(null);
    setAdminMe(undefined);
    removeTokens();
    setModalMessage('로그아웃 되었습니다.');
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleUserLogOut = async () => {
    try {
      await kakaoLogout();
      setIsOpenToggle(false);
      setAccessToken(null);
      setUser(undefined);
      removeTokens();

      setModalMessage('로그아웃 되었습니다.');
      setIsOpenModal(true);
   

      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('로그아웃 오류:', error);
      setAccessToken(null);
      setUser(undefined);
      removeTokens();
      setModalMessage('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsOpenModal(true);
    }
  };

  const closeModal = () => {
    setIsOpenModal(false);
    router.push('/');
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

  const fetchUserInfo = async () => {
    const res = await getUserInfo();
    setUser(res.data);

    window.dispatchEvent(new Event('storage'));
  };

  const fetchLogoutAdmin = async () => {
    // const res = await adminsLogout();
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
              <div
                className="flex flex-row items-center cursor-pointer"
                onClick={() => setIsOpenToggle((prev) => !prev)}
              >
                {isAdmin ? (
                  <div className='flex flex-row justify-center items-center'>
                    {adminMe?.username}님 <ChevronDown size={12} />
                  </div>
                ) : (
                  <div className="flex flex-row items-center cursor-pointer">
                    MY <ChevronDown size={12} className="ml-1" />
                  </div>
                )}
              </div>
              {isOpenToggle ? (
                <div className="w-[276px] h-[138px] border border-[#E3E3E3] rounded-[10px] shadow-[0px_0px_5px_0px_#0000001A] bg-white  absolute right-1 z-1000 pl-7 pr-7 flex items-center flex-col">
                  {' '}
                  <div className="flex flex-row items-center justify-between h-[100px] w-full">
                    <UserRound size={50} strokeWidth={1} />
                    <div className="flex flex-col font-[Pretendard] font-normal text-[14px] leading-[100%] tracking-[0%] items-end mt-2">
                      {adminMe ? <div>{adminMe.email}</div> : <div>{user?.email}</div>}
                      <Button
                        variant="outline"
                        onClick={isAdmin ? handleAdminLogOut : handleUserLogOut}
                        className="rounded-10 w-[64px] h-[25px] mt-3 font-normal cursor-pointer"
                      >
                        로그아웃
                      </Button>
                    </div>
                  </div>
                  <Divider className="w-[276px]" />
                  {isAdmin ? (
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
                  ) : (
                    <div>
                      <Link
                        // 일반 회원 마이페이지로 링크 수정
                        href="/mypage"
                        onClick={() => setIsOpenToggle(false)}
                        className="h-[38px] flex flex-row w-full justify-center items-center font-medium text-[12px] leading-[100%] text-center cursor-pointer"
                      >
                        {' '}
                        <House size={20} className="mr-1" strokeWidth={1} />
                        마이페이지
                      </Link>
                    </div>
                  )}
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
          <span className="mb-0.5">|</span>
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
            <Link href={'/center'}>중앙 동아리</Link>
            <Link href="/">자치 기구</Link>
            <Link href="/college">단과대</Link>
          </nav>
        </div>
        {/* 우측: 검색 버튼 */}
        <button
          onClick={isSearchOpen ? handleSearchClose : handleSearchClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {!isSearchOpen && <Search size={25} strokeWidth={2} color="var(--primary)" />}
        </button>
      </div>
      {/* 해시태그 바 - 메인페이지와 로그인페이지가 아닐 때만 표시 */}
      {!isMainPage && !isLoginPage && <HashTagBar />}

      {/* 검색 드롭다운 */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50">
          {/* 배경 오버레이 */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isAnimating ? 'bg-opacity-30' : 'bg-opacity-0'
            }`}
            onClick={handleSearchClose}
          />

          {/* 검색 드롭다운 */}
          <div
            className={`absolute top-29 right-6 bg-white rounded-2xl shadow-lg w-96 pt-4 pb-40 transition-all duration-300 ${
              isAnimating ? 'search-dropdown-enter' : 'search-dropdown-exit'
            }`}
            style={{
              right: `calc(50% - min(32rem, 50vw - 1.5rem))`,
            }}
          >
            {/* 닫기 버튼 */}
            <div className="absolute top-[-40px] right-1">
              <button
                onClick={handleSearchClose}
                className="text-white hover:text-gray-700 transition-colors"
              >
                <X size={35} strokeWidth={1} />
              </button>
            </div>

            {/* 검색 컴포넌트 */}
            <SearchBar onClose={handleSearchClose} />
          </div>
        </div>
      )}
      {isOpenModal && <Modal isOpen={isOpenModal} message={modalMessage} onClose={closeModal} />}
    </header>
  );
}
