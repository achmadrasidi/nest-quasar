import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.usersService.validateUserPassword(
      authCredentialsDto,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return await this.getCredentials(user);
  }

  async getCredentials(user: any) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      name: user.name,
    };
    console.log('payload', payload);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    return { accessToken };
  }
}
