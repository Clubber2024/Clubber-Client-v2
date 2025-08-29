'use client'

import { Input } from "@/components/ui/input";
import TitleDiv from "@/components/ui/title-div";
import { useEffect, useRef, useState } from "react";
import { changePassword } from "./api/ChangePw";
import { useRouter } from "next/navigation";
import Modal from "@/app/modal/Modal";
import { Button } from "@/components/ui/button";

export default function ChangePw() {
  const router = useRouter();
  const[oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const oldPasswordRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  const [isPassword1, setIsPassword1] = useState(false);
  const [isPassword2, setIsPassword2] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isShowOldPwChecked, setIsShowOldPwChecked] = useState(false);
  const [isShowPwChecked, setIsShowPwChecked] = useState(false);
  const [isShowPwConfirmChecked, setIsShowPwConfirmChecked] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const[modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);


  const onChangeOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentOldPassword = e.target.value;
    setOldPassword(currentOldPassword);
  };

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentPassword = e.target.value;
      setPassword(currentPassword);
  
      // 1. 영문+숫자+특수문자 포함, 8~20자 (공백 제외)
      const passwordRegExp =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-=`{}[\]":';.<>?,.\/])[^\s]{8,20}$/;
  
      // 2. 동일한 문자/숫자 4번 이상 연속 금지
      const consecutiveRegExp = /(.)\1\1\1/;
  
      // 비밀번호 유효성 체크
      setIsPassword1(passwordRegExp.test(currentPassword));
      setIsPassword2(!consecutiveRegExp.test(currentPassword));
    };
    
  
    useEffect(() => {
      if (password !== passwordConfirm) {
        setIsPasswordConfirm(false);
      } else {
        setIsPasswordConfirm(true);
      }
    }, [password, passwordConfirm]);
  
    const onChangePasswordConfirm = (e: any) => {
      const currentPasswordConfirm = e.target.value;
      setPasswordConfirm(currentPasswordConfirm);
      if (password !== currentPasswordConfirm) {
        setIsPasswordConfirm(false);
      } else {
        setIsPasswordConfirm(true);
      }
    };

    const handleShowOldPwChecked = () => {
      if (!oldPasswordRef.current) return;
      setIsShowOldPwChecked((prev) => !prev);
    };
  
    const handleShowPwChecked = () => {
      if (!passwordRef.current) return;
      setIsShowPwChecked((prev) => !prev);
    };
  
    const handleShowPwConfirmChecked = () => {
      if (!passwordConfirmRef.current) return;
      setIsShowPwConfirmChecked((prev) => !prev);
    };

const handleSubmitChangePw = async () => {
  try{
    if(oldPassword === '' || password === '' || passwordConfirm === ''){
    setIsOpenModal(true);
    setModalMessage('비밀번호를 입력해주세요.');
      return;
    } 
    if(password !== passwordConfirm){
      setIsPasswordConfirm(false);
      setIsOpenModal(true);
      setModalMessage('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다. 입력하신 비밀번호를 다시 확인해주세요.');
      return;
    }
    if(!isPassword1 || !isPassword2){
      setIsOpenModal(true);
      setModalMessage('비밀번호는 영문, 숫자, 특수문자로 구성된 8자 이상 20자 이하만 가능합니다. 입력하신 비밀번호를 다시 확인해주세요.');
      return;
    }
    const res = await changePassword(oldPassword, password);
    console.log(res);
    if(res.success){
    setIsOpenModal(true);
    setModalMessage('비밀번호가 변경되었습니다.');
    setIsSuccess(true);
  
    } else{
      setIsOpenModal(true);
      setModalMessage(res.message);
    }
    }
   catch(error: any){
    console.error(error);
    setIsOpenModal(true);
    setModalMessage(error.message || '비밀번호 변경에 실패했습니다.');
  }
}

const closeModal = () => {
  setIsOpenModal(false);
  if(isSuccess){
    router.push('/admin/editMyInfo');
  }
}

  return (
    <div>
      <TitleDiv>
        <p className="font-bold font-sans text-[20px] leading-[100%] text-[#202123]">
          비밀번호 변경
        </p>
      </TitleDiv>
<div className="w-[90%] sm:w-[463px] m-auto mt-[62px] flex flex-col items-center justify-center">
<p className="w-full font-semibold text-[18px] leading-[120%] tracking-[0%] mb-[11px] text-[#202123] text-left">
          현재 비밀번호
        </p>
        <div className="relative w-full">
          <Input
            type={isShowOldPwChecked ? 'text' : 'password'}
            id="password"
            name="password"
            value={oldPassword}
            onChange={onChangeOldPassword}
            ref={oldPasswordRef}
            placeholder="현재 비밀번호를 입력하세요."
            autoComplete="off"
            className="h-[48px] sm:h-[50px] w-full rounded-[5px]"
          />
          <img
            src={isShowOldPwChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
            onClick={handleShowOldPwChecked}
            className="w-[25px] sm:w-[30px] absolute top-1/2 -translate-y-1/2 right-[20px]"
          />
        </div>

<p className="mt-10 w-full font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] mb-[11px] text-[#202123] text-left">
          새 비밀번호
        </p>
        <div className="relative w-full">
          <Input
            type={isShowPwChecked ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={onChangePassword}
            ref={passwordRef}
            placeholder="새 비밀번호를 입력하세요."
            autoComplete="off"
            className="h-[48px] sm:h-[50px] w-full rounded-[5px]"
          />
          <img
            src={isShowPwChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
            onClick={handleShowPwChecked}
            className="w-[25px] sm:w-[30px] absolute top-1/2 -translate-y-1/2 right-[20px]"
          />
        </div>
        <p
          className={`w-full font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 mb-1 ${isPassword1 ? 'text-primary' : 'text-[#00000080]'}`}
        >
          영문, 숫자, 특수문자로 구성된 8자 이상 20자 이하 입력 (공백 제외)
        </p>
        <p
          className={`w-full font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] ${isPassword2 ? 'text-primary' : 'text-[#00000080]'}`}
        >
          연속 4자 이상은 동일한 문자/숫자 제외
        </p>
        <p className="w-full font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] mb-[11px] text-[#202123] text-left m-10">
         새 비밀번호 확인
        </p>
        <div className="relative w-full">
          <Input
            type={isShowPwConfirmChecked ? 'text' : 'password'}
            id="password"
            name="password"
            value={passwordConfirm}
            onChange={onChangePasswordConfirm}
            ref={passwordConfirmRef}
            autoComplete="off"
            placeholder="새 비밀번호를 입력하세요."
            className="h-[48px] sm:h-[50px] rounded-[5px]"
          />
          <img
            src={isShowPwConfirmChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
            onClick={handleShowPwConfirmChecked}
            className="w-[25px] sm:w-[30px] absolute top-1/2 -translate-y-1/2 right-[20px]"
          />
        </div>
        <p
          className={`w-full font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 ${isPasswordConfirm ? 'text-primary' : 'text-[#00000080]'}`}
        >
          비밀번호와 일치합니다.
        </p>
        <Button
          onClick={handleSubmitChangePw}
          className="cursor-pointer w-full h-[48px] sm:h-[50px] rounded-[5px] bg-primary text-white font-semibold text-[18px] leading-[120%] tracking-[0%] mt-10"
        >
          비밀번호 변경
        </Button>
    </div>
    {isOpenModal && (
      <Modal
        isOpen={isOpenModal}
        onClose={closeModal}
        message={modalMessage}
      />
    )}
    </div>
  );
}