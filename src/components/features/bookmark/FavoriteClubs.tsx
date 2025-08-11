'use client';

import styles from './bookmark.module.css';

interface FavoriteClubsProps {
  id: number;
  type: string;
  name: string;
}

export default function FavoriteClubs({ id, type, name }: FavoriteClubsProps) {
  return (
    <div className={styles['favorite-clubs-div']}>
      <p className={styles['club-name']}>{name}</p>
      <p className={styles['club-type']}>{type}</p>
    </div>
  );
}
