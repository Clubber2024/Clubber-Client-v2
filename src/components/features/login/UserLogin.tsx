export default function UserLogin() {
  return (
    <div>
      <p className="text-center font-pretendard font-normal text-[14px] leading-[120%] tracking-normal mt-[25px] mb-[15px]">
        SNS로 간편하게 로그인하고
        <br /> 더 많은 서비스를 즐겨보세요!
      </p>
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
    </div>
  );
}
