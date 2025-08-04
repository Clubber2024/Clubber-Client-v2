export default function HashTagBar() {
  const categories = [
    { icon: '💻', name: '개발' },
    { icon: '🎮', name: '게임' },
    { icon: '💃', name: '댄스' },
    { icon: '🤝', name: '봉사' },
    { icon: '📷', name: '사진' },
    { icon: '⚽', name: '운동' },
    { icon: '📚', name: '언어' },
    { icon: '🍳', name: '요리' },
    { icon: '🙏', name: '종교' },
    { icon: '👥', name: '친목' },
    { icon: '🔍', name: '학술' },
  ];

  return (
    <div
      className="w-screen relative left-1/2 right-1/2 -mx-[50vw] border-b-[0.5px] border-t-[0.5px] border-[#0000000a] bg-[#F9FAFF80]"
      style={{ boxShadow: '0 -1px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
    >
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                {category.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">#{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
