'use client';

import BranchHeader from '@/components/common/BranchHeader';
import { getHashtagClubs } from '@/components/features/hashtag/api/hashtag';
import ClubList from '@/components/features/club/ClubList';
import { HashtagClubsData } from '@/types/hashtag/hashtagData';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function HashtagPage() {
  const params = useParams();
  const [tag, setTag] = useState<string>('');
  const [clubs, setClubs] = useState<HashtagClubsData[]>([]);

  useEffect(() => {
    const fetchHashtagClubs = async () => {
      const res = await getHashtagClubs(params.tag as string);
      setClubs(res.clubs);
      setTag(res.hashtag);
    };
    fetchHashtagClubs();
  }, [params.tag]);

  return (
    <>
      <BranchHeader mainTitle={tag} subTitle="해시태그" />
      <ClubList clubs={clubs} />
    </>
  );
}
