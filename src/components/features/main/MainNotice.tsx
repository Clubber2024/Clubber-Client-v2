import Image from 'next/image';

export default function MainNotice() {
  const notices = [
    '해시태그 기반 검색 오류 해결 안내',
    '클러버 서비스 이용약관 개정 안내',
    '동아리 모집글 작성 가이드 업데이트',
    '시스템 점검 안내 (2024.01.15)',
  ];

  return (
    <div className="bg-white rounded-2xl px-4 h-full">
      <h3 className="text-[16px] md:text-lg font-bold text-gray-900 mb-6">공지사항</h3>

      <div className="space-y-4">
        {notices.map((notice, index) => (
          <div key={index}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F4F4] rounded-sm flex items-center justify-center flex-shrink-0">
                <Image src="/images/main-notice.png" alt="main-notice" width={15} height={15} />
              </div>
              <span className="text-[13px] md:text-sm text-gray-700 flex-1 hover:text-primary transition-colors">
                {notice}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 py-2.5 md:py-3 w-full border border-[#808080] rounded-lg text-[13px] md:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        공지사항 더보기
      </button>
    </div>
  );
}
