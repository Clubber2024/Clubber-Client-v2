import { PencilLine } from 'lucide-react';

export default function ReviewStatics() {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1>이런 점이 좋았어요!</h1>
        <p className="flex flex-row items-center">
          <PencilLine />
          리뷰쓰기
        </p>
      </div>
      <div></div>
    </>
  );
}
