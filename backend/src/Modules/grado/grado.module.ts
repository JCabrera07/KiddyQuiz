import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradoController } from './grado.controller';
import { GradoService } from './grado.service';
import { Grado } from './entities/grado.entity';
import { Persona } from '../usuario/entities/persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grado, Persona])],
  controllers: [GradoController],
  providers: [GradoService]
})
export class GradoModule {}
