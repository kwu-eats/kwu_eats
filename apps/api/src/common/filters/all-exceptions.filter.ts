import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { AppError, AppErrorCode, AppErrorCodeType } from '../errors/app-error';

interface RequestLike {
  url: string;
  method: string;
  headers?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  status(code: number): ResponseLike;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

/**
 * 전역 예외 핸들러.
 *
 * 응답 본문은 항상 다음 형태로 정규화한다:
 *   {
 *     code: 'NOT_FOUND',           // 안정적 식별자 (AppErrorCode 또는 HTTP_상태 기반)
 *     message: '식당을 찾을 수 없어요', // 사용자에게 보여도 안전한 메시지
 *     requestId: 'abc-123',        // X-Request-ID 헤더와 동일 (장애 추적용)
 *     timestamp: '2026-...',
 *     path: '/api/restaurants/xyz'
 *   }
 *
 * 보안 정책:
 * - production 에서는 스택 트레이스·내부 객체 응답 노출 금지
 * - 5xx 에러는 사용자에게 모호하게 ("일시적 문제…") — 정확한 원인은 서버 로그에만
 * - validation 실패의 NestJS 기본 array message 는 그대로 노출 (사용자에게 무엇이 잘못됐는지 알려야 함)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ResponseLike>();
    const request = ctx.getRequest<RequestLike>();
    const requestId = this.extractRequestId(request);

    const { status, code, message } = this.normalize(exception);

    // 로그: requestId·method·path·status + (필요 시) 원인 스택
    // 4xx 는 INFO, 5xx 는 ERROR 로 분리
    const logPayload = {
      requestId,
      method: request.method,
      path: request.url,
      status,
      code,
    };
    if (status >= 500) {
      this.logger.error(
        JSON.stringify(logPayload),
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status >= 400) {
      this.logger.warn(JSON.stringify(logPayload));
    }

    response.setHeader('X-Request-ID', requestId);
    response.status(status).json({
      code,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  /**
   * 다양한 예외 타입을 표준 응답으로 매핑.
   * - AppError: 그대로 사용 (code/message/status 보유)
   * - HttpException: NestJS 기본 — getResponse() 에서 message 추출
   * - 그 외 (DB·런타임 등): production 에선 의도적으로 모호하게
   */
  private normalize(exception: unknown): {
    status: number;
    code: AppErrorCodeType | string;
    message: string | string[];
  } {
    if (exception instanceof AppError) {
      const body = exception.getResponse() as { code: string; message: string };
      return {
        status: exception.getStatus(),
        code: body.code,
        message: body.message,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message = this.extractMessage(res);
      return {
        status,
        code: this.codeForStatus(status),
        message,
      };
    }

    // 예측 못 한 에러 — 운영에선 절대 내부 정보 노출 금지
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: AppErrorCode.INTERNAL_ERROR,
      message: this.isProduction
        ? '일시적 문제로 요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요'
        : String((exception as Error)?.message ?? exception),
    };
  }

  private extractMessage(res: unknown): string | string[] {
    if (typeof res === 'string') return res;
    if (res && typeof res === 'object' && 'message' in res) {
      const m = (res as { message: unknown }).message;
      if (typeof m === 'string' || Array.isArray(m)) return m;
    }
    return '요청을 처리하지 못했어요';
  }

  /**
   * Nginx 가 발급한 X-Request-ID 가 있으면 그대로 사용 (추적 일관성),
   * 없으면 fallback uuid 생성.
   */
  private extractRequestId(request: RequestLike): string {
    const fromHeader = request.headers?.['x-request-id'];
    if (typeof fromHeader === 'string' && fromHeader.length > 0) {
      return fromHeader;
    }
    // crypto.randomUUID 는 Node 14.17+ 표준
    return globalThis.crypto?.randomUUID?.() ?? `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private codeForStatus(status: number): string {
    switch (status) {
      case 400:
        return AppErrorCode.BAD_REQUEST;
      case 401:
        return AppErrorCode.UNAUTHORIZED;
      case 403:
        return AppErrorCode.FORBIDDEN;
      case 404:
        return AppErrorCode.NOT_FOUND;
      case 409:
        return AppErrorCode.CONFLICT;
      case 422:
        return AppErrorCode.VALIDATION_FAILED;
      case 429:
        return AppErrorCode.RATE_LIMITED;
      default:
        return status >= 500 ? AppErrorCode.INTERNAL_ERROR : AppErrorCode.BAD_REQUEST;
    }
  }
}
