import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { CreateEvaluacionDto } from '../dto/create-evaluacion.dto';
import { DetalleEvaluacion } from '../entities/detalle-evaluacion.entity';
import { UpdateEvaluacionDto } from '../dto/update-evaluacion.dto';
import cloudinary from 'src/cloudinary.config';
import { SubmitEvaluacionDto } from '../dto/submit-evaluacion.dto';
import { Opcion } from 'src/Modules/pregunta/entities/opcion.entity';
import { RespuestaUsuario } from 'src/Modules/respuesta/entities/respuesta-usuario.entity';
import { EvaluacionPregunta } from '../entities/evaluacion-pregunta.entity';


@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepo: Repository<Evaluacion>,
    @InjectRepository(DetalleEvaluacion)
    private readonly detalleRepo: Repository<DetalleEvaluacion>,
    @InjectRepository(Opcion)
    private opcionRepository: Repository<Opcion>,
    @InjectRepository(RespuestaUsuario)
    private respuestaUsuarioRepository: Repository<RespuestaUsuario>,
    @InjectRepository(Evaluacion)
    private evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(EvaluacionPregunta)
    private readonly evaluacionPreguntaRepo: Repository<EvaluacionPregunta>,
  ) {}

  async create(createDto: CreateEvaluacionDto & { imagenUrl: string }) {
    const evaluacion = this.evaluacionRepo.create(createDto);
    return await this.evaluacionRepo.save(evaluacion);
  }

   async update(id: number, dto: UpdateEvaluacionDto, file?: Express.Multer.File) {
    const evaluacion = await this.evaluacionRepo.findOne({ where: { id } });
    if (!evaluacion) throw new NotFoundException('Evaluación no encontrada');

    // Subir nueva foto si existe
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'evaluaciones',
      });
      evaluacion.imagenUrl = result.secure_url; // actualizar la URL
    }

    // Actualizar los demás campos
    Object.assign(evaluacion, dto);

    return this.evaluacionRepo.save(evaluacion);
  }

    //Listar todas las evaluaciones
  async findAll(): Promise<Evaluacion[]> {
    return await this.evaluacionRepo.find();
  }
  // Listar evaluaciones por usuario
  async findByUsuarioId(usuarioId: number): Promise<Evaluacion[]> {
    const detalles = await this.detalleRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['evaluacion'], // traemos la evaluación asociada
    });

    // extraemos solo las evaluaciones
    return detalles.map(detalle => detalle.evaluacion);
  }
// VERSIÓN CORRECTA CON TRANSFORMACIÓN
async findQuizById(id: number) {
  const evaluacion = await this.evaluacionRepo.findOne({
    where: { id },
    relations: [
      'evaluacionPreguntas',
      'evaluacionPreguntas.pregunta',
      'evaluacionPreguntas.pregunta.opciones'
    ],
  });

  if (!evaluacion) {
    throw new NotFoundException(`Evaluación con id ${id} no encontrada`);
  }

  // 1. Extraemos y "aplanamos" las preguntas
  const preguntasTransformadas = evaluacion.evaluacionPreguntas.map(
    (ep) => ep.pregunta
  );

  // 2. Creamos y devolvemos un NUEVO objeto con la estructura que el frontend espera
  return {
    ...evaluacion, // Copiamos todos los datos de la evaluación (id, titulo, etc.)
    preguntas: preguntasTransformadas, // Añadimos el array con el nombre correcto
  };
}
  async remove(id: number) {
  const evaluacion = await this.evaluacionRepo.findOne({ where: { id } });

  if (!evaluacion) {
    throw new NotFoundException(`La evaluación con id ${id} no existe`);
  }

  await this.evaluacionRepo.remove(evaluacion);

  return { message: `Evaluación con id ${id} eliminada correctamente` };
}

