import Image from 'next/image';

export default function MainFaq() {
  const faqs = [
    '해시태그 기반 검색 오류 해결 안내',
    '동아리 가입 신청 방법은 어떻게 되나요?',
    '모집글 작성 시 주의사항은 무엇인가요?',
    '계정 정보 변경은 어디서 할 수 있나요?',
  ];

  return (
    <div className="bg-white rounded-2xl px-4 h-full">
      <h3 className="text-[16px] md:text-lg font-bold text-gray-900 mb-6">자주 묻는 질문</h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="p-2 bg-[#F4F4F4] rounded-sm flex items-center justify-center flex-shrink-0">
              <Image src="/images/main-faq.png" alt="main-faq" width={14} height={14} />
            </div>
            <span className="text-[13px] md:text-sm text-gray-700 flex-1 hover:text-primary transition-colors">
              {faq}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-5.5 py-2.5 md:py-3 w-full border border-[#808080] rounded-lg text-[13px] md:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        자주 묻는 질문 더보기
      </button>
    </div>
  );
}
