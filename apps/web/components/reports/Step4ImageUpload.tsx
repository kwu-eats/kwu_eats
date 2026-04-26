'use client';

import { Camera, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { uploadImage } from '@/lib/api/upload';

interface Props {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}

const MAX_IMAGES = 3;
const MAX_SIZE = 5 * 1024 * 1024;

export function Step4ImageUpload({ imageUrls, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - imageUrls.length;
    const toUpload = Array.from(files).slice(0, remaining);

    for (const file of toUpload) {
      if (file.size > MAX_SIZE) {
        toast.error('5MB 이하의 사진만 올릴 수 있어요');
        continue;
      }
    }

    setUploading(true);
    try {
      const results = await Promise.all(
        toUpload
          .filter((f) => f.size <= MAX_SIZE)
          .map((file) => uploadImage(file)),
      );
      onChange([...imageUrls, ...results.map((r) => r.url)]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '사진 업로드에 실패했어요';
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeAt(idx: number) {
    onChange(imageUrls.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-display text-ink-primary">증빙 사진을 올려주세요</h2>
        <p className="mt-1 text-sm font-body text-ink-muted">
          선택사항이에요. 메뉴판이나 가게 사진이 있으면 검토에 큰 도움이 돼요. (최대 3장)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-3">
        {imageUrls.map((url, idx) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <Image src={url} alt={`증빙 사진 ${idx + 1}`} fill className="object-cover" sizes="33vw" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink-primary/70 text-surface"
              aria-label="사진 삭제"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ))}

        {imageUrls.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border-strong text-ink-muted disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={24} strokeWidth={1.75} className="animate-spin" />
            ) : (
              <>
                <Camera size={24} strokeWidth={1.75} />
                <span className="text-xs font-body">사진 추가</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
