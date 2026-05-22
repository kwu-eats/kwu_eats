import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 도메인·비즈니스 에러 분류용 코드.
 * 응답 body 의 `code` 필드로 노출되어 프론트엔드가 분기 처리할 수 있도록 안정적 식별자 역할.
 *
 * - 운영 시 사용자에게 노출되는 안전한 코드만 유지 (스택·내부 구조 노출 X)
 * - 추가 시 클라이언트 코드도 함께 갱신 (packages/types 등)
 */
export const AppErrorCode = {
  // 인증·인가
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // 입력·검증
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  BAD_REQUEST: 'BAD_REQUEST',

  // 리소스
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // 상태·정책
  RATE_LIMITED: 'RATE_LIMITED',
  POLICY_VIOLATION: 'POLICY_VIOLATION',

  // 시스템 (운영자만 의미 파악, 사용자에겐 모호하게)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_DEPENDENCY_FAILED: 'EXTERNAL_DEPENDENCY_FAILED',
} as const;

export type AppErrorCodeType = (typeof AppErrorCode)[keyof typeof AppErrorCode];

/**
 * 애플리케이션 공통 에러.
 *
 * - `code`: 안정적 식별자 (프론트 분기용)
 * - `message`: 사용자에게 보여도 안전한 한국어 메시지
 * - `cause`: (선택) 원인 객체. 로그에만 출력되며 응답 body 에는 노출 X
 *
 * 사용 예:
 *   throw new AppError(AppErrorCode.NOT_FOUND, '식당을 찾을 수 없어요', HttpStatus.NOT_FOUND);
 */
export class AppError extends HttpException {
  readonly code: AppErrorCodeType;

  constructor(
    code: AppErrorCodeType,
    message: string,
    status: number = HttpStatus.BAD_REQUEST,
    cause?: unknown,
  ) {
    // HttpException 의 cause 는 ErrorOptions.cause 로 전달.
    super({ code, message }, status, cause === undefined ? undefined : { cause });
    this.code = code;
    this.name = 'AppError';
  }
}

// ────────────────────────────────────────────────────────
// 자주 쓰는 패턴은 별도 서브클래스로 노출 — 호출부 가독성·일관성↑
// ────────────────────────────────────────────────────────
export class NotFoundError extends AppError {
  constructor(message = '요청하신 자료를 찾을 수 없어요', cause?: unknown) {
    super(AppErrorCode.NOT_FOUND, message, HttpStatus.NOT_FOUND, cause);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = '이메일 또는 비밀번호가 올바르지 않아요') {
    super(AppErrorCode.INVALID_CREDENTIALS, message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '권한이 없어요') {
    super(AppErrorCode.FORBIDDEN, message, HttpStatus.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = '이미 존재하거나 충돌하는 자료에요', cause?: unknown) {
    super(AppErrorCode.CONFLICT, message, HttpStatus.CONFLICT, cause);
  }
}

export class ExternalDependencyError extends AppError {
  constructor(
    message = '외부 서비스 호출에 실패했어요. 잠시 후 다시 시도해주세요',
    cause?: unknown,
  ) {
    super(
      AppErrorCode.EXTERNAL_DEPENDENCY_FAILED,
      message,
      HttpStatus.BAD_GATEWAY,
      cause,
    );
  }
}
