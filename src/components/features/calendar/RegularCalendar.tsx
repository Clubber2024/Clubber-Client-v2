import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
}

export default function RegularCalendar() {
  const categories: Category[] = [
    { id: 'developers', name: '개발자들' },
    { id: 'designers', name: '디자이너들' },
    { id: 'clubbers', name: '클러버들' },
  ];

  return (
    <div className="mx-auto my-12 bg-primary p-4 rounded-lg">
      <Card className="bg-white p-6 rounded-none">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900 mr-0.5">이달의 상시모집</h2>
          <div className="flex-1 h-px bg-gray-900 ml-2"></div>
        </div>

        {/* 동아리 목록 */}
        <div className="flex flex-col space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              className="w-fit px-3 py-0.5 justify-start rounded-md transition-colors bg-secondary text-gray-800 hover:bg-primary/70"
              //   onClick={}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
