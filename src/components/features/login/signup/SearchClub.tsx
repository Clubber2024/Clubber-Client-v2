import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/apiClient';
import { useCallback, useEffect, useState } from 'react';

type SignUpSearchClubProps = {
  clubName: string;
  setClubName: React.Dispatch<React.SetStateAction<string>>;
  clubType: string;
  setClubType: React.Dispatch<React.SetStateAction<string>>;
  clubId: string;
  setClubId: React.Dispatch<React.SetStateAction<string>>;
  type: 'signup' | 'find';
  college: string;
  setCollege: React.Dispatch<React.SetStateAction<string>>;
  department: string;
  setDepartment: React.Dispatch<React.SetStateAction<string>>;
};

type Club = {
  clubId: string;
  clubName: string;
  clubType: string;
};

type College = {
  code: string;
  title: string;
};

type Department = {
  code: string;
  title: string;
};

const getClubNames = (name: string) => {
  return apiClient
    .get(`/v1/clubs/sign-up?clubName=${name}`)
    .then((res) => res.data) // API 응답에서 데이터 추출
    .catch((error) => {
      console.error('Error fetching clubs:', error);
      return [];
    });
};

export default function SearchClub({
  clubName,
  setClubName,
  clubType,
  setClubType,
  clubId,
  setClubId,
  type,
  college,
  setCollege,
  department,
  setDepartment,
}: SignUpSearchClubProps) {
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // 추천어 보이기 여부
  const [clubTypes, setClubTypes] = useState([]);
  const [isType, setIsType] = useState(false);
  const [isName, setIsName] = useState(false);
  //소모임 관리
  const [isSmall, setIsSmall] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [colleges, setColleges] = useState([]);

  //GENERAL, OFFICIAL, ETC, CENTER, SMALL
  const checkClubType = {
    공식단체: 'OFFICIAL',
    중앙동아리: 'CENTER',
    소모임: 'SMALL',
    일반동아리: 'GENERAL',
    기타: 'ETC',
  };

  //동아리 소속분야 목록 조회
  const getClubTypes = async () => {
    try {
      const res = await apiClient.get(`v1/clubs/category/club-types`);

      if (res.data.success) {
        setClubTypes(res.data.data);
        setIsType(true);
      }
    } catch (error) {
      console.error('Error fetching club types:', error);
    }
  };

  //소모임 단과대 목록 조회
  const getCollegesList = async () => {
    try {
      const res = await apiClient.get(`v1/clubs/category/colleges`);

      if (res.data.success) {
        const collegeList = res.data.data;
        setColleges(collegeList);

        if (collegeList.length > 0) {
          const firstCollege = collegeList[0].code; // 첫 번째 값
          setCollege(firstCollege); // state에 저장
          getDepartmentsList(firstCollege); // 첫 번째 값으로 학과 목록 불러오기
        }
      }
    } catch {}
  };

  //단과대 소속 학과 목록 조회
  const getDepartmentsList = async (college: string) => {
    try {
      const res = await apiClient.get(`v1/clubs/category/departments`, {
        params: {
          college: college,
        },
      });

      if (res.data.success) {
        const departmentList = res.data.data;
        setDepartments(departmentList);

        if (departmentList.length > 0) {
          const firstDepartment = departmentList[0].code;
          setDepartment(firstDepartment);
        }
      }
    } catch {}
  };

  // useCallback을 사용하여 debounce 함수 생성
  function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  // API 호출을 Debounce 적용하여 실행
  const fetchSuggestions = useCallback(
    debounce(async (searchTerm: any) => {
      if (searchTerm.trim() === '') {
        setSuggestion([]);
        setShowSuggestions(false);
        return;
      }
      const data = await getClubNames(searchTerm);
      setSuggestion(data.data);
      setShowSuggestions(true);
    }, 100), // 100ms 동안 입력이 없으면 실행
    []
  );

  useEffect(() => {
    getClubTypes();
    getCollegesList();
  }, []);

  // useEffect(() => {
  //   getClubTypes();
  //   getCollegesList();
  // }, [clubType]);

  useEffect(() => {
    if (showSuggestions && !isName && clubName.trim() !== '') {
      fetchSuggestions(clubName);
    }
  }, [clubName, fetchSuggestions, showSuggestions, isName]);
  // !isName 조건 추가해서 한번 더 뜨는 추천리스트 없애줌

  const onChangeName = (e: any) => {
    const currentName = e.target.value;
    setClubName(currentName);

    // 사용자가 타이핑을 시작할 때만 suggestion 보여주기
    if (currentName.trim() !== '' && !isName) {
      setShowSuggestions(true);
    } else if (currentName.trim() === '') {
      setShowSuggestions(false);
      setSuggestion([]);
    }

    if (currentName.length < 1) {
      setIsName(false);
      setIsType(false);
      setShowSuggestions(false);
      setSuggestion([]);
    }
  };

  const onClickDepartment = (e: any) => {
    const collegeCode = e.target.value;
    setCollege(e.target.value);
    getDepartmentsList(collegeCode);
  };

  const handleCheckboxChange = (e: any) => {
    if (isType) {
      return;
    } else {
      const value = e.target.value;
      setClubType(value);
      if (value == 'SMALL') {
        setIsSmall(true);
      } else {
        setIsSmall(false);
      }
    }
  };

  const handleClubNameSelect = (club: Club) => {
    //소속 분야갸 소모임이 아니면 단과대/학과 "ETC"로 설정
    if (type === 'signup') {
      if (club.clubType != 'SMALL') {
        setCollege('ETC');
        setDepartment('ETC');
      }
    }
    
    // 모든 상태를 한 번에 업데이트하여 리렌더링 최소화
    setIsName(true);
    setIsType(true);
    setShowSuggestions(false);
    setSuggestion([]); // suggestion 배열도 비우기
    setClubName(club.clubName);
    setClubType(club.clubType);
    setClubId(club.clubId);
  };

  /*
  //동아리명 검색 시 추천에서 선택하고 한번 더 추천리스트가 뜨는 이유
   1->2 이렇게 순서가 되어있어도 리렌더링 사이클 중 setClubName이 먼저 반영되기 때문에 useEffect가 다시 실행됨
*/
  return (
    <>
      <div className="relative w-full max-w-[370px]">
        <img src="/images/login/search.png" className="absolute w-4 top-2.5 left-2" />
        <Input
          id="name"
          name="name"
          value={clubName}
          onChange={onChangeName}
          autoComplete="off"
          placeholder="동아리명 입력"
          className="pl-7 h-[40px] rounded-[5px] text-xs sm:text-sm"
        />
      </div>
      {showSuggestions && (
        <ul
          className="list-none p-0 m-0 w-full max-w-[370px]

    w-[370px]
    bg-[#f9f9f9] border border-gray-300 rounded-[5px]
    max-h-[150px] overflow-y-auto
    scroll-snap-y mandatory
    z-[1000] "
        >
          {' '}
          {suggestion.length > 0 && suggestion.map((club: Club, index) => (
            <li
              key={index}
              className="relative pl-[27px] p-[10px] text-xs hover:bg-[#dddddd] cursor-pointer"
              onClick={()=>handleClubNameSelect(club)}
            >
              <img src="/images/login/search2.png" className="absolute w-3.5 top-2.5 left-2 " />
              {club.clubName}
            </li>
          ))}
          <li
            className="relative pl-[27px] p-[10px] text-xs hover:bg-[#dddddd] cursor-pointer"
            onClick={() => {
              setIsType(false);
              setIsName(false);
              setShowSuggestions(false);
            }}
          >
            <img src="/images/login/search2.png" className="absolute w-3.5 top-2.5 left-2 " />
            기타(직접입력)
          </li>
        </ul>
      )}
      {type === 'signup' && (
        <>
          <p
            className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px]
mb-[9px] mt-4 rounded-[5px]"
          >
            동아리 소속 분야
          </p>
          <div className="flex flex-col w-full max-w-[370px] sm:flex-row sm:gap-2 justify-between sm:justify-start align-middle">
            {' '}
            {clubTypes?.map(({ code, title }, idx) => (
              <label key={idx} htmlFor={code} className="flex items-center cursor-pointer mb-1 sm:mb-0">
                <input
                  type="radio"
                  name="clubType"
                  id={code}
                  value={code}
                  checked={clubType === code}
                  onChange={handleCheckboxChange} // 선택한 값 설정
                  className="hidden peer"
                />
                <img
                  src={
                    clubType === code
                      ? '/images/login/checkbox-color.png'
                      : '/images/login/checkbox.png'
                  }
                  className="w-4 h-4 mr-1
						"
                />
                <span className="text-xs font-semibold">{title}</span>
              </label>
            ))}
          </div>
          {clubType === 'SMALL' ? (
            <div>
              <p
                className="font-[Pretendard] font-semibold text-[16px] leading-[120%] tracking-[0px]
mb-[9px] mt-4 rounded-[5px]"
              >
                단과대 선택
              </p>
              <div>
                <form>
                  {' '}
                  <select
                    className=" w-1/2 h-[40px] text-sm rounded-[5px] border"
                    onChange={onClickDepartment}
                  >
                    {colleges.map((colleges: College) => (
                      <option key={colleges.code} value={colleges.code} className="h-[40px] text-xs sm:text-sm cursor-pointer">
                        {colleges.title}
                      </option>
                    ))}
                  </select>
                  <select
                    className=" w-1/2 h-[40px] text-sm rounded-[5px] border"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departments?.map((departments) => (
                      <option key={departments.code} value={departments.code} className="h-[40px] text-xs sm:text-sm cursor-pointer">
                        {departments.title}
                      </option>
                    ))}
                  </select>
                </form>{' '}
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </>
  );
}
