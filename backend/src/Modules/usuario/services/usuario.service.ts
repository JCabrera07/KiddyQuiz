import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from '../entities/persona.entity';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import { Repository } from 'typeorm';
import { Grado } from 'src/Modules/grado/entities/grado.entity';
import { CreatePersonaDto } from '../dto/create-persona.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePersonaDto } from '../dto/update-persona.dto';


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

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: userId } });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(oldPassword, usuario.contrasena);
    if (!isMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Encriptar y guardar la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);
    usuario.contrasena = hashed;

    await this.usuarioRepo.save(usuario);

    return { message: 'Contraseña actualizada correctamente ✅' };
  }

async findAll() {
  const usuarios = await this.usuarioRepo
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.personas', 'persona')
    .leftJoinAndSelect('persona.rol', 'rol')
    .leftJoinAndSelect('persona.grado', 'grado')
    .getMany();

  return usuarios.map(u => ({
    id: u.id,
    username: u.nombre, // tu campo "nombre" en Usuario realmente es el username
    persona: u.personas.map(p => ({
      nombres: p.nombres,
      apellidos: p.apellidos,
      edad: p.edad,
      ciudad: p.ciudad,
      sexo: p.sexo,
      rol: p.rol?.nombre,     // solo el nombre del rol
      grado: p.grado?.nombre // solo el nombre del grado
    }))
  }));
}

async findOne(id: number) {
  const usuario = await this.usuarioRepo
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.personas', 'persona')
    .leftJoinAndSelect('persona.rol', 'rol')
    .leftJoinAndSelect('persona.grado', 'grado')
    .where('usuario.id = :id', { id })
    .getOne();

  if (!usuario) {
    throw new BadRequestException(`Usuario con id ${id} no encontrado`);
  }

  return {
    id: usuario.id,
    username: usuario.nombre,
    persona: usuario.personas.map(p => ({
      nombres: p.nombres,
      apellidos: p.apellidos,
      edad: p.edad,
      ciudad: p.ciudad,
      sexo: p.sexo,
      rol: p.rol?.nombre,
      grado: p.grado?.nombre,
    })),
  };
}


async updateUser(userId: number, dto: UpdatePersonaDto) {
  const usuario = await this.usuarioRepo.findOne({
    where: { id: userId },
    relations: ['personas'],
  });

  if (!usuario) {
    throw new BadRequestException('Usuario no encontrado');
  }

  // Actualizar username si viene
  if (dto.username) {
    usuario.nombre = dto.username;
  }

  // Actualizar los campos de la persona asociada
  const persona = usuario.personas[0]; // asumimos que solo hay una persona por usuario
  if (!persona) {
    throw new BadRequestException('Persona asociada no encontrada');
  }

  persona.nombres = dto.nombres ?? persona.nombres;
  persona.apellidos = dto.apellidos ?? persona.apellidos;
  persona.edad = dto.edad ?? persona.edad;
  persona.ciudad = dto.ciudad ?? persona.ciudad;
  persona.sexo = dto.sexo ?? persona.sexo;

  await this.usuarioRepo.save(usuario);
  await this.personaRepo.save(persona);

  return {
    message: 'Usuario actualizado correctamente ✅',
    usuario: {
      id: usuario.id,
      username: usuario.nombre,
      persona: {
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        edad: persona.edad,
        ciudad: persona.ciudad,
        sexo: persona.sexo,
      },
    },
  };
}


}
