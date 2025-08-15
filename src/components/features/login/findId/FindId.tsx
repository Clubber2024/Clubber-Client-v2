'use client';

import { useState } from 'react';
import SearchClub from '../signup/SearchClub';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { postFindId, postFindIdCode, postFindIdEmail } from './api/findId';
import { useRouter } from 'next/navigation';

export default function FindId() {
  const router = useRouter();
  const [clubName, setClubName] = useState('');
  const [clubType, setClubType] = useState('');
  const [clubId, setClubId] = useState('');
  const [findId, setFindId] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  // const [authEmail, setAuthEmail] = useState('');
  // const [authCode, setAuthCode] = useState('');
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  //타이머
  const [showTimer, setShowTimer] = useState(false);
  const [start, setStart] = useState(0);

  const [emailMessage, setEmailMessage] = useState('');
  const [emailCodeMessage, setEmailCodeMessage] = useState('');

  const [step, setStep] = useState('1');

  const onChangeClubName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClubName(e.target.value);
  };

  //이메일 관련 함수
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerifyCode) {
      return;
    } else {
      const currentEmail = e.target.value;
      setEmail(currentEmail);
    }
  };

  //인증코드 관련 함수
  const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerifyCode) {
      return;
    } else {
      const currentCode = e.target.value;
      setEmailCode(currentCode);
    }
  };

  const handleEmailVerificationButton = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setIsVerifyEmail(false);
      setEmailMessage('올바른 이메일 형식이 아닙니다.');
      return;
    } else {
      setIsVerifyEmail(true);
      fetchEmailData();
      setEmailMessage('인증번호를 전송했습니다.');
    }
  };

  const handleVerifyCode = () => {
    if (isVerifyCode) {
      return;
    } else {
      if (emailCode) {
        fetchCodeData();
      }
    }
  };

  const handleNextFindId = () => {
    if (isVerifyCode && isVerifyEmail) {
      fetchFindId();
    } else {
      return;
    }
  };

  //api 관련
  const fetchEmailData = async () => {
    const res = await postFindIdEmail({ email, clubId });
    console.log('res', res);
  };

  const fetchCodeData = async () => {
    const res = await postFindIdCode({ email: email, clubId: clubId, authCode: emailCode });
    console.log('code', res);

    if (res.success) {
      setEmailCodeMessage('인증되었습니다.');
      setIsVerifyCode(true);
    }
  };

  const fetchFindId = async () => {
    const res = await postFindId({ email: email, clubId: clubId, authCode: emailCode });

    if (res.success) {
      setStep('2');
      setFindId(res.data.username);
    }
  };

  return (
    <div className="mt-25 flex flex-col justify-center items-center">
      <p className="font-semibold text-[28px] sm:text-[34px] leading-[100%] tracking-[0%] text-center mb-10 sm:mb-[70px]">
        아이디 찾기
      </p>
      {step === '1' && (
        <>
        <div className="w-full max-w-[370px]">
          <div>
            <p
              className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
				mb-[9px] "
            >
              동아리명
            </p>
            <SearchClub
              clubName={clubName}
              setClubName={setClubName}
              clubType={clubType}
              setClubType={setClubType}
              clubId={clubId}
              setClubId={setClubId}
              college={college}
              setCollege={setCollege}
              department={department}
              setDepartment={setDepartment}
              type="find"
            />
          </div>

          <div>
            <p
              className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
				mb-[9px]"
            >
              이메일 주소
            </p>
            <div className="w-full max-w-[370px]">
              <div className="flex">
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  placeholder="이메일을 입력하세요."
                  className="h-[40px] rounded-[5px] mr-2 text-xs sm:text-sm"
                  onChange={onChangeEmail}
                  autoComplete="off"
                />{' '}
                <Button className="h-[40px] rounded-[5px] w-[90px] sm:w-[100px]" onClick={handleEmailVerificationButton}>
                  인증번호 전송
                </Button>
              </div>
            </div>
            <p
              className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 ${isVerifyEmail ? 'text-primary' : 'text-red-400'}`}
            >
              {emailMessage}
            </p>

            <div>
              <p
                className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
				mb-[9px]"
              >
                인증번호 입력
              </p>
              <div className="flex flex-row">
                <Input
                  id="code"
                  name="code"
                  value={emailCode}
                  onChange={onChangeCode}
                  placeholder="인증코드 입력"
                  autoComplete="off"
                  className="h-[40px] rounded-[5px] mr-2 text-xs sm:text-sm"
                />
                {/* <div className={styles.timer_container}>{showTimer ? <Timer key={start} /> : ''}</div> */}
                <Button onClick={handleVerifyCode} className="h-[40px] rounded-[5px] w-[90px] sm:w-[100px]">
                  인증번호 확인
                </Button>
              </div>

              <p className="font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 text-primary">
                {emailCodeMessage}
              </p>
            </div>
          </div>
          <Button onClick={handleNextFindId} className="w-full max-w-[370px] mt-[35px] h-[40px] rounded-[5px]">
            다음
          </Button>
          </div>
        </>
      )}

      {step === '2' && (
        <>
        <div className="w-full max-w-[370px]">
          <div className="h-[146px] bg-[#f4f6f8] flex justify-center items-center">
            <p className="font-medium text-[18px] leading-[100%] tracking-[0%]">
              아이디는{' '}
              <span className="font-medium text-[18px] leading-[100%] tracking-[0%] text-primary">
                {findId}{' '}
              </span>
              입니다.{' '}
            </p>
          </div>
                     <div className="flex flex-row mt-[40px] gap-3 w-full max-w-[370px]">
             <Button
               variant={'outline'}
               className="bg-[#a7a7a7] text-white flex-1 h-[40px] rounded-[5px]"
               onClick={() => router.push('/login')}
             >
               로그인
             </Button>
             <Button
               className="flex-1 h-[40px] rounded-[5px]"
               onClick={() => router.push('/findPw')}
             >
               비밀번호 찾기
             </Button>
           </div>
          </div>
        </>
      )}
    </div>
  );
}

/*flex-1을 사용하면 gap을 제외한 나머지 공간을 두 버튼이 동일하게 나누어 가져서서 
전체 너비가 370px을 초과하지 않으면서도 적절한 간격을 유지됨됨
*/