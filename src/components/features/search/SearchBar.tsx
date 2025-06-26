import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  // 추후 zustand로 상태관리
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: { target: { value: string } }) => {
    const query = event.target.value;
    setSearchTerm(query);
  };

  const handleSearch = () => {
    router.push(`/search?clubName=${searchTerm}`); // searchTerm 전달은 전역상태변수로
  };

  const enterKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() === '') {
      event.preventDefault();
    } else if (event.key === 'Enter' && event.target.value.trim() !== '') {
      handleSearch();
    }
  };

  return (
    <div>
      <Search />
      <Input
        type="search"
        placeholder="찾고 싶은 동아리를 검색해보세요!"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={enterKeyDown}
      />
    </div>
  );
}
