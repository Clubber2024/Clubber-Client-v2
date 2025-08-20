'use client';

import { useRouter } from 'next/navigation';
import BranchHeader from '@/components/common/BranchHeader';
import CollegeList from '@/components/features/branch/CollegeList';
import Modal from '@/components/common/Modal';

export default function CollegePage() {
  const router = useRouter();
  const isModalOpen = true;
  const modalMessage = '소모임 페이지는 준비중입니다.';

  const handleConfirm = () => {
    router.back(); // 이전 화면으로 돌아가기
  };

  return (
    <>
      <BranchHeader mainTitle="단과대" subTitle="단과대" />
      <CollegeList />
      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={handleConfirm}
        onConfirm={() => {}}
        showConfirmButton={false}
      />
    </>
  );
}
