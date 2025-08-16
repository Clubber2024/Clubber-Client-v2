'use client';

import { useEffect, useState } from 'react';
import { getOfficialList } from './api/official';
import { OfficialRes } from '@/types/branch/officialData';
import ClubList from '../club/ClubList';

export default function OfficialList() {
  const [officialList, setOfficialList] = useState<OfficialRes>({ clubs: [], clubType: '' });

  useEffect(() => {
    getOfficialList().then((res) => {
      setOfficialList(res);
    });
  }, []);

  return <ClubList clubs={officialList.clubs} />;
}
