'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMainNotice } from './api/main';

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
    <div className="bg-white rounded-2xl px-4 h-full">
      <h3 className="text-[16px] md:text-lg font-bold text-gray-900 mb-6">공지사항</h3>

      <div className="space-y-2">
        {notices.map((notice) => (
          <div key={notice.noticeId}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F4F4] rounded-sm flex items-center justify-center flex-shrink-0 mb-2">
                <Image src="/images/main-notice.png" alt="main-notice" width={16} height={16} />
              </div>
              <span
                className={`text-[13px] md:text-sm text-gray-700 flex-1 hover:text-primary transition-colors border-b-[0.5px] border-[#808080] pb-3 ${
                  notice.noticeId === 1 ? 'border-transparent' : ''
                }`}
              >
                {notice.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-1 py-2.5 md:py-3 w-full border border-[#808080] rounded-[8px] text-[13px] md:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        공지사항 더보기
      </button>
    </div>
  );
}
