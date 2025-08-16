import Image from 'next/image';

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center bg-white pt-40">
      <div className="relative mb-8">
        <Image src="/images/coming-soon.png" alt="Coming Soon" width={100} height={100} />
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-600 mb-8">
        C O M I N G &nbsp; S O O N
      </h1>

      <div className="text-center text-gray-700 space-y-1">
        <p>이용에 불편을 드려 죄송합니다.</p>
        <p>관련자료 준비중에 있습니다.</p>
        <p>빠른시일 내에 해당 페이지의 정보를 올리겠습니다.</p>
      </div>
    </div>
  );
}
