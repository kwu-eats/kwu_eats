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

// SSR/client hydration mismatch 방지를 위해 window 비의존 상수로 시작.
// 어떤 viewport 높이보다도 큰 값이라 시트가 화면 아래에 위치 → 첫 paint 시 안 보임.
// mount 후 useEffect 에서 실제 windowHeight 기반 snap 위치로 spring 애니메이션.
const SAFE_BELOW_VIEWPORT = 9999;

export function BottomSheet({ children }: BottomSheetProps) {
  const { snap, setSnap } = useSheetStore();
  const windowHeight = useRef(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );
  const y = useMotionValue(SAFE_BELOW_VIEWPORT);

  // mount 및 snap 변경 시 spring 애니메이션 — 첫 mount 도 아래에서 위로 올라옴
  useEffect(() => {
    const target = getSnapY(snap, windowHeight.current);
    animate(y, target, { type: 'spring', stiffness: 400, damping: 40 });
  }, [snap, y]);

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

  // 스크롤 영역의 최대 높이 = 시트의 viewport 안에 보이는 부분 - 드래그 핸들(약 30px).
  // 시트 자체 height 가 100dvh 라 그대로 두면 스크롤 영역이 viewport 밖까지 늘어나
  // 스크롤 max 위치에서 마지막 아이템이 화면 가장자리 너머에 가려지는 문제가 있음.
  const scrollMaxHeight = useTransform(y, (val) =>
    Math.max(60, windowHeight.current - val - 30),
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

        {/* 콘텐츠 영역 (스크롤) — maxHeight 로 viewport 가시 영역에 맞춤.
            half 에서도 touchAction: pan-y 로 스크롤 허용 (peek 만 드래그 우선) */}
        <motion.div
          className="overflow-y-auto overscroll-contain pb-safe"
          style={{
            maxHeight: scrollMaxHeight,
            touchAction: snap === 'peek' ? 'none' : 'pan-y',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}
