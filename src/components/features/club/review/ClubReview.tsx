import { Card } from '@/components/ui/card';
// import Image from 'next/image';
import ReviewStatics from './ReviewStatics';
import Divider from '@/components/ui/divider';
import ReviewList from './ReviewList';

export default function ClubReview() {
  return (
    <Card className="mx-4 md:mx-10">
      <div className="mx-24">
        {/* <Image
          src={'/images/review-pc.png'}
          alt="review"
          width={700}
          height={700}
          className="size-150 object-cover relative "
        /> */}
        <ReviewStatics />
        <Divider />
        <ReviewList />
      </div>
    </Card>
  );
}
