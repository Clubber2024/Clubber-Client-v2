import { Input } from '@/components/ui/input';
import { Search, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { searchClub } from './api/searchClub';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 최근 검색어 저장
  const saveRecentSearch = (term: string) => {
    if (term.trim() === '') return;

    const updated = [term, ...recentSearches.filter((item) => item !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 개별 검색어 삭제
  const deleteSearchTerm = (term: string) => {
    const updated = recentSearches.filter((item) => item !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 전체 검색어 삭제
  const deleteAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    const query = event.target.value;
    setSearchTerm(query);
  };

  const performSearch = async (term: string) => {
    if (term.trim() === '') return;

    setLoading(true);
    try {
      // searchClub API 호출
      const result = await searchClub({ clubName: term });

      // 검색어 저장
      saveRecentSearch(term);

      // 검색 결과를 URL 파라미터로 전달하여 검색 페이지로 이동
      router.push(`/search?clubName=${encodeURIComponent(term)}`);

      onClose?.();
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      // 에러가 발생해도 검색어는 저장하고 검색 페이지로 이동
      saveRecentSearch(term);
      router.push(`/search?clubName=${encodeURIComponent(term)}`);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch(searchTerm);
  };

  const handleSearchClick = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const enterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Enter' && target.value.trim() === '') {
      event.preventDefault();
    } else if (event.key === 'Enter' && target.value.trim() !== '') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      {/* 검색 입력창 */}
      <div className="relative mb-2 px-4">
        <Input
          type="search"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={enterKeyDown}
          className="pr-12 text-lg border-0 focus:border-0 focus:ring-0 focus:outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none"
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }}
          disabled={loading}
        />
        <Search
          className={`absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-primary/60 ${
            loading ? 'text-gray-400' : 'text-primary'
          }`}
          size={25}
          onClick={!loading ? handleSearch : undefined}
        />
      </div>

      <div className="w-full border-b-[1.5px] border-primary" />

      {/* 최근 검색어 */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex justify-between items-center p-4 text-sm text-gray-400">
            <h3 className=" font-medium">최근 검색어</h3>
            <button onClick={deleteAllSearches} className=" hover:text-gray-700 transition-colors">
              전체 삭제
            </button>
          </div>

          <div>
            {recentSearches.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between pl-5 pr-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => !loading && handleSearchClick(term)}
              >
                <div className="flex items-center gap-2">
                  <Clock size={13} fill="#DDDDDD80" className="text-gray-400" />
                  <span className="text-sm text-gray-800">{term}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSearchTerm(term);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
