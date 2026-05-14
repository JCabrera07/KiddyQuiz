import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opcion } from '../entities/opcion.entity';
import { Pregunta } from '../entities/pregunta.entity';
import { TipoContenido } from '../entities/tipo-contenido.entity';
import { CreateOpcionDto } from '../dto/create-opcion.dto';
import { UpdateOpcionDto } from '../dto/update-opcion.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class OpcionService {
  constructor(
    @InjectRepository(Opcion)
    private opcionRepo: Repository<Opcion>,
    @InjectRepository(Pregunta)
    private preguntaRepo: Repository<Pregunta>,
    @InjectRepository(TipoContenido)
    private tipoContenidoRepo: Repository<TipoContenido>,
  ) {}

  async create(createOpcionDto: CreateOpcionDto, file?: Express.Multer.File) {
    const pregunta = await this.preguntaRepo.findOne({ where: { id: createOpcionDto.idPregunta } });
    if (!pregunta) throw new BadRequestException('Pregunta no encontrada');

    let tipoContenido: TipoContenido | null = null;
    if (createOpcionDto.idTipoContenido) {
      tipoContenido = await this.tipoContenidoRepo.findOne({ where: { id: createOpcionDto.idTipoContenido } });
      if (!tipoContenido) throw new BadRequestException('Tipo de contenido no encontrado');
    }

    let url = createOpcionDto.urlContenido || null;

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'opciones' });
      url = result.secure_url;
    }

    const opcion = this.opcionRepo.create({
      texto: createOpcionDto.texto,
      pregunta,
      tipoContenido,
      urlContenido: url,
      esCorrecta: createOpcionDto.esCorrecta || false,
    });

    return this.opcionRepo.save(opcion);
  }

async update(id: number, updateDto: UpdateOpcionDto, file?: Express.Multer.File) {
    const opcion = await this.opcionRepo.findOne({ where: { id }, relations: ['tipoContenido'] });
    if (!opcion) throw new BadRequestException('Opción no encontrada');

    // Actualizar relaciones
    if (updateDto.idTipoContenido) {
      const tipoContenido = await this.tipoContenidoRepo.findOne({ where: { id: updateDto.idTipoContenido } });
      if (!tipoContenido) throw new BadRequestException('Tipo de contenido no encontrado');
      opcion.tipoContenido = tipoContenido;
    } else if (updateDto.idTipoContenido === null) {
      // Opcional: Si quieres permitir quitar el tipo de contenido
      opcion.tipoContenido = null;
    }

    // --- LÓGICA DE IMAGEN CORREGIDA ---
    if (file) {
      // Prioridad 1: Si subió archivo físico
      const result = await cloudinary.uploader.upload(file.path, { folder: 'opciones' });
      opcion.urlContenido = result.secure_url;
    } else if (updateDto.urlContenido !== undefined) {
      // Prioridad 2: Si mandó URL (Arasaac) o string vacío
      opcion.urlContenido = updateDto.urlContenido;
    }

    // Actualizar campos simples
    if (updateDto.texto !== undefined) opcion.texto = updateDto.texto;
    if (updateDto.esCorrecta !== undefined) opcion.esCorrecta = updateDto.esCorrecta;

    return this.opcionRepo.save(opcion);
}

  // Listar todas las opciones
async findAll() {
  return this.opcionRepo.find({
    relations: ['pregunta', 'tipoContenido'],
  });
}

async findByPregunta(preguntaId: number) {
    return this.opcionRepo.find({
      where: { pregunta: { id: preguntaId } },
      relations: ['tipoContenido'], // Traemos el tipo de contenido si existe
      order: { id: 'ASC' }
    });
  }

// Listar opción por ID
async findOne(id: number) {
  const opcion = await this.opcionRepo.findOne({
    where: { id },
    relations: ['pregunta', 'tipoContenido'],
  });
  if (!opcion) throw new NotFoundException('Opción no encontrada');
  return opcion;
}

// Eliminar opción por ID
async remove(id: number) {
  const opcion = await this.opcionRepo.findOne({ where: { id } });
  if (!opcion) throw new NotFoundException('Opción no encontrada');

  await this.opcionRepo.remove(opcion);
  return { message: 'Opción eliminada correctamente' };
}


}
