import BranchHeader from '@/components/common/BranchHeader';
import OfficialList from '@/components/features/branch/OfficialList';

export default function OfficialPage() {
  return (
    <div>
      <BranchHeader mainTitle="공식단체" subTitle="공식단체" />
      <OfficialList />
    </div>
  );
}
