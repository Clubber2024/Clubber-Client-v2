'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/apiClient';
import { useEffect, useRef, useState } from 'react';
import SearchClub from './signup/SearchClub';
import axios from 'axios';
import Modal from '@/app/modal/Modal';
import { useRouter } from 'next/navigation';
import Timer from '@/components/ui/timer';

export default function SignUp() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const [id, setId] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubType, setClubType] = useState('');
  const [clubId, setClubId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [extension, setExtension] = useState('');
  const [imageKey, setImageKey] = useState('');
  const [presignedUrl, setPresignedUrl] = useState('');
  const [instagram, setInstagram] = useState('');
  const [etc, setEtc] = useState('');
  //이메일 상태 관리
  const [email, setEmail] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [code, setCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isCode, setIsCode] = useState(false);
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  //이메일 안내문구 상태관리
  const [onEmailInfo, setOnEmailInfo] = useState(false);

  //타이머 관리
  const [showTimer, setShowTimer] = useState(false);
  const [start, setStart] = useState(0);

  //유효성 검사
  const [isId1, setIsId1] = useState(false); //영숫자 유효성
  const [isId2, setIsId2] = useState(false); //영소문자 시작 유효성
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [isname, setIsName] = useState(false);
  const [isPassword1, setIsPassword1] = useState(false);
  const [isPassword2, setIsPassword2] = useState(false);
  const [isPassword3, setIsPassword3] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isShowPwChecked, setIsShowPwChecked] = useState(false);
  const [isShowPwConfirmChecked, setIsShowPwConfirmChecked] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  // 오류메세지 상태 저장
  const [idMessage1, setIdMessage1] = useState('');
  // const [idMessage2, setIdMessage2] = useState('');
  const [nameMessage, setNameMessage] = useState('');
  const [passwordMessage1, setPasswordMessage1] = useState('');
  const [passwordMessage2, setPasswordMessage2] = useState('');
  const [passwordMessage3, setPasswordMessage3] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailCodeMessage, setEmailCodeMessage] = useState('');

  //모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const [modalTotalMessage, setTotalModalMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /*localstorage 관련*/

  /*로컬스토리지는 브라우저 환경에서만 동작
  클라이언트 환경에서만 로컬 스토리지 사용해야 함*/
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken') || '');
      // localStorage 관련 작업 수행
    }
  }, []);

  //

  //회원가입 완료 api
  const postSignUp = async () => {
    try {
      const isImgUpload = await putPresignedURL();
      // if (!isImgUpload) {
      //   // setModalMessage('이미지 업로드에 실패하였습니다.');
      //   // setIsModalOpen(true);
      //   return;
      // } else if (!instagram && !etc) {
      //   setModalMessage('인스타그램 또는 기타 연락수단을 입력해주세요.');
      //   setIsModalOpen(true);
      // }
      if (instagram == '' && etc == '') {
        setModalMessage('인스타그램 또는 기타 연락수단을 입력해주세요.');
        setIsModalOpen(true);
        return;
      }

      const res = await apiClient.post(`/v1/admins/sign-up`, {
        username: id,
        password: password,
        clubType: clubType,
        college: college == '' ? 'ETC' : college,
        department: department == '' ? 'ETC' : department,
        clubName: clubName,
        email: authEmail,
        contact: {
          instagram: instagram,
          etc: etc,
        },
        imageForApproval: imageKey ? imageKey : '',
        authCode: authCode,
      });

      if (res.data.success) {
        setTotalModalMessage('회원가입을 완료하였습니다.');
        setIsTotalModalOpen(true);
        setCollege('');
        setDepartment('');
      }
    } catch {
      setCollege('');
      setDepartment('');
    }
  };

  /* 아이디 관련 */

  //아이디 중복 확인 api
  const getIdDuplicate = async () => {
    if (!isId1) return;
    try {
      const res = await apiClient.get(`/v1/admins/username/duplicate?username=${id}`);
      console.log(res.data.data.isAvailable);
      if (res.data.data.isAvailable) {
        setId(res.data.data.username);
        setIsIdAvailable(true);
        setIdMessage1('사용 가능한 아이디입니다.');
        // setIsModalOpen(true);
      } else {
        setId('');
        setModalMessage('이미 존재하는 아이디입니다.');
        setIsModalOpen(true);
      }
    } catch {}
  };
  //아이디 값 변경 함수
  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isIdAvailable) return;

    const currentId = e.target.value;
    setId(currentId);

    // 길이 조건 (6~12자)
    const lengthValid = currentId.length >= 6 && currentId.length <= 12;

    // 영문자와 숫자만 허용
    const validChars = /^[a-zA-Z0-9]+$/.test(currentId);

    // 영문+숫자가 모두 포함되어 있는지
    const hasLetter = /[a-zA-Z]/.test(currentId);
    const hasNumber = /\d/.test(currentId);

    // 1. 영문+숫자 혼합 조건
    if (lengthValid && validChars && hasLetter && hasNumber) {
      setIsId1(true);
    } else {
      setIsId1(false);
    }

    // 2. 영소문자로 시작 조건
    if (/^[a-z]/.test(currentId)) {
      setIsId2(true);
    } else {
      setIsId2(false);
    }
  };

  ///
  /*	비밀번호 관련  */
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);

    // 1. 영문+숫자+특수문자 포함, 8~20자 (공백 제외)
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-=`{}[\]:";'<>?,.\/])[^\s]{8,20}$/;

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
    // if (password !== currentPasswordConfirm) {
    //   setIsPasswordConfirm(false);
    // } else {
    //   setIsPasswordConfirm(true);
    // }
  };

  const handleShowPwChecked = () => {
    if (!passwordRef.current) return;
    setIsShowPwChecked((prev) => !prev);
  };

  const handleShowPwConfirmChecked = () => {
    if (!passwordConfirmRef.current) return;
    setIsShowPwConfirmChecked((prev) => !prev);
  };

  /* 이메일 관련 함수 */

  //인증번호 메일 전송 api
  const postSignUpCode = async (currentEmail: string) => {
    setEmail(currentEmail);
    try {
      const res = await apiClient.post(`/v1/admins/auths/sign-up/send`, {
        clubName: clubName,
        email: currentEmail,
      });

      if (res.data.success) {
        setAuthEmail(currentEmail);
        setShowTimer(true);
        setStart((prev) => prev + 1);
      }
    } catch {}
  };

  //인증번호 검증 api
  const postVerfifyCode = async () => {
    try {
      const res = await apiClient.post(`/v1/admins/auths/sign-up/verify`, {
        clubName: clubName,
        email: email,
        authCode: code,
      });
      console.log(res);
      if (res.data.success) {
        console.log(res.data);
        setIsVerifyCode(true);
        setAuthCode(code);
        setEmailCodeMessage('인증되었습니다.');
      }
    } catch {
      setIsVerifyCode(false);
      setEmailCodeMessage('인증번호를 확인해주세요.');
    }
  };

  const onChangeEmail = (e: any) => {
    if (isVerifyCode) return;
    const currentEmail = e.target.value;
    setEmail(currentEmail);
  };

  const handleEmailVerificationButton = () => {
    if (isVerifyEmail) {
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setIsVerifyEmail(false);
      setEmailMessage('올바른 이메일 형식이 아닙니다.');
      return;
    } else {
      postSignUpCode(email);
      // setIsVerifyEmail(true);
      // setEmailMessage('인증번호를 전송했습니다.');
      setEmailMessage(
        '인증번호를 발송했습니다. 인증번호가 오지 않으면 입력하신 이메일이 올바른지 확인해 주세요.'
      );
      setIsCode(true);
      setShowTimer(true);
      setStart(Date.now());
    }
  };

  //인증코드 관련 함수
  const onChangeCode = (e: any) => {
    if (isVerifyCode) {
      return;
    } else {
      const currentCode = e.target.value;
      setCode(currentCode);
    }
  };

  const handleVerfiyCode = () => {
    if (isVerifyCode) {
      return;
    } else {
      if (code) {
        postVerfifyCode();
      }
    }
  };

  //연락수단 입력
  const onChangeInsta = (e: any) => {
    const currentInsta = e.target.value;
    setInstagram(currentInsta);
  };

  const onChangeEtc = (e: any) => {
    const currentEtc = e.target.value;
    setEtc(currentEtc);
  };

  //증빙 이미지 등록 Presigned URL 생성 api
  const postVerifyPresignedURL = async (extension: any) => {
    try {
      const res = await apiClient.post(
        `/v1/images/admin/sign-up/verify`,
        {
          username: id,
          imageFileExtension: extension,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            username: id,
            imageFileExtension: extension,
          },
        }
      );
      console.log(res.data.imageKey);
      if (res.data.success) {
        console.log(res.data.data);
        setImageKey(res.data.data.imageKey);
        setPresignedUrl(res.data.data.presignedUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //이미지 파일을 presigned URl로 업로드
  const putPresignedURL = async () => {
    if (!presignedUrl || !imageFile) return false;

    try {
      await axios.put(presignedUrl, imageFile, {
        headers: { 'Content-Type': imageFile.type },
      });
      return true;
    } catch (error) {
      console.error('PUT Error:', error);
      return false;
    }
  };

  // 이미지 클릭 시 파일 업로드 입력창 클릭
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProofButton = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setFileName(file.name);
    const extension = file.name.split('.').pop().toUpperCase();
    await setExtension(extension);
    postVerifyPresignedURL(extension);
  };

  //회원가입 버튼
  const onClickSignUp = () => {
    if (!isVerifyCode) {
      setIsModalOpen(true);
      setModalMessage('회원가입은 이메일 인증 완료 후 가능합니다.');
      return;
    } else {
      postSignUp();
    }
  };

  //모달
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  //최종 모달
  const handleTotalModalClose = () => {
    setIsTotalModalOpen(false);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h1 className="font-pretendard font-semibold text-[28px] xs:text-[34px] leading-[100%] tracking-[0] text-center mt-16 xs:mt-22 mb-10 xs:mb-14 h-[34px] xs:h-[41px]">
        회원가입
      </h1>
      <div className="w-full max-w-[370px]">
        <p
          className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px]
mb-[9px]"
        >
          아이디
        </p>
        <div className="flex">
          <Input
            type="text"
            placeholder="아이디를 입력하세요."
            className="h-[40px] mr-[7px] rounded-[5px] text-xs sm:text-sm"
            value={id}
            onChange={onChangeId}
          />{' '}
          <Button className="h-[40px] rounded-[5px]" onClick={() => getIdDuplicate()}>
            중복체크
          </Button>
        </div>
        {isIdAvailable ? (
          <p
            className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 mb-1 ${isId1 ? 'text-primary' : 'text-[#00000080]'}`}
          >
            {idMessage1}
          </p>
        ) : (
          <>
            {' '}
            <p
              className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 mb-1 ${isId1 ? 'text-primary' : 'text-[#00000080]'}`}
            >
              영문, 숫자로 혼합된 6자 이상 12자 이하
            </p>
            <p
              className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] ${isId2 ? 'text-primary' : 'text-[#00000080]'}`}
            >
              영소문자 시작
            </p>
          </>
        )}

        <p
          className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
        >
          비밀번호
        </p>
        <div className="relative">
          <Input
            type={isShowPwChecked ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={onChangePassword}
            ref={passwordRef}
            placeholder="비밀번호를 입력하세요."
            autoComplete="off"
            className="h-[40px] rounded-[5px] text-xs sm:text-sm"
          />
          <img
            src={isShowPwChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
            onClick={handleShowPwChecked}
            className="w-[20px] absolute top-2.5 right-3 xs:left-[335px] xs:right-auto"
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
            value={passwordConfirm}
            onChange={onChangePasswordConfirm}
            ref={passwordConfirmRef}
            autoComplete="off"
            placeholder="비밀번호를 입력하세요."
            className="h-[40px] rounded-[5px] text-xs sm:text-sm"
          />
          <img
            src={isShowPwConfirmChecked ? '/images/login/eye.png' : '/images/login/eye-off.png'}
            onClick={handleShowPwConfirmChecked}
            className="w-[20px] absolute top-2.5 right-3 xs:left-[335px] xs:right-auto"
          />
        </div>
        <p
          className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 ${isPasswordConfirm ? 'text-primary' : 'text-[#00000080]'}`}
        >
          비밀번호와 일치합니다.
        </p>
        <p
          className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px]
mb-[9px] mt-4 rounded-[5px]"
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
          type={'signup'}
          college={college}
          setCollege={setCollege}
          department={department}
          setDepartment={setDepartment}
        />
        <p
          className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
        >
          이메일 주소
        </p>
        <p className="text-xs font-[#00000080] mb-1">
          용도: 비밀번호 찾기 (마이페이지에서 추후 수정 가능합니다.)
        </p>
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
          <Button className="h-[40px] w-[90px] sm:w-[100px] rounded-[5px]" onClick={handleEmailVerificationButton}>
            인증번호 전송
          </Button>
        </div>
        <p
          className={`font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 ${isVerifyEmail ? 'text-primary' : 'text-red-400'}`}
        >
          {emailMessage}
        </p>
        {isCode ? (
          <div>
            <p
              className="font-[Pretendard] font-semibold text-[14px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
            >
              인증 코드
            </p>
            <div className="flex flex-row justify-between">
              <div className="relative w-[262px]">
              <Input
                id="code"
                name="code"
                value={code}
                onChange={onChangeCode}
                placeholder="인증코드 입력"
                autoComplete="off"
                className="h-[40px] rounded-[5px] mr-2 text-xs sm:text-sm"
              />
              {showTimer?<Timer key={start} className="absolute top-1/2 -translate-y-1/2 right-3"/>
              :""}
              </div>
             
              <Button onClick={handleVerfiyCode} className="h-[40px] w-[90px] sm:w-[100px] rounded-[5px] rounded-[5px]">
                인증번호 확인
              </Button>
              
            </div>

            <p className="font-pretendard font-normal text-[10px] leading-[100%] tracking-[0] mt-2 text-red-400">
              {emailCodeMessage}
            </p>
          </div>
        ) : (
          ''
        )}
        <p
          className="font-[Pretendard] font-semibold text-[18px] leading-[120%] tracking-[0px] mt-8
mb-[9px]"
        >
          연락 수단
        </p>
        <p className="text-xs font-[#00000080] mb-1">
          클러버와 공식적으로 소통할 수 있는 동아리 연락 수단을 작성해주세요.
        </p>
        <p
          className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
        >
          1. 인스타그램
        </p>
        <Input
          type="text"
          placeholder="동아리 공식 인스타그램 아이디"
          className="h-[40px] mr-[7px] rounded-[5px] text-xs sm:text-sm"
          value={instagram}
          onChange={onChangeInsta}
        />
        <p
          className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
        >
          2. 기타
        </p>
        <Input
          type="text"
          placeholder="ex) 전화번호, 카카오톡 아이디 등"
          className="h-[40px] mr-[7px] rounded-[5px] text-xs sm:text-sm"
          value={etc}
          onChange={onChangeEtc}
        />
        <div>
          <p
            className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px] mt-4
mb-[9px]"
          >
            (선택) 동아리 증빙서류
          </p>
        </div>
        <div>
          <div className="relative">
            <img src="/images/login/search.png" className="absolute w-5 top-2.5 left-2" />

            <label
              htmlFor="file-upload"
              className="flex items-center pl-8 h-[40px] w-full rounded-[5px] border border-input bg-transparent text-gray-400 text-xs sm:text-sm shadow-xs cursor-pointer"
            >
              {fileName ? (
                <span className="text-gray-800">{fileName}</span>
              ) : (
                <span className="text-gray-400">파일 올리기</span>
              )}
            </label>

            <Input
              id="file-upload"
              type="file"
              accept=".png,.jpeg,.jpg"
              ref={fileInputRef}
              onChange={handleProofButton} // 파일 선택 시 이름 저장
              autoComplete="off"
              className="hidden pl-8 text-gray-800"
            />
          </div>
          <p className="text-xs font-[#00000080] mb-1">
            에브리타임 모집글, 동아리 활동 사진 등 동아리를 증빙할 수 있는 최소한의 정보
          </p>

          <Button className="w-full max-w-[370px] h-[40px] mt-8 " onClick={onClickSignUp}>
            회원가입
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} message={modalMessage} />
      )}
      {isTotalModalOpen && (
        <Modal isOpen={isTotalModalOpen} onClose={handleTotalModalClose} message={modalTotalMessage} />
      )}
    </div>
  );
}
