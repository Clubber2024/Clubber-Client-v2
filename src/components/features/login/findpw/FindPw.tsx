'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { patchResetPW, postFindPwCode, postFindPwEmail } from './api/findPw';
import { useRouter } from 'next/navigation';
import Modal from '@/app/modal/Modal';
import Timer from '@/components/ui/timer';

export default function FindPw() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');

  const [authCode, setAuthCode] = useState('');
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const [isVerifyCode, setIsVerifyCode] = useState(false);

  const [emailMessage, setEmailMessage] = useState('');
  const [emailCodeMessage, setEmailCodeMessage] = useState('');
  const [idMessage, setIdMessage] = useState('');

  const [isNext, setIsNext] = useState(false);
  //타이머 시작
  const [showTimer, setShowTimer] = useState(false);
  const [start, setStart] = useState(0);
  const [step, setStep] = useState(`1`);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const newPasswordRef = useRef(null);
  const newPasswordConfirmRef = useRef(null);
  //유효성 검사
  const [isPassword1, setIsPassword1] = useState(false);
  const [isPassword2, setIsPassword2] = useState(false);
  const [isPassword3, setIsPassword3] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  const [isShowPwChecked, setIsShowPwChecked] = useState(false);
  const [isShowPwConfirmChecked, setIsShowPwConfirmChecked] = useState(false);
  //오류메세지 상태 저장
  const [passwordMessage1, setPasswordMessage1] = useState('');
  const [passwordMessage2, setPasswordMessage2] = useState('');
  const [passwordMessage3, setPasswordMessage3] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

  //모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  //이메일 관련 함수
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
  };

  const handleEmailVerificationButton = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if(id === ""){
      setIdMessage("아이디를 입력해주세요.");
      return;
    }
    
    if (!emailRegex.test(email)) {
      setIsVerifyEmail(false);
      setEmailMessage('올바른 이메일 형식이 아닙니다.');
      return;
    } else {
      // setIsVerifyEmail(true);
      // setEmailMessage('인증번호를 보냈습니다.');
      fetchEmailData();
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

  const handleVerifyCode = () => {
    if (isVerifyCode) {
      return;
    } else {
      if (emailCode) {
        fetchCodeData();
      }
    }
  };

  //api 관련
  const fetchEmailData = async () => {
    const res = await postFindPwEmail({ username: id, email: email });
    if(res.success){
      setIsVerifyEmail(true);
      setIdMessage("");
      setEmailMessage('인증번호를 보냈습니다. 인증번호가 오지 않으면 입력하신 정보가 회원정보와 일치하는지 확인해주세요.');
      setShowTimer(true);
      setStart(Date.now());
      return;
    } else{
      console.log(res.reason);
      setIdMessage(res.reason);
      setIsVerifyEmail(false);
      return;
    }

  };

  const fetchCodeData = async () => {
    const res = await postFindPwCode({ username: id, authCode: emailCode });
    console.log(res);

    if (res.success) {
      setIsVerifyCode(true);
      setEmailCodeMessage('인증되었습니다.');

    } else {
      setIsVerifyCode(false);
      setEmailCodeMessage('인증번호가 일치하지 않습니다.');
    
      return;
    }
  };

  const fetchResetPwData = async () => {
    const res = await patchResetPW({ username: id, authCode: emailCode, password: newPassword });

    if (res.success) {
      setIsModalOpen(true);
      setModalMessage('비밀번호가 성공적으로 변경되었습니다.\n 로그인해 주세요.');
    }
  };

  //

  const handleNextbutton = () => {
    if (id && emailCode) {
      setStep('2');
    }
  };

  const handleShowPwChecked = () => {
    if (!newPasswordRef.current) return;
    setIsShowPwChecked((prev) => !prev);
  };

  const handleShowPwConfirmChecked = () => {
    if (!newPasswordConfirmRef.current) return;
    setIsShowPwConfirmChecked((prev) => !prev);
  };

  /*	비밀번호 관련  */
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPassword = e.target.value;
    setNewPassword(currentPassword);

    // 1. 영문+숫자+특수문자 포함, 8~20자 (공백 제외)
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-=`{}[\]:";'<>?,.\/])[^\s]{8,20}$/;

    // 2. 동일한 문자/숫자 4번 이상 연속 금지
    const consecutiveRegExp = /(.)\1\1\1/;

    // 비밀번호 유효성 체크
    setIsPassword1(passwordRegExp.test(currentPassword));
    setIsPassword2(!consecutiveRegExp.test(currentPassword));
  };

  const onChangePasswordConfirm = (e: any) => {
    const currentPasswordConfirm = e.target.value;
    setNewPasswordConfirm(currentPasswordConfirm);
    if (newPassword !== currentPasswordConfirm) {
      setIsPasswordConfirm(false);
    } else {
      setIsPasswordConfirm(true);
    }
  };

  const handleSubmitResetPw = () => {
    if (isPasswordConfirm && isPassword1 && isPassword2) {
      fetchResetPwData();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/login');
  };

  return (
  
    <div className="mt-25 flex flex-col justify-center items-center">
      <p className="font-semibold text-[28px] sm:text-[34px] leading-[100%] tracking-[0%] text-center mb-10 sm:mb-[70px]">
        비밀번호 찾기
      </p>
      {step === '1' && (
        <>
          <div className="w-full max-w-[370px]">
          <div>
            <p
              className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
						mb-[9px] "
            >
              아이디
            </p>
            <Input
              id="id"
              name="id"
              value={id}
              onChange={onChangeId}
              className="h-[40px] rounded-[5px] mr-2 text-xs sm:text-sm"
              placeholder="아이디 입력"
              autoComplete="off"
            />
            <p
                className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 text-red-400`}
              >
                {idMessage}
              </p>


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
                  <Button
                    className="h-[40px] rounded-[5px] w-[90px] sm:w-[100px]"
                    onClick={handleEmailVerificationButton}
                  >
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
                <div className="flex flex-row justify-between">
                  <div className="relative w-[262px]">
                  <Input
                    id="code"
                    name="code"
                    value={emailCode}
                    onChange={onChangeCode}
                    placeholder="인증코드 입력"
                    autoComplete="off"
                    className="h-[40px] rounded-[5px] mr-2 text-xs sm:text-sm"
                  />
                  {showTimer?<Timer key={start} className="absolute top-1/2 -translate-y-1/2 right-3"/>
                  :""}
                  </div>
                  
                 
                  <Button onClick={handleVerifyCode} className="h-[40px]  rounded-[5px] w-[90px] sm:w-[100px]">
                    인증번호 확인
                  </Button>
                </div>

                <p className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 ${isVerifyCode ? 'text-primary' : 'text-red-400'} whitespace-pre-line`}>
                  {emailCodeMessage}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={handleNextbutton} className="w-full max-w-[370px] h-10 mt-[35px] rounded-[5px]">
            다음
          </Button>
          </div>
        </>
      )}
      {step === '2' && (
        <div className="w-full max-w-[370px]">
          <p
            className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
          >
            비밀번호
          </p>
          <div className="relative ">
            <Input
              type={isShowPwChecked ? 'text' : 'password'}
              id="password"
              name="password"
              value={newPassword}
              onChange={onChangePassword}
              ref={newPasswordRef}
              placeholder="비밀번호를 입력하세요."
              autoComplete="off"
              className="h-[40px] rounded-[5px] text-xs sm:text-sm"
            />
            <img
              src={isShowPwChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
              onClick={handleShowPwChecked}
              className="w-[20px] absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>
          <p
            className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 mb-1 ${isPassword1 ? 'text-primary' : 'text-[#00000080]'}`}
          >
            영문, 숫자, 특수문자로 구성된 8자 이상 20자 이하 입력 (공백 제외)
          </p>
          <p
            className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] ${isPassword2 ? 'text-primary' : 'text-[#00000080]'}`}
          >
            연속 4자 이상은 동일한 문자/숫자 제외
          </p>
          <p
            className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
          >
            비밀번호 확인
          </p>
          <div className="relative">
            <Input
              type={isShowPwConfirmChecked ? 'text' : 'password'}
              id="password"
              name="password"
              value={newPasswordConfirm}
              onChange={onChangePasswordConfirm}
              ref={newPasswordConfirmRef}
              autoComplete="off"
              placeholder="비밀번호를 입력하세요."
              className="h-[40px] rounded-[5px] text-xs sm:text-sm"
            />
            <img
              src={isShowPwConfirmChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
              onClick={handleShowPwConfirmChecked}
              className="w-[20px] absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>
          <p
            className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 ${isPasswordConfirm ? 'text-primary' : 'text-transparent'}`}
          >
            비밀번호와 일치합니다.
          </p>

          <Button onClick={handleSubmitResetPw} className="w-full max-w-[370px] h-10 mt-[35px] rounded-[5px]">
            확인
          </Button>
        </div>
      )}

      {isModalOpen && <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />}
    </div>
  );
}
