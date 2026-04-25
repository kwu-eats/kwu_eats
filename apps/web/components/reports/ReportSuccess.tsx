'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

export function ReportSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center bg-canvas">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50"
      >
        <Check size={40} strokeWidth={2.5} className="text-primary-500" />
      </motion.div>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6 space-y-2"
      >
        <h1 className="text-2xl font-display text-ink-primary">
          알려주셔서 고마워요!
        </h1>
        <p className="text-sm font-body text-ink-muted leading-relaxed">
          관리자가 검토 후 빠르게 반영할게요.
          <br />
          더 좋은 팡슐랭이 될 수 있게 도와주셨네요.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-10 w-full max-w-xs"
      >
        <Link
          href="/"
          className="flex w-full items-center justify-center min-h-touch-lg rounded-lg bg-primary-500 text-surface text-sm font-body font-medium"
        >
          지도로 돌아가기
        </Link>
      </motion.div>
    </div>
  );
}
