'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMainNotice } from './api/main';
import Link from 'next/link';

interface Notice {
  noticeId: number;
  title: string;
  createdAt: string;
}

export default function MainNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const notices = await getMainNotice();
      setNotices(notices);
    };
    fetchNotices();
  }, []);

  return (
    <div className="bg-white rounded-2xl px-4 h-full flex flex-col">
      <h3 className="text-[16px] md:text-lg font-bold text-gray-900 mb-5">공지사항</h3>

      <div className="space-y-3 flex-1">
        {notices.map((notice) => (
          <div key={notice.noticeId}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#F4F4F4] rounded-sm flex items-center justify-center flex-shrink-0 mb-2">
                <Image src="/images/main-notice.png" alt="main-notice" width={18} height={18} />
              </div>
              <Link
                href={`/community?tab=notices&noticeId=${notice.noticeId}`}
                className={`text-[13px] md:text-[15px] text-gray-700 flex-1 hover:text-primary transition-colors border-b-[0.5px] border-[#808080] pt-2 pb-4 truncate ${
                  notice === notices[notices.length - 1] ? 'border-transparent' : ''
                }`}
              >
                {notice.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Link href="/community?tab=notices">
        <button className="mt-auto py-2.5 md:py-3 w-full border border-[#808080] rounded-[8px] text-[13px] md:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          공지사항 더보기
        </button>
      </Link>
    </div>
  );
}
