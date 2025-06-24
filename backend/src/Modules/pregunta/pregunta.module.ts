import { Module } from '@nestjs/common';
import { PreguntaController } from './pregunta.controller';
import { PreguntaService } from './pregunta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { Dificultad } from './entities/dificultad.entity';
import { Opcion } from './entities/opcion.entity';
import { TipoContenido } from './entities/tipo-contenido.entity';
import { TipoPregunta } from './entities/tipo-pregunta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pregunta, Dificultad, Opcion, TipoContenido, TipoPregunta])],
  controllers: [PreguntaController],
  providers: [PreguntaService]
})
export class PreguntaModule {}
