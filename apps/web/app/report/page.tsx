'use client';

import type { CreateReportRequest, ReportType, SuggestedData } from '@pangchelin/types';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ReportStepper } from '@/components/reports/ReportStepper';
import { ReportSuccess } from '@/components/reports/ReportSuccess';
import { Step1TypeSelect } from '@/components/reports/Step1TypeSelect';
import { Step2RestaurantSelect } from '@/components/reports/Step2RestaurantSelect';
import { Step3SuggestedData } from '@/components/reports/Step3SuggestedData';
import { Step4ImageUpload } from '@/components/reports/Step4ImageUpload';
import { Step5Reporter } from '@/components/reports/Step5Reporter';
import { initialFormState, type ReportFormState } from '@/components/reports/reportTypes';
import { useSubmitReport } from '@/hooks/mutations/useSubmitReport';

const TOTAL_STEPS = 5;

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitMutation = useSubmitReport();

  const initial = useMemo<ReportFormState>(() => {
    const restaurantId = searchParams.get('restaurantId');
    const typeParam = searchParams.get('type') as ReportType | null;
    return {
      ...initialFormState,
      type: typeParam ?? null,
      restaurantId,
    };
  }, [searchParams]);

  const [state, setState] = useState<ReportFormState>(initial);
  // 식당 사전 선택 + 타입 사전 선택 시 Step 2 건너뛰기
  const [step, setStep] = useState<number>(() => {
    if (initial.type && initial.restaurantId) return 3;
    if (initial.type) return 2;
    return 1;
  });
  const [success, setSuccess] = useState(false);

  const isNewRestaurant = state.type === 'NEW_RESTAURANT';
  // NEW_RESTAURANT는 Step 2 건너뛰기
  const effectiveStep = step;

  function goNext() {
    if (step === 1 && isNewRestaurant) {
      setStep(3);
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function goPrev() {
    if (step === 3 && isNewRestaurant) {
      setStep(1);
      return;
    }
    if (step === 1) {
      router.back();
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  }

  function canGoNext(): boolean {
    switch (effectiveStep) {
      case 1:
        return !!state.type;
      case 2:
        return !!state.restaurantId;
      case 3:
        return validateStep3(state);
      case 4:
        return true; // 사진 선택사항
      case 5:
        return state.content.trim().length >= 5;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    if (!state.type) return;
    if (!canGoNext()) {
      toast.error('제보 내용을 5자 이상 입력해주세요');
      return;
    }

    const payload: CreateReportRequest = {
      type: state.type,
      restaurantId: state.restaurantId ?? undefined,
      menuId: state.menuId ?? undefined,
      reporterName: state.reporterName.trim() || undefined,
      reporterContact: state.reporterContact.trim() || undefined,
      content: state.content.trim(),
      suggestedData: buildSuggestedData(state),
      imageUrls: state.imageUrls,
    };

    try {
      await submitMutation.mutateAsync(payload);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : '제출에 실패했어요. 잠시 후 다시 시도해주세요';
      toast.error(message);
    }
  }

  if (success) {
    return <ReportSuccess />;
  }

  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 bg-surface border-b border-border pt-safe">
        <div className="flex items-center gap-2 px-2 h-14">
          <button
            type="button"
            onClick={goPrev}
            className="flex items-center justify-center min-h-touch min-w-touch text-ink-primary"
            aria-label="이전 단계"
          >
            <ChevronLeft size={24} strokeWidth={1.75} />
          </button>
          <h1 className="flex-1 text-base font-body font-semibold text-ink-primary">
            정보 제보
          </h1>
        </div>
        <div className="px-4 pb-3">
          <ReportStepper current={step} total={TOTAL_STEPS} />
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 px-4 py-6 pb-32">
        {step === 1 && (
          <Step1TypeSelect
            value={state.type}
            onChange={(type) => setState({ ...state, type, suggestedData: {} })}
          />
        )}
        {step === 2 && (
          <Step2RestaurantSelect
            selectedId={state.restaurantId}
            onSelect={(id, restaurant) =>
              setState({ ...state, restaurantId: id, restaurantName: restaurant.name })
            }
          />
        )}
        {step === 3 && <Step3SuggestedData state={state} setState={setState} />}
        {step === 4 && (
          <Step4ImageUpload
            imageUrls={state.imageUrls}
            onChange={(urls) => setState({ ...state, imageUrls: urls })}
          />
        )}
        {step === 5 && <Step5Reporter state={state} setState={setState} />}
      </main>

      {/* 하단 네비 */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 bg-surface border-t border-border px-4 pt-3 pb-safe">
        <button
          type="button"
          onClick={goPrev}
          className="flex flex-1 items-center justify-center min-h-touch-lg rounded-lg border border-border bg-surface text-ink-body text-sm font-body font-medium"
        >
          이전
        </button>
        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canGoNext() || submitMutation.isPending}
            className="flex flex-1 items-center justify-center min-h-touch-lg rounded-lg bg-primary-500 text-surface text-sm font-body font-medium disabled:opacity-50"
          >
            {submitMutation.isPending ? '보내는 중...' : '제출하기'}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex flex-1 items-center justify-center min-h-touch-lg rounded-lg bg-primary-500 text-surface text-sm font-body font-medium disabled:opacity-50"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

function validateStep3(state: ReportFormState): boolean {
  const d = state.suggestedData;
  switch (state.type) {
    case 'RESTAURANT_INFO':
      return !!(d.phone || d.address || d.businessHoursNote || d.otherNote);
    case 'MENU_CHANGE':
      return !!(d.menuName && d.action);
    case 'NEW_RESTAURANT':
      return !!(d.name && d.address);
    case 'CLOSED':
      return true;
    default:
      return false;
  }
}

function buildSuggestedData(state: ReportFormState): SuggestedData {
  const d = state.suggestedData;
  switch (state.type) {
    case 'RESTAURANT_INFO':
      return {
        phone: d.phone,
        address: d.address,
        businessHoursNote: d.businessHoursNote,
        otherNote: d.otherNote,
      } as SuggestedData;
    case 'MENU_CHANGE':
      return {
        menuName: d.menuName!,
        action: d.action!,
        oldPrice: d.oldPrice,
        newPrice: d.newPrice,
      };
    case 'NEW_RESTAURANT':
      return {
        name: d.name!,
        address: d.address!,
        latitude: d.latitude,
        longitude: d.longitude,
        menus: d.menus,
      };
    case 'CLOSED':
      return { reason: d.reason };
    default:
      return {} as SuggestedData;
  }
}
