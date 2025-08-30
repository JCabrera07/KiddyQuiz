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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluacion,
      EvaluacionPregunta,
      DetalleEvaluacion,
      Usuario,
      RespuestaUsuario,
      Pregunta,
    ]),
    MulterModule.register({
      dest: './uploads', // carpeta temporal para almacenar archivos antes de subirlos a Cloudinary
    }),
  ],
  controllers: [EvaluacionController,DetalleEvaluacionController],
  providers: [EvaluacionService,DetalleEvaluacionService],
})
export class EvaluacionModule {}

