import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // 브루트 포스 방지: IP 당 1분에 5회로 제한
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: '관리자 로그인' })
  @ApiOkResponse({ description: 'JWT 토큰 + 관리자 정보' })
  @ApiUnauthorizedResponse({ description: '이메일 또는 비밀번호 오류' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
