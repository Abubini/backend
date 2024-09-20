import { Controller, Post, Body,Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('verify-code')
    async verifyCode(
      @Body('code') code: string,
      @Body('adminname') adminname: string
  ) {
        try {
            return this.authService.verifyCode(code, adminname);
        } catch (error) {
            throw new UnauthorizedException('Invalid code');
        }
    }
}

