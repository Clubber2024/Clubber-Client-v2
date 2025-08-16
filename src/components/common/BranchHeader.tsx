import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function BranchHeader({
  mainTitle,
  subTitle,
}: {
  mainTitle: string;
  subTitle: string;
}) {
  return (
    <div
      className="relative w-screen"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
    >
      <Image
        src={'/images/center/Union.png'}
        alt="branch-background"
        className="w-full h-50 md:h-70 relative mb-10 md:mb-14"
        width={1920}
        height={50}
      />
      <div className="w-full md:max-w-7xl mx-auto absolute inset-0 px-4 md:px-8">
        <div className="flex flex-col items-start justify-center h-full pl-10">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={'/images/center/home.png'}
              alt="icon"
              className="w-4 h-4 md:w-5 md:h-5"
              width={15}
              height={15}
            />
            <ChevronRight size={15} className="text-white w-4 h-4 md:w-5 md:h-5" />
            <p className="text-white text-xs md:text-[13px]">{subTitle}</p>
          </div>
          <h1 className="text-2xl md:text-3xl text-white font-semibold">{mainTitle}</h1>
        </div>
      </div>
    </div>
  );
}
