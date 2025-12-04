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
    const usuario = await this.usuarioRepo.findOne({ 
      where: { nombre: username },
      // Ajuste aquí: usamos 'personas' (plural) porque así se llama en tu entity Usuario
      relations: ['personas', 'personas.rol'] 
    });

    if (!usuario) return null;

    const isPasswordValid = await bcrypt.compare(password, usuario.contrasena);
    if (!isPasswordValid) return null;

    return usuario;
  }

  async login(username: string, password: string) {
    const usuario = await this.validateUser(username, password);
    if (!usuario) throw new UnauthorizedException('Usuario o contraseña incorrectos');

    // --- Lógica para extraer el Rol ---
    // Como 'personas' es un array, tomamos la primera posición [0]
    // Usamos optional chaining (?.) para evitar errores si el array viene vacío
    const personaAsociada = usuario.personas?.length > 0 ? usuario.personas[0] : null;
    const nombreRol = personaAsociada?.rol?.nombre || 'SIN_ROL';

    // Construimos el payload
    const payload = { 
      username: usuario.nombre, 
      sub: usuario.id,
      role: nombreRol, // Aquí enviamos el nombre del rol (ej: 'ADMIN', 'USER')
      // Opcional: si quieres enviar también el ID de la persona:
      personaId: personaAsociada?.id 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
