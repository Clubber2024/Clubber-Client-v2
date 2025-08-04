import Image from 'next/image';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function QuickServices() {
  const serviceList = [
    {
      name: `숭실대 동아리\n모집 일정`,
      bg: '#D9E8FF',
      src: '/images/main/CALENDAR.png',
      url: 'calendar',
    },
    { name: `동아리방\n지도 조회`, bg: '#E1F6EF', src: '/images/main/CALENDAR.png', url: 'map' },
    { name: '자주 묻는 질문', bg: '#FFDBD4', src: '/images/main/CALENDAR.png', url: 'faq' },
    { name: '서비스 준비중', bg: '#FFF5D6', src: '/images/main/CALENDAR.png', url: '' },
  ];

  return (
    <div className="w-full">
      <h2 className="font-bold text-lg py-3 mt-2">자주 찾는 서비스</h2>
      <div className="flex flex-row gap-4">
        {serviceList.map((service, idx) => (
          <Link href={`/${service.url}`} key={idx} className="flex-1">
            <Card
              className="flex flex-col items-center justify-center gap-3 py-6 h-48 rounded-xl hover:shadow-md transition-shadow"
              style={{ backgroundColor: service.bg }}
            >
              <Image src={service.src} alt={service.name} width={70} height={70} />
              <div className="text-center font-semibold text-md whitespace-pre-line leading-tight">
                {service.name}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
