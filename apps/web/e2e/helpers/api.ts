/**
 * E2E 테스트용 API 헬퍼
 * - 시드 데이터 조회 (식당 ID 등)
 * - 테스트 픽스처 생성 (제보 사전 등록 등)
 * - 관리자 토큰 발급
 */

const API_BASE = process.env.E2E_API_URL ?? 'http://localhost:4000';

export const ADMIN_CREDENTIALS = {
  email: 'admin@pangchelin.dev',
  password: 'pangchelin-admin-2026',
};

export interface SeedRestaurant {
  id: string;
  name: string;
  zone: 'KWANGWOON_STATION' | 'FRONT_GATE' | 'BACK_GATE';
}

export async function getFirstRestaurant(): Promise<SeedRestaurant> {
  const res = await fetch(`${API_BASE}/restaurants`);
  if (!res.ok) {
    throw new Error(`GET /restaurants 실패: ${res.status} ${res.statusText}`);
  }
  const data: unknown = await res.json();
  const list = Array.isArray(data) ? (data as SeedRestaurant[]) : [];
  if (list.length === 0) {
    throw new Error('식당 시드 데이터가 없어요. seed 스크립트를 먼저 실행하세요.');
  }
  return list[0];
}

export async function getRestaurantsByZone(
  zone: SeedRestaurant['zone'],
): Promise<SeedRestaurant[]> {
  const res = await fetch(`${API_BASE}/restaurants?zone=${zone}`);
  if (!res.ok) {
    throw new Error(`GET /restaurants?zone=${zone} 실패: ${res.status}`);
  }
  return (await res.json()) as SeedRestaurant[];
}

export interface SubmittedReport {
  id: string;
  status: string;
  createdAt: string;
}

export async function submitReportViaApi(
  restaurantId: string,
  content: string,
): Promise<SubmittedReport> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'RESTAURANT_INFO',
      restaurantId,
      content,
      suggestedData: {
        otherNote: 'E2E 자동화 테스트가 등록한 제보입니다',
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST /reports 실패: ${res.status} ${body}`);
  }
  return (await res.json()) as SubmittedReport;
}

export async function getAdminToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN_CREDENTIALS),
  });
  if (!res.ok) {
    throw new Error(`관리자 로그인 실패: ${res.status}`);
  }
  const data = (await res.json()) as { accessToken: string };
  return data.accessToken;
}

export function uniqueReportContent(prefix = 'E2E'): string {
  return `[${prefix} ${Date.now()}] 자동화 테스트가 등록한 제보입니다`;
}
