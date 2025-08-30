import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { CreateEvaluacionDto } from '../dto/create-evaluacion.dto';
import { DetalleEvaluacion } from '../entities/detalle-evaluacion.entity';
import { UpdateEvaluacionDto } from '../dto/update-evaluacion.dto';
import cloudinary from 'src/cloudinary.config';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepo: Repository<Evaluacion>,
    @InjectRepository(DetalleEvaluacion)
    private readonly detalleRepo: Repository<DetalleEvaluacion>,
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

  async remove(id: number) {
  const evaluacion = await this.evaluacionRepo.findOne({ where: { id } });

  if (!evaluacion) {
    throw new NotFoundException(`La evaluación con id ${id} no existe`);
  }

  await this.evaluacionRepo.remove(evaluacion);

  return { message: `Evaluación con id ${id} eliminada correctamente` };
}

}
