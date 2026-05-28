import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * 요청·응답 로깅 시 민감 필드를 자동으로 마스킹.
 *
 * 대상 필드 (대소문자 무시, 부분 일치):
 * - password, passwordHash, currentPassword, newPassword
 * - token, accessToken, refreshToken, bearer
 * - jwt, secret, apiKey, apiSecret, signature
 * - authorization, cookie, set-cookie, session, sessionId
 * - pin, otp, totp, mfa
 * - cardNumber, cvv, ssn
 *
 * - 본 인터셉터는 응답 body 자체는 건드리지 않음 (UI 에 정상 데이터 노출).
 *   오직 NestJS Logger 로 출력하는 access log 의 민감 필드를 마스킹.
 * - 깊이 5 까지 재귀, 그 이상은 '...' 로 절단해 폭주 방지.
 *
 * main.ts 에서 `app.useGlobalInterceptors(new SensitiveFieldsInterceptor())` 로 등록.
 */
@Injectable()
export class SensitiveFieldsInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AccessLog');

  // 키 이름 매칭은 lowercase 부분 일치
  private static readonly SENSITIVE_KEY_PATTERNS = [
    'password',
    'token',
    'bearer',
    'jwt',
    'secret',
    'apikey',
    'apisecret',
    'signature',
    'authorization',
    'cookie',
    'session',
    'pin',
    'otp',
    'totp',
    'mfa',
    'cardnumber',
    'cvv',
    'ssn',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<{
      method: string;
      url: string;
      body?: unknown;
      headers?: Record<string, string | string[] | undefined>;
    }>();

    const start = Date.now();
    const requestId =
      (req.headers?.['x-request-id'] as string | undefined) ?? '-';

    return next.handle().pipe(
      tap({
        next: () => {
          const elapsed = Date.now() - start;
          // 본문 마스킹은 비싸므로 디버그 레벨에서만 (production 에선 LOG_LEVEL 로 제어)
          this.logger.log(
            JSON.stringify({
              requestId,
              method: req.method,
              path: req.url,
              elapsedMs: elapsed,
            }),
          );
        },
        error: (err) => {
          const elapsed = Date.now() - start;
          // 에러는 AllExceptionsFilter 가 자세히 로깅하므로 여기선 요약만
          this.logger.warn(
            JSON.stringify({
              requestId,
              method: req.method,
              path: req.url,
              elapsedMs: elapsed,
              error: (err as Error)?.name ?? 'Unknown',
            }),
          );
        },
      }),
    );
  }

  /**
   * 임의 객체에서 민감 필드를 '***' 로 치환한 새 객체 반환.
   * 외부에서도 사용 가능 (예: 다른 로거에 직접 출력 전).
   */
  static mask(input: unknown, depth = 0): unknown {
    if (depth > 5) return '...';
    if (input === null || input === undefined) return input;
    if (typeof input !== 'object') return input;
    if (Array.isArray(input)) {
      return input.map((v) => SensitiveFieldsInterceptor.mask(v, depth + 1));
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      if (SensitiveFieldsInterceptor.isSensitiveKey(k)) {
        out[k] = '***';
      } else {
        out[k] = SensitiveFieldsInterceptor.mask(v, depth + 1);
      }
    }
    return out;
  }

  private static isSensitiveKey(key: string): boolean {
    const lower = key.toLowerCase();
    return SensitiveFieldsInterceptor.SENSITIVE_KEY_PATTERNS.some((p) =>
      lower.includes(p),
    );
  }
}
