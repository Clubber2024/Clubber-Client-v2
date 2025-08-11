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
        className="w-full h-70 relative mb-14"
        width={1920}
        height={50}
      />
      <div className="absolute inset-0 items-center justify-center">
        <Image
          src={'/images/center/home.png'}
          alt="icon"
          className="absolute top-20 left-37"
          width={15}
          height={15}
        />
        <ChevronRight size={15} className="absolute top-20 left-43 text-white" />
        <p className="absolute top-19 left-48 text-white text-[13px] mt-0.5">{subTitle}</p>
        <h1 className="absolute top-27 left-36 text-3xl text-white font-semibold">{mainTitle}</h1>
      </div>
    </div>
  );
}
