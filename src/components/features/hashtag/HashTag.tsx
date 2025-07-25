import { Card } from '@/components/ui/card';
import Divider from '@/components/ui/divider';

export default function HashTag() {
  return (
    <>
      <Card className="p-10 my-4 gap-3">
        <div>
          <span className="text-primary font-bold text-lg mr-2">바로가기</span>
          <span>어떤 동아리를 찾으시나요?</span>
        </div>
        <Divider />
      </Card>
    </>
  );
}
