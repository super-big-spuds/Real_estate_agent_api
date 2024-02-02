// jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || '123456',
    });
  }

  async validate(payload: any) {
    //console.log('payload', payload);
    return {
      userId: payload.sub,
      username: payload.user_name,
      isadmin: payload.isadmin,
    };
  }
}
