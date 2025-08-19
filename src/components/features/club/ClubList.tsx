import { ClubCardRes } from '@/types/club/clubCardData';
import ClubCard from './ClubCard';

export default function ClubList({ clubs }: { clubs: ClubCardRes[] }) {
  return (
    <div className="px-4 md:px-0 flex justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
        {clubs.map((club) => (
          <ClubCard key={club.clubId} club={club} />
        ))}
      </div>
    </div>
  );
}
