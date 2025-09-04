import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaUsuario } from './entities/respuesta-usuario.entity';
import { DetalleEvaluacion } from '../evaluacion/entities/detalle-evaluacion.entity';
import { Pregunta } from '../pregunta/entities/pregunta.entity';
import { Opcion } from '../pregunta/entities/opcion.entity';
import { RespuestaUsuarioController } from './controller/respuesta-usuario.controller';
import { RespuestaUsuarioService } from './services/respuesta-usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([RespuestaUsuario, DetalleEvaluacion, Pregunta, Opcion])],
  controllers: [RespuestaUsuarioController],
  providers: [RespuestaUsuarioService]
})
export class RespuestaModule {}
