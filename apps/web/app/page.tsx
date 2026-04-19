import { clientEnv } from '../env';

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas">
      <h1 className="font-display text-display-lg text-ink-primary">
        팡슐랭
      </h1>
      <p className="mt-2 text-body-md text-ink-muted">
        광운대 맛집 가이드 — 준비 중
      </p>
      <p className="mt-4 text-caption text-ink-subtle">
        API: {clientEnv.NEXT_PUBLIC_API_URL}
      </p>
    </main>
  );
}
