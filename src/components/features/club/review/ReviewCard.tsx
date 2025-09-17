import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Ellipsis } from 'lucide-react';

export default function ReviewCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>본인1</CardTitle>
          <p>2025-09-15</p>
        </div>
        <Ellipsis className="size-5" />
      </CardHeader>
      <CardContent>
        <p>리뷰 한줄평</p>
        <div>키워드1, 키워드2, 키워드3</div>
      </CardContent>
    </Card>
  );
}
