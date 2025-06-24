import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { Persona } from './entities/persona.entity';
import { Rol } from './entities/rol.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona, Rol])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}