'use client';

import dynamic from 'next/dynamic';

// import RecruitContent from '@/components/features/admin/recruit/RecruitContent';
// import dynamic from 'next/dynamic';

const RecruitContent = dynamic(() => import('@/components/features/admin/recruit/RecruitContent'), {
  ssr: false,
});

export default function RecruitContentPage() {
  return <RecruitContent />;
}
