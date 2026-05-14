import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './controller/usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { Persona } from './entities/persona.entity';
import { Rol } from './entities/rol.entity';
import { Grado } from '../extra/entities/grado.entity';
import { RolController } from './controller/rol.controller';
import { RolService } from './services/rol.service';
import { Clase } from '../extra/entities/clase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona, Rol, Grado, Clase])],
  providers: [UsuarioService, RolService,],
  controllers: [UsuarioController, RolController,],
})
export class UsuarioModule {}