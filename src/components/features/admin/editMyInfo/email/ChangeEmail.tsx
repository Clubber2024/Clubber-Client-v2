'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/app/modal/Modal";
import TitleDiv from "@/components/ui/title-div";
import { useRouter } from "next/navigation";
import { patchUpdateEmail, postUpdateCode, postUpdateEmail } from "./api/changeEmail";
import Timer from "@/components/ui/timer";

export default function ChangeEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailCodeMessage, setEmailCodeMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [start, setStart] = useState(0);

  // 이메일 인증 api
  const fetchUpdateEmail = async () => {
    try {
      // TODO: Replace with your actual API call
      const res = await postUpdateEmail(email);
      if (res.success) {
        setAuthEmail(email);
      }
      // setAuthEmail(email); // mock
    } catch {}
  };

  // 인증코드 확인 api
  const fetchUpdateCode = async () => {
    try {
      // TODO: Replace with your actual API call
      const res = await postUpdateCode({email:email, authCode:emailCode})
      if (res.success) {
        setIsVerifyCode(true);
        setAuthCode(emailCode);
        setIsNext(true);
        setEmailCodeMessage('인증되었습니다');
      // }
     
    }
  } catch {
      setIsVerifyCode(false);
      setEmailCodeMessage('인증번호를 확인해주세요.');
    }
  };

  // 새 이메일 정보 update api
  const fetchUpdateEmailData = async () => {
    try {
      // TODO: Replace with your actual API call
      const res = await patchUpdateEmail({email:email, authCode:emailCode})
      if (res.success) {
        setModalMessage('이메일이 변경되었습니다.');
        setIsModalOpen(true);
      }
      
    } catch {}
  };

  // 이메일 입력 핸들러
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerifyCode) return;
    setEmail(e.target.value);
  };

  // 인증메일 전송 버튼
  const handleEmailVerificationButton = () => {
    if (isVerifyEmail) return;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setIsVerifyEmail(false);
      setEmailMessage('올바른 이메일 형식이 아닙니다.');
      return;
    } else {
      setIsVerifyEmail(true);
      fetchUpdateEmail();
      setEmailMessage('인증번호를 전송했습니다.');
      setShowTimer(true);
      setStart(Date.now());
    }
  };

  // 인증코드 입력 핸들러
  const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerifyCode) return;
    setEmailCode(e.target.value);
  };

  // 인증번호 확인 버튼
  const handleVerfiyCode = () => {
    if (isVerifyCode) return;
    if (emailCode) fetchUpdateCode();
  };

  // 완료 버튼
  const onClickCompleteButton = () => {
    fetchUpdateEmailData();
  };

  // 모달 닫기
  const onCloseModal = () => {
    setIsModalOpen(false);
    router.back();
  };

  return (
    <>
      <TitleDiv>
        <p className="font-bold font-sans text-[18px] md:text-[22px] leading-[100%] text-[#202123]">
          이메일 변경
        </p>
      </TitleDiv>
      <div className="w-full flex flex-col items-center justify-center mt-[10%] md:mt-[8%]">
        <div className="flex flex-col items-center">
          {/* 새 이메일 주소 */}
          <div className="w-full md:w-[463px] text-left mb-2">
            <p className="font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123]">새 이메일 주소</p>
          </div>
          <div className="flex flex-row items-center justify-between w-full md:w-[463px] mb-0">
            <Input
              id="email"
              name="email"
              value={email}
              onChange={onChangeEmail}
              className="rounded-[5px] w-[70%] h-[50px] text-[#202123] flex items-center pl-[11px] mt-[13px] mb-[70px] mr-[5px] text-[16px]"
              placeholder="새 이메일 입력"
              autoComplete="off"
            />
            <Button
              onClick={handleEmailVerificationButton}
              className={`${email ? "bg-primary" : "bg-[#d6d6d6]"} w-[25%] h-[50px] rounded-[5px] font-normal text-[15px] text-white cursor-pointer mt-[13px] mb-[70px]`}
              type="button"
            >
              인증메일 인증
            </Button>
          </div>
          <p className={`w-[100%] mt-[-67px] mb-[20px] text-[11px] ${isVerifyEmail ? "text-primary" : "text-red-500"}`}>{emailMessage}</p>

          {/* 인증 코드 */}
          <div className="w-full md:w-[463px] text-left mb-1 mt-2">
            <p className="font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123]">인증 코드</p>
          </div>
          <div className="flex flex-row items-center justify-between w-full md:w-[463px] mb-0">
            <div className="relative w-[70%]">
            <Input
              id="code"
              name="code"
              value={emailCode}
              onChange={onChangeCode}
              className="rounded-[5px] w-full h-[50px] text-[#202123] flex items-center pl-[11px] mt-[13px] mb-[70px] mr-[5px] text-[16px]"
              placeholder="인증코드 입력"
              autoComplete="off"
            />
            {showTimer?<Timer key={start} className="absolute top-8 right-3"/>
            :""}
            </div>
            <Button
              onClick={handleVerfiyCode}
              className={`${emailCode ? "bg-primary" : "bg-[#d6d6d6]"} w-[25%] h-[50px] rounded-[5px] border-none text-[15px] text-white cursor-pointer mt-[13px] mb-[70px]`}
              type="button"
            >
              인증번호 확인
            </Button>
          </div>
          <p className={`w-full mt-[-67px] mb-[20px] text-[11px] ${isVerifyCode ? "text-primary" : "text-red-500"}`}>{emailCodeMessage}</p>

          {/* 완료 버튼 */}
          <Button
            className={`w-full md:w-[463px] h-[50px] rounded-[5px] ${isNext ? "bg-primary" : "bg-[#9c9c9c80]"} text-white font-bold text-[16px] text-center mb-[20%] mt-[50px]`}
            onClick={onClickCompleteButton}
            disabled={!isNext}
          >
            완료
          </Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} message={modalMessage} onClose={onCloseModal} />
    </>
  );
}