async findOne(id: number) {
  const evaluacion = await this.evaluacionRepo.findOne({ where: { id } });

  if (!evaluacion) {
    throw new BadRequestException(`Evaluación con id ${id} no encontrada`);
  }

  return {
    id: evaluacion.id,
    titulo: evaluacion.titulo,
    descripcion: evaluacion.descripcion,
    imagenUrl: evaluacion.imagenUrl,
    estado: evaluacion.estado,
    fechaInicio: evaluacion.fechaInicio,
    fechaFin: evaluacion.fechaFin,
    createdAt: evaluacion.createdAt,
    updatedAt: evaluacion.updatedAt,
  };
}
 async calificarEvaluacion(evaluacionId: number, dto: SubmitEvaluacionDto) {
  // 1. OBTENER LAS RESPUESTAS CORRECTAS DE LA BD
  const preguntaIds = dto.respuestas.map(r => r.id_pregunta);

  const opcionesCorrectas = await this.opcionRepository.find({
    relations: ['pregunta'],
    where: {
      pregunta: {
        // AJUSTE: Asumimos que el PK en tu entidad Pregunta también se llama 'id'.
        // Si se llama 'idPregunta', usa ese nombre aquí.
        id: In(preguntaIds) 
      },
      esCorrecta: true, // Corregido de 'es_correcta' a 'esCorrecta'
    },
  });

  const mapaRespuestasCorrectas = new Map<number, number>();
  opcionesCorrectas.forEach(op => {
    // AJUSTE: Usamos op.id y op.pregunta.id, que son los nombres de propiedad correctos.
    mapaRespuestasCorrectas.set(op.pregunta.id, op.id);
  });

  // 2. CALCULAR LA PUNTUACIÓN (sin cambios aquí)
  let puntaje = 0;
  for (const respuesta of dto.respuestas) {
    if (mapaRespuestasCorrectas.get(respuesta.id_pregunta) === respuesta.id_opcion_seleccionada) {
      puntaje++;
    }
  }
  const calificacionFinal = (puntaje / preguntaIds.length) * 100;

  // 3. GUARDAR LOS RESULTADOS EN LA BASE DE DATOS
  const detalleGuardado = await this.guardarResultados(evaluacionId, dto, calificacionFinal, mapaRespuestasCorrectas);

  // 4. DEVOLVER EL RESULTADO FINAL
  return {
    message: 'Evaluación calificada con éxito.',
    calificacion: calificacionFinal.toFixed(2),
    respuestasCorrectas: puntaje,
    totalPreguntas: preguntaIds.length,
    // AJUSTE: Asumiendo que el PK en DetalleEvaluacion se llama 'id'.
    detalleIntentoId: detalleGuardado.id 
  };
}

// Función auxiliar para mantener el código más limpio
private async guardarResultados(evaluacionId: number, dto: SubmitEvaluacionDto, calificacionFinal: number, mapaRespuestasCorrectas: Map<number, number>) {
    // 3.1. Crear el registro principal del intento
    const nuevoDetalle = this.detalleRepo.create({
      evaluacion: { id: evaluacionId },
      usuario: { id: dto.id_usuario },
      tiempo: dto.tiempo_total,
      calificacion: calificacionFinal,
      comentarioIA: "Calificación automática.", // <-- CORRECCIÓN APLICADA
    });
    const detalleGuardado = await this.detalleRepo.save(nuevoDetalle);

    // 3.2. Guardar cada una de las respuestas del usuario
    const respuestasParaGuardar = dto.respuestas.map(r => {
      return this.respuestaUsuarioRepository.create({
        detalleEvaluacion: detalleGuardado,
        pregunta: { id: r.id_pregunta },
        opcionSeleccionada: { id: r.id_opcion_seleccionada }, 
        esCorrecta: mapaRespuestasCorrectas.get(r.id_pregunta) === r.id_opcion_seleccionada,
      });
    });
    await this.respuestaUsuarioRepository.save(respuestasParaGuardar);
    
    return detalleGuardado;
}

async findOneWithStats(id: number) {
  const evaluacion = await this.evaluacionRepo.findOne({
    where: { id }
  });

  if (!evaluacion) {
    throw new NotFoundException(`Evaluación con id ${id} no encontrada`);
  }

  const totalPreguntas = await this.evaluacionPreguntaRepo
    .createQueryBuilder('ep')
    .where('ep.id_evaluacion = :id', { id })
    .getCount();

  const TIEMPO_POR_PREGUNTA = 4; // minutos
  const tiempoEstimado = totalPreguntas * TIEMPO_POR_PREGUNTA;

  return {
    ...evaluacion,
    totalPreguntas,
    tiempoEstimado
  };
}



}
