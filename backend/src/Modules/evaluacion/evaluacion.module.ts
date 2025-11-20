import { Module } from '@nestjs/common';
import { EvaluacionController } from './controller/evaluacion.controller';
import { EvaluacionService } from './services/evaluacion.service';
import { DetalleEvaluacionService } from './services/detalle-eval.service';
import { DetalleEvaluacionController } from './controller/detalle-eval.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { EvaluacionPregunta } from './entities/evaluacion-pregunta.entity';
import { DetalleEvaluacion } from './entities/detalle-evaluacion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RespuestaUsuario } from '../respuesta/entities/respuesta-usuario.entity';
import { Pregunta } from '../pregunta/entities/pregunta.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Opcion } from '../pregunta/entities/opcion.entity'; 


// 👇 importar tu nuevo service y controller
import { EvaluacionPreguntaService } from './services/evaluacion-pregunta.service';
import { EvaluacionPreguntaController } from './controller/evaluacion-pregunta.controller';
import { AiModule } from '../common/gemini/ia.module'; // 👈 módulo que exporta GeminiService

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluacion,
      EvaluacionPregunta,
      DetalleEvaluacion,
      Usuario,
      RespuestaUsuario,
      Pregunta,
      Opcion
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    AiModule, // 👈 aquí, como módulo, no dentro de forFeature
  ],
  controllers: [
    EvaluacionController,
    DetalleEvaluacionController,
    EvaluacionPreguntaController,
  ],
  providers: [
    EvaluacionService,
    DetalleEvaluacionService,
    EvaluacionPreguntaService,
  ],
})
export class EvaluacionModule {}

