import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function ClubReview() {
  return (
    <Card className="mx-4 md:mx-10">
      <div className="mx-auto">
        <Image
          src={'/images/review-pc.png'}
          alt="review"
          width={700}
          height={700}
          className="size-150 object-cover relative "
        />
      </div>
    </Card>
  );
}
