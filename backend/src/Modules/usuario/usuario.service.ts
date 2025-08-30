import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { Grado } from '../grado/entities/grado.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Persona) private personaRepo: Repository<Persona>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(Grado) private gradoRepo: Repository<Grado>,
  ) {}

  async create(dto: CreatePersonaDto) {

    // 1. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 2. Crear el usuario
   const usuario = this.usuarioRepo.create({
  nombre: dto.username,
  contrasena: hashedPassword, 
});
    await this.usuarioRepo.save(usuario);

     // 3. Buscar rol y grado existentes
    const rol = await this.rolRepo.findOneBy({ id: dto.rolId });
    if (!rol) throw new Error(`Rol con id ${dto.rolId} no existe`);

    const grado = await this.gradoRepo.findOneBy({ id: dto.gradoId });
    if (!grado) throw new Error(`Grado con id ${dto.gradoId} no existe`);

    // 4. Crear la persona asociada
    const persona = this.personaRepo.create({
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      fechaNacimiento: dto.fechaNacimiento,
      edad: dto.edad,
      ciudad: dto.ciudad,
      sexo: dto.sexo,
      usuario,
      rol,
      grado,
    });

    return await this.personaRepo.save(persona);
  }
}
