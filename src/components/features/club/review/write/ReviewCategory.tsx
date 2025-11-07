'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewKeyword } from '@/types/review/reviewKeyword';
import { getReviewKeyword } from '../api/reviewWrite';
import { useEffect, useState } from 'react';
import Modal from '@/app/modal/Modal';

interface ReviewCategoryProps {
  onNext: (selectedKeywords: string[]) => void;
}

export default function ReviewCategory({ onNext }: ReviewCategoryProps) {
  const [categoryList, setCategoryList] = useState<ReviewKeyword[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 카테고리 이름 매핑
  const getCategoryDisplayName = (categoryName: string) => {
    const categoryMap: { [key: string]: string } = {
      ACTIVITY_STYLE: '🔥 활동 스타일',
      CULTURE: '✨ 분위기',
      ACTIVITY: '🏆 경험',
      COST: '💰 비용',
      MANAGE: '🧑‍💻 운영진',
      TIME_AND_ENGAGEMENT: '🕒 시간/참여도',
      RECRUITMENT: '📄 가입/선발',
      MEMBER: '👥 구성원',
    };
    return categoryMap[categoryName] || categoryName;
  };

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const categoryList = await getReviewKeyword();
        setCategoryList(categoryList);
      } catch (error) {
        console.error('키워드 목록을 불러오는데 실패했습니다:', error);
        // 에러 발생 시 빈 배열로 설정
        setCategoryList([]);
      }
    };
    fetchCategoryList();
  }, []);

  const handleKeywordClick = (keywordCode: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keywordCode)) {
        return prev.filter((code) => code !== keywordCode);
      } else {
        return [...prev, keywordCode];
      }
    });
  };

  const handleNext = () => {
    if (selectedKeywords.length >= 3 && selectedKeywords.length <= 5) {
      onNext(selectedKeywords);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="flex flex-col justify-center items-center mb-4 sm:mb-6 md:mb-8 gap-1">
        <h2 className="text-base sm:text-lg font-bold text-center px-2">
          이 동아리, 어떤 게 마음에 들었나요?
        </h2>
        <p className="text-xs sm:text-sm text-[#707070] font-medium text-center px-2">
          동아리를 표현하는 키워드를 선택해주세요. (필수 3개 ~ 5개)
        </p>
      </div>
      <Card className="bg-[#FCFDFF] pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-4 sm:px-6 md:px-10 lg:px-14 w-full sm:w-[95%] md:w-[90%] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mx-auto">
          {categoryList.map((category) => (
            <div
              key={category.reviewKeywordCategory}
              className="flex flex-col gap-2 justify-start items-start mb-4 sm:mb-5 md:mb-7"
            >
              <h3 className="text-xs sm:text-sm font-semibold text-left sm:text-center mb-2 w-full">
                {getCategoryDisplayName(category.reviewKeywordCategory)}
              </h3>
              {category.keywords.map((keyword) => {
                const isSelected = selectedKeywords.includes(keyword.code);
                return (
                  <Card
                    key={keyword.code}
                    onClick={() => handleKeywordClick(keyword.code)}
                    className={`py-1.5 px-2.5 sm:py-1.5 sm:px-2.5 rounded-[5px] shadow-xs text-[11px] sm:text-[12px] md:text-[13px] cursor-pointer hover:scale-102 transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#71B1DD1A] text-[#5C94BA] border-[#5C94BA] hover:border-primary font-semibold'
                        : 'text-[#52555B] hover:bg-[#71B1DD1A] hover:text-primary hover:border-primary'
                    }`}
                  >
                    {keyword.title}
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
      <Button
        onClick={handleNext}
        className="w-full sm:w-48 md:w-50 mx-auto bg-primary text-white text-sm font-semibold rounded-[3px] mt-6 sm:mt-8 px-4 py-2"
      >
        다음
      </Button>
      <Modal
        isOpen={isModalOpen}
        message="키워드를 3개 이상 5개 이하로 선택해주세요."
        onClose={() => setIsModalOpen(false)}
        showConfirmButton={false}
      />
    </div>
  );
}
