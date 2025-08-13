"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getAdminProfile, patchAdminContact } from "./api/editMyInfo";
import TitleDiv from "@/components/ui/title-div";
import { Button } from "@/components/ui/button";
import Modal from "@/app/modal/Modal";

// import Modal from '@/app/modal/Modal'; // If you have a modal, import it here

export default function EditMyInfo() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({});
  const [contact, setContact] = useState<any>({});
  const [insta, setInsta] = useState("");
  const [etc, setEtc] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  // Fetch admin profile
  const fetchAdminProfileData = async () => {
    const res = await getAdminProfile();
    if (res.success) {
      setProfile(res.data);
      console.log(res.data);
      setContact(res.data.contact);
      setInsta(res.data.contact?.instagram||"");
      setEmail(res.data.email);
      setEtc(res.data.contact?.etc || "");
    } else {
      setIsModalOpen(true);
      setModalMessage("관리자 정보를 불러오지 못했습니다. 다시 시도해주세요.");
    }
  };

  const fetchAdminContactData = async () => {
    const res = await patchAdminContact({ instagram: insta, etc: etc });
    if (res.success) {
      setModalMessage("회원 정보 수정이 완료되었습니다.");
      setIsModalOpen(true);
    } else {
      setModalMessage("회원 정보 수정에 실패했습니다.");
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    fetchAdminProfileData();
    // eslint-disable-next-line
  }, []);

  const handleChangeEmail = () => {
    router.push("/admin/editMyInfo/email");
  };

  const handleChangePassword = () => {
    router.push("/admin/editMyInfo/pw");
  };

  const onChangeInsta = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsta(e.target.value);
  };

  const onChangeEtc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEtc(e.target.value);
  };

  const onClickCancelButton = () => {
    router.push("/admin");
  };

  const onClickSaveContact = () => {
    fetchAdminContactData();
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    router.push("/admin/mypage");
  };


  return (
    <>
      {/* Title Section */}
      <TitleDiv>
        <p className="font-bold font-sans text-[22px] leading-[100%] text-[#202123] ">
          회원정보 수정
        </p>
        </TitleDiv>
      {/* Content Section */}
      <div className="w-[463px] m-auto mt-[62px] flex flex-col items-center justify-center">
        <div className="w-full">
          <p className="w-full font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] mb-[11px] text-[#202123] text-left">
            아이디
          </p>
          <Input
            id="id"
            name="id"
            value={profile.username || ""}
            className="border border-[#9c9c9c80] rounded-[5px] w-full h-[50px] text-[#202123] pl-[11px] text-[16px] bg-[#a7a7a74d] cursor-pointer"
            placeholder="아이디 입력"
            readOnly
          />
          </div>

          <div className="mt-[35px] w-full">
            <p className="font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123]">
              비밀번호
            </p>
         
          <div className="flex flex-row  justify-between mt-[13px] mb-[20px] mr-[5px]">
            <Input
              id="password"
              name="password"
              value={"*********"}
              className="border border-[#9c9c9c80] rounded-[5px] w-[70%] h-[50px] text-[#202123] flex items-center bg-[#a7a7a74d] pl-[11px] text-[14px] font-normal"
              placeholder="이메일 입력"
              autoComplete="off"
              readOnly
            />
            <Button
              onClick={handleChangePassword}
              className={`${
                email ? "bg-primary" : "bg-[#d6d6d6]"
              } w-[25%] h-[50px] rounded-[5px] border-none font-['Noto_Sans_KR'] font-light text-[15px] text-white cursor-pointer`}
            >
              설정
            </Button>
            </div>
          </div>
          

            <div className="mt-[35px] w-full">
            <p className="font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123]">
              이메일 주소
            </p>
         
          <div className="flex flex-row  justify-between mt-[13px] mb-[20px] mr-[5px]">
            <Input
              id="email"
              name="email"
              value={email}
              className="border border-[#9c9c9c80] rounded-[5px] w-[70%] h-[50px] text-[#202123] bg-[#a7a7a74d] flex items-center pl-[11px] text-[14px] font-normal"
              placeholder="이메일 입력"
              autoComplete="off"
              readOnly
            />
            <Button
              onClick={handleChangeEmail}
              className={`${
                email ? "bg-primary" : "bg-[#d6d6d6]"
              } w-[25%] h-[50px] rounded-[5px] border-none font-['Noto_Sans_KR'] font-light text-[15px] text-white cursor-pointer`}
            >
              설정
            </Button>
            </div>
          </div>
<div className="w-full">
          <p className="mt-[55px] font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123]">
            연락수단
          </p>
        
          <p className="font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123] mt-[35px]">
            1. 인스타그램
          </p>
          <Input
            id="insta"
            name="insta"
            value={insta}
            onChange={onChangeInsta}
            className="border border-[#9c9c9c80] rounded-[5px] w-full h-[50px] text-[#202123] flex items-center pl-[11px] mt-[13px] mb-[26px] text-[16px]"
            placeholder="인스타그램 아이디 입력"
          />
          <p className="mt-[35px] font-[Pretendard Variable] font-semibold text-[18px] leading-[120%] tracking-[0%] text-[#202123]">
            2. 기타
          </p>
          <Input
            id="contact"
            name="contact"
            value={etc}
            onChange={onChangeEtc}
            className="border border-[#9c9c9c80] rounded-[5px] w-full h-[50px] text-[#202123] flex items-center pl-[11px] mt-[13px] mb-[26px] md:mb-[36px] text-[16px]"
            placeholder="기타 연락수단 입력"
          />
          </div>
          <div className="flex flex-row justify-between mb-[50%] mt-[35px] w-full">
            <Button
              className=" w-[220px] h-[50px] bg-primary border-none rounded-[5px] text-white font-regular text-[18px] text-center"
              onClick={onClickSaveContact}
            >
              수정
              </Button>
            <Button
              className="w-[220px] h-[50px] bg-[#9c9c9c] border-none rounded-[5px] text-white font-regular text-[18px] text-center"
              onClick={onClickCancelButton}
            >
              취소
            </Button>
          </div>
        
      </div>
       {isModalOpen && (
        <Modal isOpen={isModalOpen} message={modalMessage} onClose={onCloseModal} />
      )} 
    </>
  );
  
}
