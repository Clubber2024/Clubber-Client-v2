'use client';

import { getIsAdmin, clearTokens } from '@/auth/AuthService';
import { deleteWithdrawal } from '@/components/features/login/api/login';
import { useState, useEffect } from 'react';
import Modal from '@/app/modal/Modal';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 컴포넌트 마운트 시 관리자 여부 확인
  useEffect(() => {
    setIsAdmin(getIsAdmin());
  }, []);

  const handleWithdrawal = async () => {
    if (!isAdmin) {
      setModalMessage('관리자만 회원탈퇴가 가능합니다.');
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
      await deleteWithdrawal();
      setModalMessage('회원탈퇴가 완료되었습니다.');
      setIsModalOpen(true);
      
      // 토큰 클리어
      clearTokens();
      
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

  return (
    <>
      <footer className="w-screen h-[52px] bg-white border-t border-[#808080] mt-10 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="flex flex-row justify-center items-center h-full">
          <span className="text-[#646464] pr-2">
            Copyrightⓒ2025-2025 Clubber Inc. All rights reserved.
          </span>
          <div className="text-[#646464]">
            <span className="cursor-pointer">이용약관</span> | 
            <span className="cursor-pointer"> 개인정보처리방침</span> | 
            <span 
              className={`cursor-pointer ${isAdmin ? 'hover:text-red-500' : 'text-gray-400'}`}
              onClick={handleWithdrawal}
            >
              {isLoading ? '처리중...' : '회원탈퇴'}
            </span> | 
            <span className="cursor-pointer"> FAQ</span>
          </div>
        </div>
      </footer>
      
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          message={modalMessage} 
          onClose={closeModal} 
        />
      )}
      
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
