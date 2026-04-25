'use client';

import type { Menu } from '@pangchelin/types';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  menus: Menu[];
  name: string;
}

export function RestaurantHero({ menus, name }: Props) {
  const images = menus.filter((m) => m.imageUrl).map((m) => m.imageUrl!);
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative w-full bg-muted flex items-center justify-center" style={{ aspectRatio: '16/10' }}>
        <div className="flex flex-col items-center gap-2 text-ink-subtle">
          <ImageOff size={36} strokeWidth={1.5} />
          <span className="text-sm font-body">사진이 없어요</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: '16/10' }}>
      <Image
        src={images[activeIdx]}
        alt={`${name} 사진 ${activeIdx + 1}`}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* 멀티 이미지 페이지 도트 */}
      {images.length > 1 && (
        <>
          {/* 좌우 스와이프 영역 */}
          <div className="absolute inset-0 flex">
            <button
              type="button"
              className="flex-1"
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
              aria-label="이전 사진"
            />
            <button
              type="button"
              className="flex-1"
              onClick={() => setActiveIdx((i) => Math.min(images.length - 1, i + 1))}
              aria-label="다음 사진"
            />
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`${i + 1}번 사진`}
                className={[
                  'h-1.5 rounded-full transition-all duration-200',
                  i === activeIdx ? 'w-4 bg-surface' : 'w-1.5 bg-surface/50',
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
