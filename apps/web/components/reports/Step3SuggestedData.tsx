'use client';

import type { ReportType } from '@pangchelin/types';
import { Plus, Trash2 } from 'lucide-react';

import type { ReportFormState } from './reportTypes';

interface Props {
  state: ReportFormState;
  setState: (next: ReportFormState) => void;
}

const MENU_ACTIONS: Array<{ value: 'UPDATE' | 'ADD' | 'DELETE'; label: string }> = [
  { value: 'UPDATE', label: '가격 수정' },
  { value: 'ADD', label: '신메뉴 추가' },
  { value: 'DELETE', label: '단종' },
];

const inputBase =
  'h-12 w-full rounded-lg border border-border bg-surface px-3 text-base font-body text-ink-primary placeholder:text-ink-subtle focus:border-primary-500 focus:outline-none';

const labelBase = 'block text-sm font-body font-medium text-ink-body mb-1.5';

export function Step3SuggestedData({ state, setState }: Props) {
  const type = state.type as ReportType;

  function update<K extends keyof ReportFormState['suggestedData']>(
    key: K,
    value: ReportFormState['suggestedData'][K],
  ) {
    setState({
      ...state,
      suggestedData: { ...state.suggestedData, [key]: value },
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-display text-ink-primary">{getStepTitle(type)}</h2>
        <p className="mt-1 text-sm font-body text-ink-muted">{getStepDescription(type)}</p>
      </div>

      {type === 'RESTAURANT_INFO' && (
        <div className="space-y-4">
          <div>
            <label className={labelBase}>주소</label>
            <input
              type="text"
              value={state.suggestedData.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
              placeholder="새 주소"
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>전화번호</label>
            <input
              type="tel"
              value={state.suggestedData.phone ?? ''}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="02-000-0000"
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>영업시간 안내</label>
            <input
              type="text"
              value={state.suggestedData.businessHoursNote ?? ''}
              onChange={(e) => update('businessHoursNote', e.target.value)}
              placeholder="예: 평일 11:00 ~ 21:00, 주말 휴무"
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>그 외 변경사항</label>
            <textarea
              value={state.suggestedData.otherNote ?? ''}
              onChange={(e) => update('otherNote', e.target.value)}
              placeholder="그 외에 알려주실 내용"
              rows={3}
              className={`${inputBase} h-auto py-3 leading-snug`}
            />
          </div>
        </div>
      )}

      {type === 'MENU_CHANGE' && (
        <div className="space-y-4">
          <div>
            <label className={labelBase}>변경 종류</label>
            <div className="grid grid-cols-3 gap-2">
              {MENU_ACTIONS.map(({ value, label }) => {
                const isActive = state.suggestedData.action === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('action', value)}
                    className={[
                      'h-12 rounded-lg border text-sm font-body font-medium transition-colors',
                      isActive
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-border bg-surface text-ink-body',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className={labelBase}>메뉴 이름</label>
            <input
              type="text"
              value={state.suggestedData.menuName ?? ''}
              onChange={(e) => update('menuName', e.target.value)}
              placeholder="예: 김치찌개"
              className={inputBase}
            />
          </div>
          {state.suggestedData.action !== 'DELETE' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>기존 가격</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={state.suggestedData.oldPrice ?? ''}
                  onChange={(e) => update('oldPrice', e.target.value === '' ? undefined : Number(e.target.value))}
                  placeholder="원"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>새 가격</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={state.suggestedData.newPrice ?? ''}
                  onChange={(e) => update('newPrice', e.target.value === '' ? undefined : Number(e.target.value))}
                  placeholder="원"
                  className={inputBase}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {type === 'NEW_RESTAURANT' && (
        <div className="space-y-4">
          <div>
            <label className={labelBase}>식당 이름 *</label>
            <input
              type="text"
              value={state.suggestedData.name ?? ''}
              onChange={(e) => update('name', e.target.value)}
              placeholder="예: 할매분식"
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>주소 *</label>
            <input
              type="text"
              value={state.suggestedData.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
              placeholder="도로명 주소"
              className={inputBase}
            />
          </div>
          <MenusEditor
            menus={state.suggestedData.menus ?? []}
            onChange={(menus) => update('menus', menus)}
          />
        </div>
      )}

      {type === 'CLOSED' && (
        <div>
          <label className={labelBase}>폐업 정황 (선택)</label>
          <textarea
            value={state.suggestedData.reason ?? ''}
            onChange={(e) => update('reason', e.target.value)}
            placeholder="예: 지난주부터 문이 닫혀 있어요"
            rows={4}
            className={`${inputBase} h-auto py-3 leading-snug`}
          />
        </div>
      )}
    </div>
  );
}

function getStepTitle(type: ReportType): string {
  switch (type) {
    case 'RESTAURANT_INFO':
      return '어떤 정보가 다른가요?';
    case 'MENU_CHANGE':
      return '메뉴 변경 정보를 알려주세요';
    case 'NEW_RESTAURANT':
      return '새 식당 정보를 알려주세요';
    case 'CLOSED':
      return '폐업 정보를 확인해주세요';
  }
}

function getStepDescription(type: ReportType): string {
  switch (type) {
    case 'RESTAURANT_INFO':
      return '바뀐 항목만 채워주시면 돼요';
    case 'MENU_CHANGE':
      return '추가·수정·단종된 메뉴를 알려주세요';
    case 'NEW_RESTAURANT':
      return '필수 정보만 입력해도 돼요';
    case 'CLOSED':
      return '관리자가 확인 후 처리할게요';
  }
}

function MenusEditor({
  menus,
  onChange,
}: {
  menus: Array<{ name: string; price: number }>;
  onChange: (menus: Array<{ name: string; price: number }>) => void;
}) {
  return (
    <div>
      <label className={labelBase}>대표 메뉴 (선택)</label>
      <div className="space-y-2">
        {menus.map((menu, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={menu.name}
              onChange={(e) => {
                const next = [...menus];
                next[idx] = { ...next[idx], name: e.target.value };
                onChange(next);
              }}
              placeholder="이름"
              className={`${inputBase} flex-1`}
            />
            <input
              type="number"
              inputMode="numeric"
              value={menu.price || ''}
              onChange={(e) => {
                const next = [...menus];
                next[idx] = { ...next[idx], price: Number(e.target.value) || 0 };
                onChange(next);
              }}
              placeholder="가격"
              className={`${inputBase} w-24`}
            />
            <button
              type="button"
              onClick={() => onChange(menus.filter((_, i) => i !== idx))}
              className="flex h-12 w-12 items-center justify-center rounded-lg text-ink-muted"
              aria-label="메뉴 삭제"
            >
              <Trash2 size={18} strokeWidth={1.75} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...menus, { name: '', price: 0 }])}
          className="flex w-full items-center justify-center gap-2 h-12 rounded-lg border border-dashed border-border-strong text-sm font-body text-ink-muted"
        >
          <Plus size={16} strokeWidth={1.75} />
          메뉴 추가
        </button>
      </div>
    </div>
  );
}
