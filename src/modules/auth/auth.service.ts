import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DefaultMessage, ResponseStatus } from 'src/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserWithPassword({ email });
    if (!user) {
      throw new HttpException(
        DefaultMessage.INVALID_USER,
        ResponseStatus.BAD_REQUEST,
      );
    } else {
      const isPasswordSame = await bcrypt.compare(
        password,
        String(user.password),
      );
      if (!isPasswordSame) {
        throw new HttpException(
          DefaultMessage.INVALID_USER,
          ResponseStatus.UNAUTHORIZED,
        );
      } else {
        const payload = {
          _id: user._id,
          email: user.email,
          role: user.role,
        };
        const options = {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRESIN,
        };
        const token = await this.jwtService.sign(payload, options);

        return { access_token: token };
      }
    }
  }
}
