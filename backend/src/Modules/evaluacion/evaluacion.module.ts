import { Module } from '@nestjs/common';
import { EvaluacionController } from './evaluacion.controller';
import { EvaluacionService } from './evaluacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { EvaluacionPregunta } from './entities/evaluacion-pregunta.entity';
import { DetalleEvaluacion } from './entities/detalle-evaluacion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RespuestaUsuario } from '../respuesta/entities/respuesta-usuario.entity';
import { Pregunta } from '../pregunta/entities/pregunta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluacion, EvaluacionPregunta, DetalleEvaluacion, Usuario, RespuestaUsuario, Pregunta])],
  controllers: [EvaluacionController],
  providers: [EvaluacionService]
})
export class EvaluacionModule {}
