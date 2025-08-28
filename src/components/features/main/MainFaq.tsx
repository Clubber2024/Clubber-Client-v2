'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getFaqListData } from '../community/api/faq';
import { FaqItem } from '@/types/community/faqData';

export default function MainFaq() {
  const [faqs, setFaqs] = useState<string[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await getFaqListData({ page: 0, size: 10 }); // 충분한 데이터 가져오기
        // API 응답에서 4개만
        const limitedFaqs = response.data.slice(0, 4);
        setFaqs(limitedFaqs.map((faq: FaqItem) => faq.title));
      } catch (error) {
        console.error('FAQ 데이터 로딩 실패:', error);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="bg-white rounded-2xl px-4 h-full flex flex-col">
      <h3 className="text-[16px] md:text-lg font-bold text-gray-900 mb-5">자주 묻는 질문</h3>

      <div className="space-y-3 flex-1">
        {faqs.map((faq, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="p-2 bg-[#F4F4F4] rounded-sm flex items-center justify-center flex-shrink-0 mb-2">
              <Image src="/images/main-faq.png" alt="main-faq" width={18} height={18} />
            </div>
            <span
              className={`text-[13px] md:text-[15px] text-gray-700 flex-1 hover:text-primary transition-colors border-b-[0.5px] border-[#808080] pt-2 pb-4 truncate ${
                index === faqs.length - 1 ? 'border-transparent' : ''
              }`}
            >
              {faq}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-auto py-2.5 md:py-3 w-full border border-[#808080] rounded-[8px] text-[13px] md:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        자주 묻는 질문 더보기
      </button>
    </div>
  );
}
