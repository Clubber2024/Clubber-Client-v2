import { OctagonAlert } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export default function EmptyState({ 
  title, 
  description = "현재 등록된 데이터가 없습니다.", 
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <OctagonAlert className="w-20 h-20 text-black mb-8 stroke-[1.2px]" />
      <div className="text-center">
      
        <p className="font-pretendard font-semibold text-[20px] leading-[100%] tracking-[0] text-[#888888] mb-4">
          {title}
        </p>
        <p className="font-pretendard font-normal text-[16px] leading-[100%] tracking-[0] text-[#AAAAAA]">
          {description}
        </p>
      </div>
    </div>
  );
}
