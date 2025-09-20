import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Ellipsis } from 'lucide-react';

export default function ReviewCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-1 items-center">
          <CardTitle className="text-[16px] font-bold mr-1">본인1</CardTitle>
          <p className="text-[12px] font-regular text-[#9c9c9c]">2025-09-15</p>
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
