import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RespuestaUsuario } from '../entities/respuesta-usuario.entity';
import { DetalleEvaluacion } from '../../evaluacion/entities/detalle-evaluacion.entity';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';
import { Opcion } from '../../pregunta/entities/opcion.entity';
import { CreateRespuestaUsuarioDto } from '../dto/create-respuesta-usuario.dto';
import { UpdateRespuestaUsuarioDto } from '../dto/update-respuesta-usuario.dto';

@Injectable()
export class RespuestaUsuarioService {
  constructor(
    @InjectRepository(RespuestaUsuario)
    private readonly respuestaRepo: Repository<RespuestaUsuario>,
    @InjectRepository(DetalleEvaluacion)
    private readonly detalleRepo: Repository<DetalleEvaluacion>,
    @InjectRepository(Pregunta)
    private readonly preguntaRepo: Repository<Pregunta>,
    @InjectRepository(Opcion)
    private readonly opcionRepo: Repository<Opcion>,
  ) {}

  // Crear respuesta
  async create(dto: CreateRespuestaUsuarioDto) {
    const detalle = await this.detalleRepo.findOne({ where: { id: dto.idDetalleEvaluacion } });
    if (!detalle) throw new BadRequestException('Detalle de evaluación no encontrado');

    const pregunta = await this.preguntaRepo.findOne({ where: { id: dto.idPregunta } });
    if (!pregunta) throw new BadRequestException('Pregunta no encontrada');

    let opcion: Opcion | null = null;
    if (dto.idOpcionSeleccionada) {
      opcion = await this.opcionRepo.findOne({ where: { id: dto.idOpcionSeleccionada } });
      if (!opcion) throw new BadRequestException('Opción seleccionada no encontrada');
    }

    const respuesta = this.respuestaRepo.create({
      detalleEvaluacion: { id: dto.idDetalleEvaluacion } as any,
      pregunta: { id: dto.idPregunta } as any,
      opcionSeleccionada: dto.idOpcionSeleccionada ? { id: dto.idOpcionSeleccionada } as any : null,
      respuestaAbierta: dto.respuestaAbierta || null,
      esCorrecta: dto.esCorrecta ?? null,
      tiempoPorPregunta: dto.tiempoPorPregunta || null,
    } as any);

    return this.respuestaRepo.save(respuesta);
  }

  // Listar todas las respuestas
  async findAll() {
    return this.respuestaRepo.find({
      relations: ['detalleEvaluacion', 'pregunta', 'opcionSeleccionada'],
    });
  }

  // Listar respuesta por ID
  async findOne(id: number) {
    const respuesta = await this.respuestaRepo.findOne({
      where: { id },
      relations: ['detalleEvaluacion', 'pregunta', 'opcionSeleccionada'],
    });
    if (!respuesta) throw new BadRequestException('Respuesta no encontrada');
    return respuesta;
  }

  // Eliminar respuesta
  async remove(id: number) {
    const respuesta = await this.respuestaRepo.findOne({ where: { id } });
    if (!respuesta) throw new BadRequestException('Respuesta no encontrada');
    return this.respuestaRepo.remove(respuesta);
  }

   async update(id: number, dto: UpdateRespuestaUsuarioDto) {
    const respuesta = await this.respuestaRepo.findOne({ where: { id } });
    if (!respuesta) throw new BadRequestException('Respuesta no encontrada');

    if (dto.idDetalleEvaluacion) {
      const detalle = await this.detalleRepo.findOne({ where: { id: dto.idDetalleEvaluacion } });
      if (!detalle) throw new BadRequestException('Detalle de evaluación no encontrado');
      respuesta.detalleEvaluacion = detalle;
    }

    if (dto.idPregunta) {
      const pregunta = await this.preguntaRepo.findOne({ where: { id: dto.idPregunta } });
      if (!pregunta) throw new BadRequestException('Pregunta no encontrada');
      respuesta.pregunta = pregunta;
    }

    if (dto.idOpcionSeleccionada !== undefined) {
      const opcion = dto.idOpcionSeleccionada
        ? await this.opcionRepo.findOne({ where: { id: dto.idOpcionSeleccionada } })
        : null;
      if (dto.idOpcionSeleccionada && !opcion) throw new BadRequestException('Opción seleccionada no encontrada');
      respuesta.opcionSeleccionada = opcion || null;
    }

    if (dto.respuestaAbierta !== undefined) respuesta.respuestaAbierta = dto.respuestaAbierta;
    if (dto.esCorrecta !== undefined) respuesta.esCorrecta = dto.esCorrecta;
    if (dto.tiempoPorPregunta !== undefined) respuesta.tiempoPorPregunta = dto.tiempoPorPregunta;

    return this.respuestaRepo.save(respuesta);
  }
}


