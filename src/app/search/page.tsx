'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Club {
  clubId: number;
  imageUrl: string;
  clubName: string;
  introduction: string | null;
  agreeToProvideInfo: boolean;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : clubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.clubId}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-200">
                  {club.imageUrl && (
                    <Image
                      src={club.imageUrl}
                      alt={club.clubName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.clubName}</h3>
                  {club.introduction && (
                    <p className="text-gray-600 text-sm line-clamp-2">{club.introduction}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-600">검색 결과가 없습니다.</p>
              <p className="text-gray-500 text-sm mt-2">다른 검색어를 시도해보세요.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
