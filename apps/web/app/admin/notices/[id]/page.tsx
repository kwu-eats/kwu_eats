'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { NoticeForm } from '@/components/admin/NoticeForm';
import { useUpdateNotice } from '@/hooks/mutations/useNoticeMutations';
import { useNotice } from '@/hooks/queries/useNotices';

interface Props {
  params: { id: string };
}

export default function AdminEditNoticePage({ params }: Props) {
  const router = useRouter();
  const { data: notice, isLoading, isError } = useNotice(params.id);
  const updateNotice = useUpdateNotice();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 font-body text-xl font-semibold text-ink-primary">
        공지 수정
      </h1>

      {isLoading && (
        <div className="space-y-4">
          <div className="h-12 animate-pulse rounded-xl bg-muted" />
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-ink-muted">공지를 불러오지 못했어요</p>
      )}

      {notice && (
        <NoticeForm
          initial={{
            title: notice.title,
            content: notice.content,
            category: notice.category,
            isPinned: notice.isPinned,
          }}
          submitLabel="저장"
          isSubmitting={updateNotice.isPending}
          onCancel={() => router.push('/admin/notices')}
          onSubmit={(data) =>
            updateNotice.mutate(
              { id: params.id, data },
              {
                onSuccess: () => {
                  toast.success('공지가 수정되었어요');
                  router.push('/admin/notices');
                },
                onError: () => {
                  toast.error('수정에 실패했어요. 잠시 후 다시 시도해주세요');
                },
              },
            )
          }
        />
      )}
    </div>
  );
}
