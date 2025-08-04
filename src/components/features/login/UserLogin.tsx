export default function UserLogin() {
  const restApiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
  const redirectURL = process.env.NEXT_APP_REDIRECT_URI;
  // 카카오 로그인 핸들러 : 카카오 버튼 클릭 시, 로그인 창 (링크는 노션에서 가져옴)
  //  rest api key와 redirect uri 값 받아서 해당 링크로 연결, window.location.href 이용하여 주소 변경
  const kakaoLoginHandler = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${restApiKey}&redirect_uri=${redirectURL}`;
  };

  const handleFormSubmit = (event: any) => event.preventDefault();

  return (
    <div>
      <p className="text-center font-pretendard font-normal text-[14px] leading-[120%] tracking-normal mt-[25px] mb-[15px]">
        SNS로 간편하게 로그인하고
        <br /> 더 많은 서비스를 즐겨보세요!
      </p>
      <form onSubmit={handleFormSubmit}>
        <button
          className="border-[0.5px] rounded-3xl w-[300px] h-[43px] flex justify-between items-center font-[Pretendard] font-medium text-[15px] leading-[150%]  pl-[25px]"
          style={{ backgroundColor: 'var(--kakao-bg, #FEE500) ' }}
        >
          <div className="flex items-center">
            <img src={'/images/login/kakao.png'} className="w-[20px] h-[20px] mr-[5px]" />
            <img src={'/images/login/Line299.png'} className="h-[30px] ml-[5px] opacity-50" />
          </div>
          <span className="w-[250px] text-center">카카오 간편 로그인</span>
        </button>
      </form>
    </div>
  );
}
