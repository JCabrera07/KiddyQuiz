// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepo.findOne({ where: { nombre: username } });
    if (!usuario) return null;

    const isPasswordValid = await bcrypt.compare(password, usuario.contrasena);
    if (!isPasswordValid) return null;

    return usuario;
  }

  async login(username: string, password: string) {
    const usuario = await this.validateUser(username, password);
    if (!usuario) throw new UnauthorizedException('Usuario o contraseña incorrectos');

    const payload = { username: usuario.nombre, sub: usuario.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
