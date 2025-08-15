import { HashtagData } from '@/types/hashtag/hashtagData';
import Image from 'next/image';
import Link from 'next/link';

export default function HashTagItems({ hashtags }: { hashtags: HashtagData[] }) {
  return (
    <div className="flex flex-row overflow-x-auto overflow-y-hidden m-0 pb-5">
      {hashtags.map((hashtag) => (
        <div key={hashtag.code} className="flex flex-col items-center flex-shrink-0 relative">
          <Link href={`/hashtag/${hashtag.code}`}>
            <div className="relative cursor-pointer hover:scale-110 transition-all duration-300">
              <Image
                src={hashtag.imageUrl}
                alt={hashtag.title}
                width={120}
                height={100}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="absolute top-19 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-[13px] text-gray-900 font-medium"># {hashtag.title}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
