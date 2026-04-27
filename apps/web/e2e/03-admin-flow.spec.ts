import { expect, test } from '@playwright/test';

import {
  ADMIN_CREDENTIALS,
  getFirstRestaurant,
  submitReportViaApi,
  uniqueReportContent,
} from './helpers/api';

/**
 * Step 6-1 시나리오 7: 관리자 로그인 → 제보 목록에서 신규 제보 확인
 *
 * 02번 테스트의 UI 제출 결과에 의존하지 않도록, beforeAll 에서 API 로
 * 직접 고유 제보 1건을 등록하고 관리자 화면에서 그 제보가 노출되는지 검증합니다.
 * (테스트 격리성/실행 순서 독립성 확보)
 *
 * 관리자 화면은 lg(1024px) 기준 사이드바 레이아웃 → desktop 프로젝트로 실행됩니다.
 */

const reportContent = uniqueReportContent('ADMIN_FLOW');

test.describe('관리자 제보 검토 플로우', () => {
  let restaurantName: string;

  test.beforeAll(async () => {
    const restaurant = await getFirstRestaurant();
    restaurantName = restaurant.name;
    await submitReportViaApi(restaurant.id, reportContent);
  });

  test('7. 관리자 로그인 후 제보 목록에서 방금 등록한 제보를 확인할 수 있다', async ({
    page,
  }) => {
    // ── 1) 로그인 페이지 진입
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: '팡슐랭' })).toBeVisible();

    // ── 2) 로그인 폼 작성 (label/htmlFor 미연결 → type/placeholder 기반)
    await page.locator('input[type="email"]').fill(ADMIN_CREDENTIALS.email);
    await page.locator('input[type="password"]').fill(ADMIN_CREDENTIALS.password);
    await page.getByRole('button', { name: '로그인' }).click();

    // ── 3) 제보 목록 페이지로 리다이렉트 → 사이드바 노출
    await expect(page).toHaveURL(/\/admin\/reports/);
    await expect(
      page.getByRole('heading', { name: '제보 관리' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /제보 관리/ }),
    ).toBeVisible();

    // ── 4) 통계 카드 노출 ("대기중", "이번 주 접수", "전체 승인률")
    await expect(page.getByText('대기중', { exact: true })).toBeVisible();
    await expect(page.getByText('이번 주 접수', { exact: true })).toBeVisible();

    // ── 5) 테이블에 신규 제보 노출 (content 가 미리보기로 표시됨)
    const reportRow = page.getByRole('row', { name: new RegExp(reportContent) });
    await expect(reportRow).toBeVisible({ timeout: 15_000 });

    // 식당명 컬럼에 시드 식당 이름 노출
    await expect(reportRow).toContainText(restaurantName);

    // 상태 뱃지 ("대기중") 노출
    await expect(reportRow).toContainText('대기중');

    // ── 6) 행 클릭 시 상세 페이지로 진입
    await reportRow.click();
    await expect(page).toHaveURL(/\/admin\/reports\/[a-z0-9]+$/);
  });
});
