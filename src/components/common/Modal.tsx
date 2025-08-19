import { Button } from '@/components/ui/button';

interface ModalProps {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  showConfirmButton: boolean;
}

export default function Modal({ message, onClose, onConfirm, showConfirmButton }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <p
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br/>') }}
          className="text-center px-6"
        />
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            onClick={onClose}
            className={`mt-4 ${showConfirmButton ? 'bg-gray-300' : 'bg-primary'} px-8 hover:bg-primary/50`}
          >
            {showConfirmButton ? '취소' : '닫기'}
          </Button>
          {showConfirmButton && (
            <Button onClick={onConfirm} className="mt-4 px-8">
              확인
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
