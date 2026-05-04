import { COLLEGE_LABELS, type RestaurantPartnership } from '@pangchelin/types';
import { ExternalLink } from 'lucide-react';

interface Props {
  partnerships: RestaurantPartnership[];
}

/**
 * 식당 상세 페이지의 제휴 안내 섹션.
 * 단과대학 칩 = 클릭 시 해당 (식당 × 단과대학) 의 인스타 안내 게시글 열림.
 */
export function PartnerInfo({ partnerships }: Props) {
  if (!partnerships || partnerships.length === 0) return null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-body font-semibold text-ink-primary">
          🤝 제휴 안내
        </h2>
        <p className="mt-0.5 text-xs text-ink-muted">
          단과대학을 누르면 안내 게시글로 이동해요
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {partnerships.map((p) => (
          <li key={p.id}>
            <a
              href={p.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-touch items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700 transition-colors active:bg-accent-100"
            >
              <span>{COLLEGE_LABELS[p.college]}</span>
              <ExternalLink size={14} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
