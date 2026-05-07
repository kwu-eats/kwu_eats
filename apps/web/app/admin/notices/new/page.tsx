'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { NoticeForm } from '@/components/admin/NoticeForm';
import { useCreateNotice } from '@/hooks/mutations/useNoticeMutations';

export default function AdminNewNoticePage() {
  const router = useRouter();
  const createNotice = useCreateNotice();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 font-body text-xl font-semibold text-ink-primary">
        공지 작성
      </h1>

      <NoticeForm
        submitLabel="등록"
        isSubmitting={createNotice.isPending}
        onCancel={() => router.push('/admin/notices')}
        onSubmit={(data) =>
          createNotice.mutate(data, {
            onSuccess: () => {
              toast.success('공지가 등록되었어요');
              router.push('/admin/notices');
            },
            onError: () => {
              toast.error('등록에 실패했어요. 잠시 후 다시 시도해주세요');
            },
          })
        }
      />
    </div>
  );
}
