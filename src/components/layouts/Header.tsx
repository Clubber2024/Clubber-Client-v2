'use client';

import { UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../features/search/SearchBar';

export default function Header() {
  const accessToken = 1;

  return (
    <>
      {/* 헤더 상단 부분 */}
      <div>
        <Link href="/">
          <Image src="/images/clubber_logo.png" alt="clubber-logo" width={20} height={20}></Image>
        </Link>
        <SearchBar />
        <div>
          <UserRound />
          <p>{accessToken ? 'MY' : '로그인'}</p>
        </div>
      </div>

      {/* 해시태그바 */}

      {/* 헤더 네비게이션 */}
      <div></div>
    </>
  );
}
