'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './bookmark.module.css';
import { getFavorites, deleteFavorite } from './api/bookmark';
import { FavoriteClub } from '@/types/bookmark/bookmarkData';
import FavoriteClubs from './FavoriteClubs';
import Modal from '@/app/modal/Modal';

export default function Bookmark() {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<FavoriteClub[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites(page);
      
      // 이전 동아리 값과 중복 제거 후 상태 저장
      setClubs((prevData) => {
        const mergedData = [...prevData, ...data.content];
        return mergedData.filter(
          (club, index, self) => index === self.findIndex((c) => c.clubId === club.clubId)
        );
      });

      setHasNextPage(data.hasNextPage);
    } catch (error) {
      setError('즐겨찾기를 불러오는데 실패했습니다.');
      console.error('Favorite fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const loadMoreBookmarks = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onClickStar = (clubId: number, favoriteId: number) => {
    setModalMessage("즐겨찾기를 해제하시겠습니까?");
    setSelectedClubId(clubId);
    setSelectedFavoriteId(favoriteId);
    setIsModalOpen(true);
  };

  const handleFavorite = async () => {
    if (!selectedClubId || !selectedFavoriteId) return;
    
    try {
      await deleteFavorite(selectedClubId, selectedFavoriteId);
      
      // 성공적으로 삭제된 경우 UI에서 제거
      setClubs((prevClubs) => prevClubs.filter((club) => club.clubId !== selectedClubId));
    } catch (error) {
      console.error('Favorite delete error:', error);
      setError('즐겨찾기 해제에 실패했습니다.');
    }
    
    setIsModalOpen(false);
    setModalMessage("");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className={styles['bookmark-div']}>
      <div className={styles.title}>나의 즐겨찾기</div>

      {clubs.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          즐겨찾기한 동아리가 없습니다.
        </div>
      ) : (
        <>
          {clubs.map((club) => (
            <div key={club.clubId} className={styles.rectangle}>
              <div className={styles['club-logo']}>
                <Image 
                  src={club.imageUrl || '/images/coming-soon.png'} 
                  alt={club.clubName}
                  width={100}
                  height={103}
                  className={styles['club-image']}
                />
              </div>
              <FavoriteClubs id={club.clubId} name={club.clubName} type={club.clubType} />
              <div className={styles['div-row']}>
                <button 
                  onClick={() => onClickStar(club.clubId, club.favoriteId)}
                  className={styles['star-button']}
                >
                  <Image 
                    src="/images/star-yellow.svg" 
                    alt="즐겨찾기"
                    width={18}
                    height={18}
                  />
                </button>
                <Link href={`/clubs/${club.clubId}`}>
                  <Image 
                    src="/images/bookmark-icon.svg" 
                    alt="동아리 상세보기"
                    width={32}
                    height={32}
                    className={styles['bookmark-icon']}
                  />
                </Link>
              </div>
            </div>
          ))}

          {hasNextPage && (
            <div className={styles['bookmark-button-div']}>
              <button onClick={loadMoreBookmarks} className={styles['more-button']}>
                ⌵
              </button>
            </div>
          )}
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        message={modalMessage} 
        onClose={closeModal} 
        onConfirm={handleFavorite}
        showConfirmButton={true}
      />
    </div>
  );
}