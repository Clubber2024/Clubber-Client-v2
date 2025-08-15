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
      <Card className="px-10 pt-7 my-4 gap-0">
        <div className="mb-3">
          <span className="text-primary font-bold text-lg mr-2">바로가기</span>
          <span>어떤 동아리를 찾으시나요?</span>
        </div>
        <Divider className="mb-0" />
        <HashTagItems hashtags={hashtags} />
      </Card>
    </>
  );
}
