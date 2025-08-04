import { cn } from '@/lib/utils';

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function TitleDiv({ children, className }: DivProps) {
  return (
    <div className="bg-primary w-full h-[100px] flex flex-row items-center ">
      <img src={'/images/admin/arrow-narrow-left.png'} className="w-[29px] h-[29px] ml-[20px]" />
      {children}
    </div>
  );
}
