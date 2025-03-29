import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { responseStructure } from 'src/constants';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInPayload: LoginDto) {
    const { access_token } = await this.authService.signIn(
      signInPayload.email,
      signInPayload.password,
    );
    return responseStructure({ token: access_token }, 'login successful');
  }
}
