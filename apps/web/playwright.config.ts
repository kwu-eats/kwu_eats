import { defineConfig, devices } from '@playwright/test';

/**
 * 팡슐랭 E2E 테스트 설정
 *
 * 로컬 실행:
 *   1) docker compose up   (web/api/postgres 기동)
 *   2) pnpm --filter web e2e:install   (최초 1회 브라우저 설치)
 *   3) pnpm --filter web e2e
 *
 * Docker 컨테이너에서 실행:
 *   docker compose -f docker-compose.yml -f docker-compose.e2e.yml \
 *     run --rm playwright
 *
 * 환경 변수:
 *   E2E_BASE_URL  - 웹 서버 주소 (기본 http://localhost:3000)
 *   E2E_API_URL   - API 서버 주소 (기본 http://localhost:4000)
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // DB 상태 의존 테스트가 있어 순차 실행
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: /0[12]-.*\.spec\.ts$/,
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /03-.*\.spec\.ts$/,
    },
  ],
});
