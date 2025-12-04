import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntaController } from './controller/pregunta.controller';
import { PreguntaService } from './services/pregunta.service';
import { DificultadController } from './controller/dificultad.controller';
import { DificultadService } from './services/dificultad.service';
import { TipoContenidoController } from './controller/tipo-contenido.controller';
import { TipoContenidoService } from './services/tipo-contenido.service';
import { TipoPreguntaController } from './controller/tipo-pregunta.controller';
import { TipoPreguntaService } from './services/tipo-pregunta.service';
import { Pregunta } from './entities/pregunta.entity';
import { Dificultad } from './entities/dificultad.entity';
import { Opcion } from './entities/opcion.entity';
import { TipoContenido } from './entities/tipo-contenido.entity';
import { TipoPregunta } from './entities/tipo-pregunta.entity';
import { OpcionController } from './controller/opcion.controller';
import { OpcionService } from './services/opcion.service';
import { Competencia } from '../extra/entities/competencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pregunta,
      Dificultad,
      Opcion,
      TipoContenido,
      TipoPregunta,
      Competencia,
    ]),
  ],
  controllers: [
    PreguntaController,
    DificultadController,
    TipoContenidoController, 
    TipoPreguntaController,
    OpcionController, 
  ],
  providers: [
    PreguntaService,
    DificultadService,
    TipoContenidoService, 
    TipoPreguntaService,
    OpcionService,
  ],
})
export class PreguntaModule {}
