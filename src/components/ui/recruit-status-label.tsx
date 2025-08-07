import React from 'react';

/*
// 사용예시 //
<RecruitStatusLabel status="open" />
<RecruitStatusLabel status="closed" />
*/

interface RecruitStatusBadgeProps {
  status: 'open' | 'closed'; // 'open'이면 진행 중, 'closed'면 마감
}

const RecruitStatusLabel: React.FC<RecruitStatusBadgeProps> = ({ status }) => {
  const isOpen = status === 'open';
  const label = isOpen ? '진행 중' : '마감';
  const bgColor = isOpen ? 'bg-[#4C9DB5]' : 'bg-[#334A52]';

  return (
    <div className="flex items-center justify-center">
      <div
        className={`text-white text-sm font-medium ${bgColor}`}
        style={{
          width: '76px',
          height: '31px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default RecruitStatusLabel;
