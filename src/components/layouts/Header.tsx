'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HashTagBar from '@/components/features/hashtag/HashTagBar';
import { getAccessToken } from '@/auth/AuthService';

export default function Header() {
  const accessToken = getAccessToken();
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const isLoginPage = pathname === '/login';

  return (
    <header className="w-full bg-white">
      {/* 로그인/공지사항 */}
      <div className="py-1 mb-5 flex w-screen relative left-1/2 right-1/2 -mx-[50vw] text-xs font-medium bg-[#F6F6F6]">
        <div className="flex items-center justify-end gap-1 w-5xl mx-auto">
          {accessToken ? (
            <Link href="/admin/mypage">마이페이지</Link>
          ) : (
            <Link href="/login" className="hover:underline">
              로그인
            </Link>
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
    </header>
  );
}
