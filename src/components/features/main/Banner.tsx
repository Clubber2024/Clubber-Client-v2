'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import Link from 'next/link';

const BANNERS = [
  {
    id: 1,
    mobileSrc: '/images/main/mob1.png',
    src: '/images/main/banner1.png',
    url: '/',
    alt: '배너1',
  },
  {
    id: 2,
    mobileSrc: '/images/main/mob2.png',
    src: '/images/main/banner2.png',
    url: '/mypage',
    alt: '배너2',
  },
  {
    id: 3,
    mobileSrc: '/images/main/mob3.png',
    src: '/images/main/banner3.png',
    url: '/summary',
    alt: '배너3',
  },
  {
    id: 4,
    mobileSrc: '/images/main/mob4.png',
    src: '/images/main/banner4.png',
    url: '/',
    alt: '배너4',
  },
];

export default function Banner() {
  const [selected, setSelected] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Embla Carousel의 API를 받아서 현재 인덱스 추적
  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelected(api.selectedScrollSnap());

    api.on('select', onSelect);
    // 초기값 설정
    setSelected(api.selectedScrollSnap());

    // 자동 슬라이드 시작
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // 5초마다 자동 슬라이드

    return () => {
      api.off('select', onSelect);
      clearInterval(interval);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
          skipSnaps: false,
        }}
      >
        <CarouselContent>
          {BANNERS.map((banner, idx) => (
            <CarouselItem key={banner.id}>
              <Link href={banner.url}>
                <div className="w-full h-48 md:h-86 rounded-xl overflow-hidden flex items-center justify-center relative">
                  <Image
                    src={banner.mobileSrc}
                    alt={banner.alt}
                    fill
                    priority={idx === 0}
                    className="md:hidden"
                  />
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    priority={idx === 0}
                    className="hidden md:block"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 네비게이션 버튼 */}
        {/* <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-0 shadow-lg" />
        <CarouselNext className="right-2 bg-white/80 hover:bg-white border-0 shadow-lg" /> */}
      </Carousel>

      {/* 인디케이터 */}
      <div className="flex gap-2 mt-3">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`inline-block rounded-full transition-all ${
              selected === idx ? 'w-4 h-2 bg-primary' : 'w-2 h-2 bg-gray-300'
            } hover:bg-primary/80`}
          />
        ))}
      </div>
    </div>
  );
}
