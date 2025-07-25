'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

const BANNERS = [
  { id: 1, src: '/images/main/banner1.png', alt: '배너1' },
  { id: 2, src: '/images/main/banner2.png', alt: '배너2' },
  { id: 3, src: '/images/main/banner3.png', alt: '배너3' },
  { id: 4, src: '/images/main/banner4.png', alt: '배너4' },
  { id: 5, src: '/images/main/banner5.png', alt: '배너5' },
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
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="w-full flex flex-col items-center">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {BANNERS.map((banner, idx) => (
            <CarouselItem key={banner.id}>
              {/* relative 있어야 이미지가 부모 스타일 따름 */}
              <div className="w-full h-64 rounded-2xl overflow-hidden flex items-center justify-center relative">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority={idx === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* 인디케이터 */}
      <div className="flex gap-2 mt-3">
        {BANNERS.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-4 h-2 rounded-full transition-all ${
              selected === idx ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
