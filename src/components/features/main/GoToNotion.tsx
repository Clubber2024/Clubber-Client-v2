import { Instagram, Mail, MessageCircle } from 'lucide-react';

export default function GoToNotion() {
  return (
    <div className="bg-black rounded-2xl p-6 text-white h-full flex flex-col justify-between">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-6">클러버가 궁금하시다면?</h3>

        {/* 노션 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
            <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm">#클러버 SNS</span>
        </div>

        {/* SNS 아이콘들 */}
        <div className="flex justify-center gap-3">
          <a
            href="#"
            className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Instagram className="w-4 h-4 text-white" />
          </a>
          <a
            href="#"
            className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-4 h-4 text-black" />
          </a>
          <a
            href="#"
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Mail className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}
