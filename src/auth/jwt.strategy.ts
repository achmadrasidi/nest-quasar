import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username, email } = payload;

    let user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user && payload.email) {
      user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
