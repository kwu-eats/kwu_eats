'use client';

import type { ReportFormState } from './reportTypes';

interface Props {
  state: ReportFormState;
  setState: (next: ReportFormState) => void;
}

const inputBase =
  'h-12 w-full rounded-lg border border-border bg-surface px-3 text-base font-body text-ink-primary placeholder:text-ink-subtle focus:border-primary-500 focus:outline-none';
const labelBase = 'block text-sm font-body font-medium text-ink-body mb-1.5';

export function Step5Reporter({ state, setState }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-display text-ink-primary">마지막이에요!</h2>
        <p className="mt-1 text-sm font-body text-ink-muted">
          제보 내용과 연락처는 익명으로 남겨도 괜찮아요
        </p>
      </div>

      <div>
        <label className={labelBase}>제보 내용 * (5자 이상)</label>
        <textarea
          value={state.content}
          onChange={(e) => setState({ ...state, content: e.target.value })}
          placeholder="어떤 정보를 알려주시는지 적어주세요"
          rows={4}
          className={`${inputBase} h-auto py-3 leading-snug`}
          maxLength={500}
        />
        <p className="mt-1 text-xs font-body text-ink-subtle text-right">
          {state.content.length} / 500
        </p>
      </div>

      <div>
        <label className={labelBase}>이름 (선택)</label>
        <input
          type="text"
          value={state.reporterName}
          onChange={(e) => setState({ ...state, reporterName: e.target.value })}
          placeholder="익명 가능"
          maxLength={20}
          className={inputBase}
        />
      </div>

      <div>
        <label className={labelBase}>연락처 (선택)</label>
        <input
          type="text"
          value={state.reporterContact}
          onChange={(e) => setState({ ...state, reporterContact: e.target.value })}
          placeholder="이메일 또는 휴대폰"
          maxLength={50}
          className={inputBase}
        />
      </div>

      <div className="rounded-lg bg-muted p-3 text-xs font-body text-ink-muted leading-snug">
        남겨주신 정보는 제보 검토 외에 사용되지 않아요.
      </div>
    </div>
  );
}
