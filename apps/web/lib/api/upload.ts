import { clientEnv } from '../../env';

import { ApiError } from './client';

export interface UploadResponse {
  url: string;
  key: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? '사진 업로드에 실패했어요');
  }

  return res.json() as Promise<UploadResponse>;
}
