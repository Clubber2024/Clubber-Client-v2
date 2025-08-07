import RecruitContent from '@/components/features/admin/recruit/RecruitContent';
import { Suspense } from 'react';

export default function RecruitContentPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <RecruitContent />
      </Suspense>
    </>
  );
}
