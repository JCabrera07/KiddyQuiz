import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleEvaluacion } from '../entities/detalle-evaluacion.entity';
import { CreateDetalleEvaluacionDto } from '../dto/create-detalle-eval.dto';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Usuario } from 'src/Modules/usuario/entities/usuario.entity';

@Injectable()
export class DetalleEvaluacionService {
  constructor(
    @InjectRepository(DetalleEvaluacion)
    private readonly detalleRepo: Repository<DetalleEvaluacion>,

    @InjectRepository(Evaluacion)
    private readonly evaluacionRepo: Repository<Evaluacion>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateDetalleEvaluacionDto) {
    const evaluacion = await this.evaluacionRepo.findOne({
      where: { id: dto.evaluacionId },
    });
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con id ${dto.evaluacionId} no encontrada`);
    }

    const usuario = await this.usuarioRepo.findOne({
      where: { id: dto.usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${dto.usuarioId} no encontrado`);
    }

    const detalle = this.detalleRepo.create({
      evaluacion,
      usuario,
      tiempo: dto.tiempo,
      calificacion: dto.calificacion,
      comentarioIA: dto.comentarioIA,
    });

    return await this.detalleRepo.save(detalle);
  }

   // ✅ LISTAR TODOS
  async findAll(): Promise<DetalleEvaluacion[]> {
    return this.detalleRepo.find({
      relations: ['evaluacion', 'usuario'], // incluimos evaluacion y usuario
      order: { createdAt: 'ASC' }, // opcional: ordenar por fecha
    });
  }

  async findOne(id: number): Promise<DetalleEvaluacion | null> {
  return this.detalleRepo.findOne({
    where: { id },
    relations: ['evaluacion', 'usuario'],
  });
}

 async remove(id: number): Promise<{ message: string }> {
    const detalle = await this.detalleRepo.findOne({ where: { id } });

    if (!detalle) {
      throw new NotFoundException(`DetalleEvaluacion con ID ${id} no encontrado`);
    }

    await this.detalleRepo.remove(detalle);

    return { message: `DetalleEvaluacion con ID ${id} eliminado correctamente` };
  }

}
