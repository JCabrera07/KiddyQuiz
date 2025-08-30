// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SECRET_KEY', // misma clave que en el módulo
    });
  }

  async validate(payload: any): Promise<Usuario> {
    // payload contiene lo que pusimos en el JWT (ej: id, username)
    return { id: payload.sub, nombre: payload.username } as Usuario;
  }
}
