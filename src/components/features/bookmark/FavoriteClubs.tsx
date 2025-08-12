'use client';

interface FavoriteClubsProps {
  id: number;
  type: string;
  name: string;
}

export default function FavoriteClubs({ id, type, name }: FavoriteClubsProps) {
  return (
    <div className="ml-[15px] md:ml-5 flex flex-row">
      <div className="flex flex-col">
        <p className="font-['Noto_Sans_KR'] text-sm md:text-lg font-medium md:font-semibold m-0 mb-[5px] md:leading-[26.06px]">{name}</p>
        <p className="font-['Noto_Sans_KR'] text-[13px] font-medium m-0 text-[#666]">{type}</p>
      </div>
    </div>
  );
}
