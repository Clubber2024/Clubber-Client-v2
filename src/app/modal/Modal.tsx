import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  message: string;

  onClose: () => void;
}

export default function Modal({ isOpen, message, onClose }: ModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed flex inset-0 bg-black/50 z-50 justify-center items-center"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className={`fixed z-100  bg-white rounded-lg shadow-lg p-5 flex flex-col justify-center items-center text-center font-[Noto Sans KR] ${
            isMobile ? 'w-[250px] h-[110px] text-sm' : 'w-[410px] h-[150px] text-base'
          }`}
          role="dialog"
          aria-modal="true"
        >
          <p className="mb-6 font-medium">{message}</p>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="px-4 py-2 rounded text-white hover:bg-blue-700 transition"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
