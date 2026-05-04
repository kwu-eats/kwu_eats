# 팡슐랭 Web (Next.js) 프로덕션 이미지
#
# 빌드:  docker build -f apps/web/Dockerfile -t pangchelin-web:latest .
# 실행:  docker run -p 3000:3000 --env-file apps/web/.env pangchelin-web:latest
#
# Next.js standalone output 사용 (next.config.js 의 output: 'standalone').
# standalone 은 server.js + 최소 node_modules 만 포함하므로 매우 가벼움.
#
# 멀티스테이지 구조:
#   1) deps     - 의존성 설치 캐시 레이어
#   2) builder  - next build (standalone 출력)
#   3) runner   - 비-root 유저, standalone + static + public 만 실행

# ===== Stage 1: deps =====
FROM node:25-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /workspace

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json

# 빌드용 전체 의존성 설치
RUN pnpm install --frozen-lockfile


# ===== Stage 2: builder =====
FROM node:25-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /workspace

# 의존성 + 메타 복사
COPY --from=deps /workspace/node_modules ./node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json

# 소스 (web + 공통 타입)
COPY apps/web ./apps/web
COPY packages/types ./packages/types

# Next 빌드 (NEXT_PUBLIC_* 는 빌드 시점에 인라인되므로 build-args 로 주입 가능)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_KAKAO_MAP_KEY
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_KAKAO_MAP_KEY=${NEXT_PUBLIC_KAKAO_MAP_KEY}
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /workspace/apps/web
RUN pnpm build


# ===== Stage 3: runner =====
FROM node:25-alpine AS runner

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# 비-root 유저
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 출력 = 워크스페이스 트리 보존 (apps/web/.next/standalone 안에
# /apps/web/server.js 와 hoisted node_modules 가 함께 들어 있음).
# outputFileTracingRoot 가 monorepo root 라 standalone 내부 구조도 그대로.
COPY --from=builder --chown=nextjs:nodejs /workspace/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /workspace/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
