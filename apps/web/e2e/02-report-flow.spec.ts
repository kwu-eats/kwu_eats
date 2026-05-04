import { expect, test } from '@playwright/test';

import { getFirstRestaurant, uniqueReportContent } from './helpers/api';

/**
 * Step 6-1 시나리오 5~6: 사용자 제보 플로우
 *
 * 5. 상세 페이지에서 "정보 제보" 버튼 → /report 진입
 * 6. 제보 폼 작성 → 성공 메시지("알려주셔서 고마워요!")
 *
 * 상세 페이지에서 진입할 때 type=RESTAURANT_INFO + restaurantId 가
 * 쿼리로 전달되므로 Step 1, 2 는 자동 건너뛰고 Step 3 에서 시작합니다.
 */

test.describe('사용자 제보 플로우', () => {
  test('5. 상세 페이지의 "정보 제보" 클릭 시 제보 폼이 열린다', async ({ page }) => {
    const restaurant = await getFirstRestaurant();

    await page.goto(`/restaurants/${restaurant.id}`);
    await expect(page.getByRole('heading', { name: restaurant.name })).toBeVisible();

    const reportLink = page.getByRole('link', { name: /정보 제보/ });
    await expect(reportLink).toBeVisible();
    await reportLink.click();

    // 제보 페이지 진입 확인 (URL 에 type & restaurantId 포함)
    await expect(page).toHaveURL(
      new RegExp(`/report\\?restaurantId=${restaurant.id}&type=RESTAURANT_INFO`),
    );
    // 헤더 타이틀
    await expect(
      page.getByRole('heading', { level: 1, name: '정보 제보' }),
    ).toBeVisible();

    // Step 3 화면 노출 확인 (RESTAURANT_INFO 시작 화면)
    await expect(
      page.getByRole('heading', { name: '어떤 정보가 다른가요?' }),
    ).toBeVisible();
  });

  test('6. 제보 폼을 작성/제출하면 성공 화면으로 전환된다', async ({ page }) => {
    const restaurant = await getFirstRestaurant();
    const content = uniqueReportContent('REPORT_FLOW');

    // 상세 페이지 → 제보 페이지로 진입 (Step 3 부터 시작)
    await page.goto(
      `/report?restaurantId=${restaurant.id}&type=RESTAURANT_INFO`,
    );
    await expect(
      page.getByRole('heading', { name: '어떤 정보가 다른가요?' }),
    ).toBeVisible();

    // ── Step 3: 변경 정보 입력 (RESTAURANT_INFO 한 항목 이상 필요)
    // label/htmlFor 미연결이라 placeholder 기반 셀렉터 사용
    await page.getByPlaceholder('02-000-0000').fill('02-940-5114');
    await page.getByRole('button', { name: '다음' }).click();

    // ── Step 4: 사진 업로드 (선택) → 그냥 다음
    await expect(page.getByRole('button', { name: '다음' })).toBeVisible();
    await page.getByRole('button', { name: '다음' }).click();

    // ── Step 5: 제보 내용 (5자 이상 필수) + 익명 제출
    await expect(
      page.getByRole('heading', { name: '마지막이에요!' }),
    ).toBeVisible();
    await page
      .getByPlaceholder('어떤 정보를 알려주시는지 적어주세요')
      .fill(content);

    const submitButton = page.getByRole('button', { name: '제출하기' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // ── 성공 화면
    await expect(
      page.getByRole('heading', { name: '알려주셔서 고마워요!' }),
    ).toBeVisible({ timeout: 15_000 });

    await expect(page.getByRole('link', { name: '지도로 돌아가기' })).toBeVisible();
  });
});
