import HashTagItems from './HashTagItems';
import { getHashtag } from './api/hashtag';
import { useEffect, useState } from 'react';
import { HashtagData } from '@/types/hashtag/hashtagData';

export default function HashTagBar() {
  const [hashtags, setHashtags] = useState<HashtagData[]>([]);

  useEffect(() => {
    const fetchHashtags = async () => {
      const res = await getHashtag();
      setHashtags(res);
    };
    fetchHashtags();
  }, []);
  return (
    <div
      className="w-screen relative left-1/2 right-1/2 -mx-[50vw] border-b-[0.5px] border-t-[0.5px] border-[#0000000a] bg-[#F9FAFF80]"
      style={{ boxShadow: '0 -1px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
    >
      <div className="container mx-auto px-8 pb-2.5">
        <HashTagItems hashtags={hashtags} />
      </div>
    </div>
  );
}
