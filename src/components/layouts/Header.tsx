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
  const [selectedMenu, setSelectedMenu] = useState<
    'summary' | 'center' | 'official' | 'college' | null
  >(null);
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isAdmin = getIsAdmin();

  useEffect(() => {
    if (pathname === '/summary') {
      setSelectedMenu('summary');
    } else if (pathname === '/center') {
      setSelectedMenu('center');
    } else if (pathname === '/official') {
      setSelectedMenu('official');
    } else if (pathname === '/college') {
      setSelectedMenu('college');
    } else {
      setSelectedMenu(null); // 다른 페이지에서는 null
    }
  }, [pathname]);

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
        <div className="flex items-center justify-end gap-1 w-6xl mx-auto px-4">
          {accessToken ? (
            <span className="relative">
              <div
                className="flex flex-row items-center cursor-pointer font-normal"
                onClick={() => setIsOpenToggle((prev) => !prev)}
              >
                {isAdmin ? (
                  <div className="flex flex-row justify-center items-center">
                    <span className="sm:inline">{adminMe?.username}님</span>
                    <ChevronDown size={12} />
                  </div>
                ) : (
                  <div className="flex flex-row items-center cursor-pointer">
                    MY <ChevronDown size={12} className="ml-1" />
                  </div>
                )}
              </div>
              {isOpenToggle ? (
                <div className="w-[276px] h-[138px] border border-[#E3E3E3] rounded-[10px] shadow-[0px_0px_5px_0px_#0000001A] bg-white absolute top-5.5 right-1 z-1000 pl-7 pr-7 flex items-center flex-col">
                  {' '}
                  <div className="flex flex-row items-center justify-between h-[100px] w-full">
                    <UserRound size={50} strokeWidth={1} />
                    <div className="flex flex-col font-normal text-[14px] leading-[100%] tracking-[0%] items-end mt-2">
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
          <span className="md:mb-0.5">|</span>
          <Link href="/community" className="hover:underline">
            공지사항
          </Link>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-20 px-4 md:px-0 pb-4 md:py-0 w-full md:max-w-6xl md:mx-auto">
        {/* 모바일: 로고와 검색바를 가로로 배치 */}
        <div className="md:hidden flex flex-row items-center w-full gap-4">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/clubber-logo.png"
                alt="clubber-logo"
                width={120}
                height={60}
                priority
              />
            </Link>
          </div>

          {/* 검색바 */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5"
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="원하는 동아리를 검색해보세요!"
                className="w-full text-sm pl-10 pr-4 py-2 border-2 border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = e.currentTarget.value.trim();
                    if (searchTerm) {
                      router.push(`/search?clubName=${encodeURIComponent(searchTerm)}`);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 데스크톱: 기존 레이아웃 유지 */}
        <div className="hidden md:flex flex-row items-center gap-10">
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
          <nav className="flex-1 flex justify-center gap-8 text-xl font-bold cursor-pointer">
            <Link
              href="/summary"
              className={`hover:text-primary transition-all duration-300 hover:scale-105 ${
                selectedMenu === 'summary' ? 'text-primary scale-105  ' : ''
              }`}
            >
              한눈에 보기
            </Link>
            <Link
              href={'/center'}
              className={`hover:text-primary transition-all duration-300 hover:scale-105 ${
                selectedMenu === 'center' ? 'text-primary scale-105' : ''
              }`}
            >
              중앙 동아리
            </Link>
            <Link
              href="/official"
              className={`hover:text-primary transition-all duration-300 hover:scale-105 ${
                selectedMenu === 'official' ? 'text-primary scale-105' : ''
              }`}
            >
              공식단체
            </Link>
            <Link
              href="/college"
              className={`hover:text-primary transition-all duration-300 hover:scale-105 ${
                selectedMenu === 'college' ? 'text-primary scale-105' : ''
              }`}
            >
              단과대
            </Link>
          </nav>
        </div>

        {/* 우측: 검색 버튼 (데스크톱만) */}
        <div className="hidden md:block">
          <button
            onClick={isSearchOpen ? handleSearchClose : handleSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {!isSearchOpen && <Search size={25} strokeWidth={2} color="var(--primary)" />}
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <nav className="flex justify-center items-center py-4 space-x-6 min-[376px]:space-x-8 min-[410px]:space-x-9 text-md font-semibold">
          <Link
            href="/summary"
            className={`text-gray-800 hover:text-primary transition-all duration-300 hover:scale-105 ${
              selectedMenu === 'summary' ? 'text-primary scale-105' : ''
            }`}
          >
            한눈에 보기
          </Link>
          <Link
            href="/center"
            className={`text-gray-800 hover:text-primary transition-all duration-300 hover:scale-105 ${
              selectedMenu === 'center' ? 'text-primary scale-105' : ''
            }`}
          >
            중앙동아리
          </Link>
          <Link
            href="/official"
            className={`text-gray-800 hover:text-primary transition-all duration-300 hover:scale-105 ${
              selectedMenu === 'official' ? 'text-primary scale-105' : ''
            }`}
          >
            공식단체
          </Link>
          <Link
            href="/college"
            className={`text-gray-800 hover:text-primary transition-all duration-300 hover:scale-105 ${
              selectedMenu === 'college' ? 'text-primary scale-105' : ''
            }`}
          >
            단과대
          </Link>
        </nav>
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
          <div className="flex max-w-6xl mx-auto justify-end md:pr-17 xl:pr-0">
            <div
              className={`absolute top-29 bg-white rounded-2xl shadow-lg w-96 pt-4 pb-40 transition-all duration-300 ${
                isAnimating ? 'search-dropdown-enter' : 'search-dropdown-exit'
              }`}
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
        </div>
      )}
      {isOpenModal && <Modal isOpen={isOpenModal} message={modalMessage} onClose={closeModal} />}
    </header>
  );
}
