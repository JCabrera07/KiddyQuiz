import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionPregunta } from '../entities/evaluacion-pregunta.entity';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';
import { CreateEvaluacionPreguntaDto } from '../dto/create-evaluacion-pregunta.dto';

@Injectable()
export class EvaluacionPreguntaService {
  constructor(
    @InjectRepository(EvaluacionPregunta)
    private readonly evalPreguntaRepo: Repository<EvaluacionPregunta>,
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepo: Repository<Evaluacion>,
    @InjectRepository(Pregunta)
    private readonly preguntaRepo: Repository<Pregunta>,
  ) {}

  // Crear nueva EvaluacionPregunta
  async create(dto: CreateEvaluacionPreguntaDto) {
    const evaluacion = await this.evaluacionRepo.findOneBy({ id: dto.evaluacionId });
    if (!evaluacion) throw new BadRequestException('La evaluación no existe');

    const pregunta = await this.preguntaRepo.findOneBy({ id: dto.preguntaId });
    if (!pregunta) throw new BadRequestException('La pregunta no existe');

    // Validación de duplicado de orden
    const existe = await this.evalPreguntaRepo.findOne({
      where: { 
        evaluacion: { id: evaluacion.id },
        orden: dto.orden
      },
      relations: ['evaluacion']
    });

    if (existe) {
      throw new BadRequestException(`Ya existe una pregunta con el orden ${dto.orden} en esta evaluación`);
    }

    const evalPregunta = this.evalPreguntaRepo.create({
      evaluacion: { id: evaluacion.id } as Evaluacion,
      pregunta: { id: pregunta.id } as Pregunta,
      orden: dto.orden ?? null,
    });

    return this.evalPreguntaRepo.save(evalPregunta);
  }

  // Listar todas las preguntas de todas las evaluaciones
  async findAll() {
    return this.evalPreguntaRepo.find({
      relations: ['evaluacion', 'pregunta'],
    });
  }

  // Eliminar una pregunta por id
  async remove(id: number) {
    const registro = await this.evalPreguntaRepo.findOneBy({ id });
    if (!registro) throw new BadRequestException(`No existe el registro con id ${id}`);

    await this.evalPreguntaRepo.remove(registro);
    return { message: `Registro con id ${id} eliminado correctamente` };
  }

  // Actualizar solo el orden de una pregunta dentro de la evaluación
  async updateOrden(id: number, nuevoOrden: number) {
    // Buscar la pregunta por id
    const evalPregunta = await this.evalPreguntaRepo.findOne({
      where: { id },
      relations: ['evaluacion']
    });

    if (!evalPregunta) {
      throw new BadRequestException(`No existe la evaluacion-pregunta con id ${id}`);
    }

    // Verificar que no haya conflicto de orden
    const conflicto = await this.evalPreguntaRepo.findOne({
      where: {
        evaluacion: { id: evalPregunta.evaluacion.id },
        orden: nuevoOrden
      },
      relations: ['evaluacion']
    });

    if (conflicto && conflicto.id !== id) {
      throw new BadRequestException(`Ya existe otra pregunta con el orden ${nuevoOrden} en esta evaluación`);
    }

    // Actualizar el orden
    evalPregunta.orden = nuevoOrden;

    // Guardar los cambios
    return this.evalPreguntaRepo.save(evalPregunta);
  }
}

