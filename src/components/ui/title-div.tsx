'use client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function TitleDiv({ children, className }: DivProps) {
  const router = useRouter();
  return (
    <div className="bg-primary w-screen h-[100px] flex flex-row items-center relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div
        className='w-full max-w-7xl mx-auto flex flex-row items-center sm:px-32 px-4'
      >
      <img
        src={'/images/admin/arrow-narrow-left.png'}
        onClick={() => router.back()}
        className="w-[29px] h-[29px] cursor-pointer mr-2"
      />
      {children}
      </div>
    </div>
  );
}
