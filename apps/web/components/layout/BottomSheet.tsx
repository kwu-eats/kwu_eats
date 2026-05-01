'use client';

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { type ReactNode, useEffect, useRef } from 'react';

import { type SheetSnap, useSheetStore } from '@/lib/stores/sheetStore';

// 각 snap 단계의 화면 상단에서부터의 y 오프셋 (px 기준, 100dvh 에서 계산)
const SNAP_OFFSETS: Record<SheetSnap, number> = {
  peek: 120,   // 화면 하단 120px 노출
  half: 0.5,   // 화면의 50% (비율, 아래에서 동적 계산)
  full: 0.1,   // 화면의 90% (비율)
};

function getSnapY(snap: SheetSnap, windowHeight: number): number {
  if (snap === 'peek') return windowHeight - SNAP_OFFSETS.peek;
  if (snap === 'half') return windowHeight * SNAP_OFFSETS.half;
  return windowHeight * SNAP_OFFSETS.full;
}

interface BottomSheetProps {
  children: ReactNode;
}

export function BottomSheet({ children }: BottomSheetProps) {
  const { snap, setSnap } = useSheetStore();
  const y = useMotionValue(0);
  const windowHeight = useRef(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );

  // snap 변경 시 애니메이션
  useEffect(() => {
    const target = getSnapY(snap, windowHeight.current);
    animate(y, target, { type: 'spring', stiffness: 400, damping: 40 });
  }, [snap, y]);

  // 초기 위치 설정
  useEffect(() => {
    y.set(getSnapY('peek', windowHeight.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 드래그 종료 시 가장 가까운 snap으로 이동
  function handleDragEnd() {
    const currentY = y.get();
    const h = windowHeight.current;
    const snaps: SheetSnap[] = ['peek', 'half', 'full'];
    const closest = snaps.reduce((prev, cur) => {
      const prevDist = Math.abs(getSnapY(prev, h) - currentY);
      const curDist = Math.abs(getSnapY(cur, h) - currentY);
      return curDist < prevDist ? cur : prev;
    });
    setSnap(closest);
  }

  // 배경 오버레이 불투명도 (full 상태일 때만 살짝)
  const overlayOpacity = useTransform(
    y,
    [getSnapY('full', windowHeight.current), getSnapY('peek', windowHeight.current)],
    [0.3, 0],
  );

  return (
    <>
      {/* 배경 오버레이 (full 상태 시) */}
      <motion.div
        className="fixed inset-0 z-20 bg-ink-primary pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="fixed inset-x-0 bottom-0 z-30 flex flex-col bg-surface rounded-t-xl shadow-sheet"
        style={{ y, height: '100dvh' }}
        drag="y"
        dragConstraints={{
          top: getSnapY('full', windowHeight.current),
          bottom: getSnapY('peek', windowHeight.current),
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="h-1 w-9 rounded-full bg-border-strong" />
        </div>

        {/* 콘텐츠 영역 (스크롤) */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain pb-safe"
          style={{ touchAction: snap === 'full' ? 'pan-y' : 'none' }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
