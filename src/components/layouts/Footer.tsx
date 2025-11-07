'use client';

import { getIsAdmin, getAccessToken } from '@/auth/AuthService';
import { deleteWithdrawal, deleteUserWithdrawal } from '@/components/features/login/api/login';
import { useState, useEffect } from 'react';
import Modal from '@/app/modal/Modal';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    // 초기값을 함수로 설정하여 컴포넌트 마운트 시점에 토큰을 가져옴
    if (typeof window !== 'undefined') {
      return getAccessToken();
    }
    return null;
  });

  // 컴포넌트 마운트 시 관리자 여부와 액세스 토큰 확인
  useEffect(() => {
    const updateUserState = () => {
      const adminStatus = getIsAdmin();
      const token = getAccessToken();
      setIsAdmin(adminStatus);
      setAccessToken(token);
      setIsUser(!adminStatus && !!token); // 관리자가 아니고 토큰이 있으면 일반 사용자
    };

    // 초기 상태 설정
    updateUserState();

    // 로컬스토리지 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'isAdmin') {
        updateUserState();
      }
    };

    // 커스텀 이벤트 리스너 추가 (같은 탭에서의 변경 감지)
    const handleCustomStorageChange = () => {
      updateUserState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageChange);
    };
  }, []);

  const handleWithdrawal = async () => {
    // 토큰이 없으면 로그인이 필요함
    if (!accessToken) {
      setModalMessage('로그인이 필요한 서비스입니다.');
      setIsModalOpen(true);
      return;
    }

    // 확인 모달 표시
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      if (isAdmin) {
        // 관리자 회원탈퇴
        await deleteWithdrawal();
      } else if (isUser) {
        // 일반 사용자 회원탈퇴
        await deleteUserWithdrawal();
      }

      setModalMessage('회원탈퇴가 완료되었습니다.');
      setIsModalOpen(true);

      // 홈페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      setModalMessage('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // 회원탈퇴 버튼이 클릭 가능한지 확인
  const canWithdraw = isAdmin || isUser;

  return (
    <>
      <footer className="w-screen h-[90px] md:h-[52px] bg-white border-t text-sm font-normal border-[#808080] mt-10 md:mt-30 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="flex flex-col md:flex-row justify-center items-center h-full">
          <div className="flex flex-col md:flex-row justify-center items-center mb-2 md:mb-0">
            <span className="text-[#646464] pr-2">Copyrightⓒ2025-2025 Clubber Inc.</span>
            <span className="text-[#646464]">All rights reserved.</span>
          </div>
          <div className="text-[#646464]">
            <a
              href="https://polymorphismj.notion.site/clubber-19cfbba2687280089490c05f188083f8?pvs=4"
              className="cursor-pointer hover:text-primary"
            >
              이용약관{' '}
            </a>{' '}
            |
            <a
              href="https://polymorphismj.notion.site/clubber-198fbba26872804ba430c3801b4e7b54?pvs=4"
              className="cursor-pointer hover:text-primary"
            >
              {' '}
              개인정보처리방침{' '}
            </a>{' '}
            |
            <span
              className={`cursor-pointer ${canWithdraw ? 'hover:text-red-500' : 'text-[#646464]'}`}
              onClick={canWithdraw ? handleWithdrawal : undefined}
            >
              {isLoading ? '처리중...' : ' 회원탈퇴'}
            </span>
          </div>
        </div>
      </footer>

      {isModalOpen && <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />}

      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          message="정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          onClose={closeConfirmModal}
          onConfirm={handleConfirmWithdrawal}
          showConfirmButton={true}
        />
      )}
    </>
  );
}
