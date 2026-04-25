'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  name: string;
}

export function DetailHeader({ name }: Props) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
      // Hero 이미지가 약 56vw 높이 → 스크롤 200px 이상이면 이름 표시
      setNameVisible(window.scrollY > 200);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-40 flex h-14 items-center gap-2 px-2 pt-safe transition-colors duration-200',
        scrolled ? 'bg-surface shadow-card' : 'bg-transparent',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center justify-center min-h-touch min-w-touch rounded-full text-ink-primary"
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={24} strokeWidth={1.75} />
      </button>

      <span
        className={[
          'flex-1 truncate text-base font-body font-semibold text-ink-primary transition-opacity duration-300',
          nameVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {name}
      </span>
    </header>
  );
}
