import { PencilLine } from 'lucide-react';
import Link from 'next/link';

export default function ReviewStatics({ clubId }: { clubId: number }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1>이런 점이 좋았어요!</h1>
        <Link href={`/review-write?clubId=${clubId}`}>
          <p className="flex flex-row items-center">
            <PencilLine />
            리뷰쓰기
          </p>
        </Link>
      </div>
      <div></div>
    </>
  );
}
