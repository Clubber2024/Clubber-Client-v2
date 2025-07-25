import { Card } from '@/components/ui/card';

export default function MainRanking() {
  const rank = [
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
    { name: '클러버', views: 10 },
  ];

  return (
    <>
      <h2 className="font-bold text-lg py-3 mt-2">조회수</h2>
      <Card>
        <div className="grid grid-cols-2 pl-10 gap-x-8 font-medium">
          <div className="space-y-2">
            {rank.slice(0, 5).map((club, idx) => (
              <p key={idx}>
                {idx + 1}. {club.name}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            {rank.slice(5, 10).map((club, idx) => (
              <p key={idx}>
                {idx + 6}. {club.name}
              </p>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
