import { ClubCardRes } from '@/types/club/clubCardData';
import ClubCard from './ClubCard';

export default function ClubList({ clubs }: { clubs: ClubCardRes[] }) {
  return (
    <div
      className={`${
        clubs.length <= 4
          ? 'flex flex-wrap justify-center gap-6'
          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      }`}
    >
      {clubs.map((club) => (
        <ClubCard key={club.clubId} club={club} />
      ))}
    </div>
  );
}
