import BranchHeader from '@/components/common/BranchHeader';
import CollegeList from '@/components/features/branch/CollegeList';

export default function CollegePage() {
  return (
    <>
      <BranchHeader mainTitle="단과대" subTitle="단과대" />
      <CollegeList />
    </>
  );
}
