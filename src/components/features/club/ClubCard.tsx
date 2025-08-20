'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ClubCardRes } from '@/types/club/clubCardData';
import { useRouter } from 'next/navigation';

export default function ClubCard({ club }: { club: ClubCardRes }) {
  const router = useRouter();

  const onClickClubCard = (clubId: number) => {
    router.push(`/clubInfo?clubId=${clubId}`);
  };

  return (
    <Card
      className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer py-0 md:pb-3"
      onClick={() => onClickClubCard(club.clubId)}
    >
      <CardContent className="p-0">
        {/* 동아리 이미지 */}
        <div className="aspect-square bg-gray-200 relative">
          {club.imageUrl ? (
            <Image src={club.imageUrl} alt={club.clubName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
              {club.clubName.charAt(0)}
            </div>
          )}
        </div>

        {/* 동아리 정보 */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{club.clubName}</h3>
          {club.introduction && (
            <p className="text-sm text-gray-600 line-clamp-2">{club.introduction}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
