'use client';

import { Card } from '@/components/ui/card';
import Divider from '@/components/ui/divider';
import { getHashtag } from './api/hashtag';
import { useEffect, useState } from 'react';
import { HashtagData } from '@/types/hashtag/hashtagData';
import HashTagItems from './HashTagItems';

export default function HashTag() {
  const [hashtags, setHashtags] = useState<HashtagData[]>([]);

  useEffect(() => {
    const fetchHashtags = async () => {
      const res = await getHashtag();
      setHashtags(res);
    };
    fetchHashtags();
  }, []);

  return (
    <>
      <Card className="px-6 md:px-10 py-4 md:py-7 my-2 md:my-4 gap-0">
        <div className="mb-3">
          <span className="text-primary text-md font-bold md:text-lg mr-2">바로가기</span>
          <span className="text-[13px] md:text-md">어떤 동아리를 찾으시나요?</span>
        </div>
        <Divider className="mb-0" />
        <HashTagItems hashtags={hashtags} />
      </Card>
    </>
  );
}
