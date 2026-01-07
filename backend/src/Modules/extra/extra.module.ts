import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradoController } from './controller/grado.controller';
import { GradoService } from './services/grado.service';
import { Grado } from './entities/grado.entity';
import { Persona } from '../usuario/entities/persona.entity';
import { CompetenciaService } from './services/competencia.service';
import { CompetenciaController } from './controller/competencia.controller';
import { Competencia } from './entities/competencia.entity';
import { ClaseService } from './services/clase.service';
import { ClaseController } from './controller/clase.controller';
import { Clase } from './entities/clase.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { AiModule } from '../common/gemini/ia.module';
import { ProgresoCompetenciaController } from './controller/progreso-competencia.controller';
import { ProgresoCompetenciaService } from './services/progreso-competencia.service';
import { ProgresoCompetencia } from './entities/progreso-competencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grado, Persona, Competencia,Clase,Usuario,ProgresoCompetencia]), AiModule],
  controllers: [GradoController,CompetenciaController,ClaseController,ProgresoCompetenciaController],
  providers: [GradoService,CompetenciaService,ClaseService,ProgresoCompetenciaService],
  exports: [CompetenciaService, GradoService, ClaseService, TypeOrmModule],
})
export class ExtraModule {}
