# 팡슐랭 API (NestJS) 프로덕션 이미지
#
# 빌드:  docker build -f apps/api/Dockerfile -t pangchelin-api:latest .
# 실행:  docker run -p 4000:4000 --env-file apps/api/.env pangchelin-api:latest
#
# 멀티스테이지 구조:
#   1) builder  - 전체 의존성 + Prisma generate + nest build
#   2) deploy   - pnpm deploy 로 api + prod 의존성만 모은 후 Prisma 산출물 덮어쓰기
#   3) runner   - 비-root 유저, deploy 산출물만 들고 실행

# ===== Stage 1: builder =====
FROM node:20-alpine AS builder

# Prisma 가 OpenSSL 의존
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable

WORKDIR /workspace

# 워크스페이스 메타 파일 (캐시 효율을 위해 lockfile/패키지 정의를 먼저 복사)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json

# 전체 의존성 설치 (devDeps 포함, 빌드용)
RUN pnpm install --frozen-lockfile

# 소스 복사 (api + 공통 타입)
COPY apps/api ./apps/api
COPY packages/types ./packages/types

# Prisma client 생성 + nest build
WORKDIR /workspace/apps/api
RUN pnpm prisma generate
RUN pnpm build


# ===== Stage 2: deploy =====
# pnpm deploy 로 api 와 그 prod 의존성만 /deploy 에 셀프 컨테인드로 모은다.
FROM builder AS deploy

WORKDIR /workspace
# pnpm v10 부터 deploy 가 inject-workspace-packages 를 요구. --legacy 로 v9 동작 사용.
RUN pnpm --filter=api --legacy deploy --prod /deploy

# pnpm deploy 는 prod-only 재설치를 하므로 builder 에서 생성된 Prisma client 를 잃는다.
# 별도로 생성 산출물을 덮어쓴다.
RUN cp -R /workspace/node_modules/.prisma /deploy/node_modules/.prisma && \
    cp -R /workspace/node_modules/@prisma/client/. /deploy/node_modules/@prisma/client/


# ===== Stage 3: runner =====
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app

# 비-root 유저
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# deploy 산출물만 복사 (소스 + dist + 필수 prod node_modules + prisma schema)
COPY --from=deploy --chown=nestjs:nodejs /deploy ./

USER nestjs
EXPOSE 4000

# 마이그레이션은 별도 작업으로 실행 (배포 스크립트에서 prisma migrate deploy)
CMD ["node", "dist/main.js"]
