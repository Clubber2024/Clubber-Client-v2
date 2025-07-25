import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function QuickServices() {
  const serviceList = [
    { name: `숭실대 동아리\n모집 일정`, bg: '#D9E8FF', src: '/images/main/CALENDAR.png' },
    { name: `동아리방\n지도 조회`, bg: '#E1F6EF', src: '/images/main/CALENDAR.png' },
    { name: '자주 묻는 질문', bg: '#FFDBD4', src: '/images/main/CALENDAR.png' },
    { name: '서비스 준비중', bg: '#FFF5D6', src: '/images/main/CALENDAR.png' },
  ];

  return (
    <div className="w-full">
      <h2 className="font-bold text-lg py-3 mt-2">자주 찾는 서비스</h2>
      <div className="flex flex-row gap-4">
        {serviceList.map((service, idx) => (
          <Card
            key={idx}
            className="flex-1 flex items-center gap-2 py-8"
            style={{ backgroundColor: service.bg }}
          >
            <Image src={service.src} alt={service.name} width={60} height={60} />
            <div className="text-center font-semibold whitespace-pre-line">{service.name}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
