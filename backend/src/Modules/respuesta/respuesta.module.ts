import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaController } from './respuesta.controller';
import { RespuestaService } from './respuesta.service';
import { RespuestaUsuario } from './entities/respuesta-usuario.entity';
import { DetalleEvaluacion } from '../evaluacion/entities/detalle-evaluacion.entity';
import { Pregunta } from '../pregunta/entities/pregunta.entity';
import { Opcion } from '../pregunta/entities/opcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RespuestaUsuario, DetalleEvaluacion, Pregunta, Opcion])],
  controllers: [RespuestaController],
  providers: [RespuestaService]
})
export class RespuestaModule {}
