import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function TitleDiv({ children, className }: DivProps) {
  const router = useRouter();
  return (
    <div className="bg-primary w-full h-[100px] flex flex-row items-center ">
      <img
        src={'/images/admin/arrow-narrow-left.png'}
        onClick={() => router.back()}
        className="w-[29px] h-[29px] ml-[20px] cursor-pointer"
      />
      {children}
    </div>
  );
}
