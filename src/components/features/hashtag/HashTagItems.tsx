import { HashtagData } from '@/types/hashtag/hashtagData';
import Image from 'next/image';
import Link from 'next/link';

export default function HashTagItems({ hashtags }: { hashtags: HashtagData[] }) {
  return (
    <div className="flex flex-row overflow-x-auto overflow-y-hidden m-0 pb-2 md:pb-4 scrollbar-hide">
      {hashtags.map((hashtag) => (
        <div key={hashtag.code} className="flex flex-col items-center flex-shrink-0 relative">
          <Link href={`/hashtag/${hashtag.code}`}>
            <div className="relative cursor-pointer hover:scale-110 transition-all duration-300">
              <Image
                src={hashtag.imageUrl}
                alt={hashtag.title}
                width={120}
                height={100}
                className="size-18 md:size-22 object-cover rounded-lg"
              />
              <div className="absolute top-17 md:top-21 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-[12px] md:text-sm text-gray-900 font-medium">
                  # {hashtag.title}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
