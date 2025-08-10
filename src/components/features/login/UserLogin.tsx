
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function UserLogin() {
  const restApiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
  const redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  // 카카오 로그인 핸들러 : 카카오 버튼 클릭 시, 로그인 창 (링크는 노션에서 가져옴)
  //  rest api key와 redirect uri 값 받아서 해당 링크로 연결, window.location.href 이용하여 주소 변경
  const kakaoLoginHandler = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${restApiKey}&redirect_uri=${redirectURI}`;
  };

  const handleFormSubmit = (event: React.FormEvent) => event.preventDefault();

  return (
    <div>
      <p className="text-center font-normal text-[14px] leading-[120%] tracking-normal mt-[25px] mb-[15px]">
        SNS로 간편하게 로그인하고
        <br /> 더 많은 서비스를 즐겨보세요!
      </p>
      <form onSubmit={handleFormSubmit}>
        <Button
          onClick={kakaoLoginHandler}
          className="rounded-3xl w-72 h-11 flex justify-between items-center bg-[#FEE500] hover:bg-[#E6D100] font-medium leading-[150%] pl-5 transition-colors duration-200"
        >
          <Image src={'/images/login/kakao.png'} alt="kakao" width={20} height={20} />
          <div className="w-[1px] h-8 bg-black/50 ml-1.5"></div>
          <span className="w-64 text-gray-900 text-center">카카오 간편 로그인</span>
        </Button>
      </form>
    </div>
  );
}
