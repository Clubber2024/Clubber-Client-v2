import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function MainRecruitList() {
  const recruitData = [
    {
      state: '모집중',
      title: '클러버와 함께 할 사람 모집합니다💙  열정만 있으면 누구나! ',
      createdAt: '2025-07-01',
    },
    {
      state: '모집중',
      title: '클러버와 함께 할 사람 모집합니다💙  열정만 있으면 누구나! ',
      createdAt: '2025-07-01',
    },
    {
      state: '모집중',
      title: '클러버와 함께 할 사람 모집합니다💙  열정만 있으면 누구나! ',
      createdAt: '2025-07-01',
    },
    {
      state: '마감',
      title: '클러버와 함께 할 사람 모집합니다💙  열정만 있으면 누구나! ',
      createdAt: '2025-07-01',
    },
    {
      state: '마감',
      title: '클러버와 함께 할 사람 모집합니다💙  열정만 있으면 누구나! ',
      createdAt: '2025-07-01',
    },
  ];

  return (
    <>
      <h2 className="font-bold text-lg py-3 mt-2">모집글</h2>
      <Card className="p-6 gap-2">
        {recruitData.map((recruit, idx) => (
          <div key={idx} className="p-0 flex flex-row items-center justify-between text-sm">
            <div>
              <Badge
                className="mr-2 h-6 rounded-3xl px-3 font-bold text-sm"
                style={{
                  backgroundColor: recruit.state === '모집중' ? '#4C9DB5' : '#334A52',
                }}
              >
                {recruit.state}
              </Badge>
              <span className="font-medium">{recruit.title}</span>
            </div>
            <span className="font-medium">{recruit.createdAt}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
