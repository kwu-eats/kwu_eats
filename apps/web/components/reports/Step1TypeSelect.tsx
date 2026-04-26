'use client';

import type { ReportType } from '@pangchelin/types';
import { Info, MapPinOff, Plus, Utensils } from 'lucide-react';

interface Props {
  value: ReportType | null;
  onChange: (type: ReportType) => void;
}

const OPTIONS: Array<{
  type: ReportType;
  title: string;
  description: string;
  Icon: typeof Info;
}> = [
  {
    type: 'RESTAURANT_INFO',
    title: '정보가 달라요',
    description: '주소·전화·영업시간 정정',
    Icon: Info,
  },
  {
    type: 'MENU_CHANGE',
    title: '메뉴가 바뀌었어요',
    description: '가격·신메뉴·단종',
    Icon: Utensils,
  },
  {
    type: 'NEW_RESTAURANT',
    title: '새 식당 알려드려요',
    description: '아직 등록 안 된 곳',
    Icon: Plus,
  },
  {
    type: 'CLOSED',
    title: '폐업한 것 같아요',
    description: '문 닫힌 가게 신고',
    Icon: MapPinOff,
  },
];

export function Step1TypeSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-display text-ink-primary">어떤 정보를 알려주실 건가요?</h2>
        <p className="mt-1 text-sm font-body text-ink-muted">알맞은 항목을 선택해주세요</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map(({ type, title, description, Icon }) => {
          const isActive = value === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={[
                'flex min-h-[120px] flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors',
                isActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-border bg-surface',
              ].join(' ')}
            >
              <Icon
                size={24}
                strokeWidth={1.75}
                className={isActive ? 'text-primary-500' : 'text-ink-muted'}
              />
              <span
                className={[
                  'text-sm font-body font-semibold',
                  isActive ? 'text-primary-600' : 'text-ink-primary',
                ].join(' ')}
              >
                {title}
              </span>
              <span className="text-xs font-body text-ink-muted leading-snug">
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
