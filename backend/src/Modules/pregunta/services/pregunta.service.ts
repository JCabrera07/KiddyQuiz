import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from '../entities/pregunta.entity';
import { TipoPregunta } from '../entities/tipo-pregunta.entity';
import { Dificultad } from '../entities/dificultad.entity';
import { TipoContenido } from '../entities/tipo-contenido.entity';
import { CreatePreguntaDto } from '../dto/create-pregunta.dto';
import { UpdatePreguntaDto } from '../dto/update-pregunta.dto';
// Importamos la entidad Competencia
import { Competencia } from 'src/Modules/extra/entities/competencia.entity';

@Injectable()
export class PreguntaService {
  constructor(
    @InjectRepository(Pregunta)
    private preguntaRepo: Repository<Pregunta>,
    @InjectRepository(TipoPregunta)
    private tipoPreguntaRepo: Repository<TipoPregunta>,
    @InjectRepository(Dificultad)
    private dificultadRepo: Repository<Dificultad>,
    @InjectRepository(TipoContenido)
    private tipoContenidoRepo: Repository<TipoContenido>,
    // Inyectamos el repositorio de Competencia
    @InjectRepository(Competencia)
    private competenciaRepo: Repository<Competencia>,
  ) {}

  async create(dto: CreatePreguntaDto) {
    const tipoPregunta = await this.tipoPreguntaRepo.findOneBy({ id: dto.tipoPreguntaId });
    if (!tipoPregunta) throw new BadRequestException('Tipo de pregunta no existe');

    const dificultad = await this.dificultadRepo.findOneBy({ id: dto.dificultadId });
    if (!dificultad) throw new BadRequestException('Dificultad no existe');

    const tipoContenido = await this.tipoContenidoRepo.findOneBy({ id: dto.tipoContenidoId });
    if (!tipoContenido) throw new BadRequestException('Tipo de contenido no existe');

    // --- CORRECCIÓN AQUÍ ---
    // 1. Definimos explícitamente que la variable puede ser Competencia O null
    let competencia: Competencia | null = null;

    const compId = (dto as any).competenciaId; 

    if (compId) { 
      competencia = await this.competenciaRepo.findOneBy({ id: compId });
      if (!competencia) throw new BadRequestException('La competencia (tema) indicada no existe');
    }

    const pregunta = this.preguntaRepo.create({
      tipoPregunta,
      dificultad,
      enunciado: dto.enunciado,
      tipoContenido,
      urlContenido: dto.urlContenido || null,
      // 2. Usamos '|| undefined' para que si es null, TypeORM lo ignore limpiamente
      competencia: competencia || undefined, 
    });

    return this.preguntaRepo.save(pregunta);
  }
  
  async findAll(): Promise<Pregunta[]> {
    return this.preguntaRepo.find({
      // Agregamos 'competencia' para ver el tema al listar
      relations: ['tipoPregunta', 'dificultad', 'tipoContenido', 'opciones', 'competencia'], 
    });
  }

  async findOne(id: number): Promise<Pregunta | null> {
    return this.preguntaRepo.findOne({
      where: { id: id },
      relations: ['tipoPregunta', 'dificultad', 'tipoContenido', 'opciones', 'competencia'],
    });
  }

  async update(id: number, dto: UpdatePreguntaDto) {
    const pregunta = await this.preguntaRepo.findOneBy({ id });
    if (!pregunta) {
      throw new BadRequestException(`La pregunta con id ${id} no existe`);
    }

    if (dto.tipoPreguntaId) {
      const tipoPregunta = await this.tipoPreguntaRepo.findOneBy({ id: dto.tipoPreguntaId });
      if (!tipoPregunta) throw new BadRequestException('Tipo de pregunta no existe');
      pregunta.tipoPregunta = tipoPregunta;
    }

    if (dto.dificultadId) {
      const dificultad = await this.dificultadRepo.findOneBy({ id: dto.dificultadId });
      if (!dificultad) throw new BadRequestException('Dificultad no existe');
      pregunta.dificultad = dificultad;
    }

    if (dto.tipoContenidoId) {
      const tipoContenido = await this.tipoContenidoRepo.findOneBy({ id: dto.tipoContenidoId });
      if (!tipoContenido) throw new BadRequestException('Tipo de contenido no existe');
      pregunta.tipoContenido = tipoContenido;
    }

    // Lógica de actualización de Competencia
    // Cast to 'any' to access property if not in DTO interface
    const compId = (dto as any).competenciaId;
    if (compId) {
      const competencia = await this.competenciaRepo.findOneBy({ id: compId });
      if (!competencia) throw new BadRequestException('Competencia no existe');
      pregunta.competencia = competencia;
    }

    if (dto.enunciado) {
      pregunta.enunciado = dto.enunciado;
    }

    if (dto.urlContenido !== undefined) {
      pregunta.urlContenido = dto.urlContenido;
    }

    return this.preguntaRepo.save(pregunta);
  }

  async remove(id: number) {
    const pregunta = await this.preguntaRepo.findOneBy({ id });
    if (!pregunta) {
      throw new BadRequestException(`La pregunta con id ${id} no existe`);
    }

    await this.preguntaRepo.remove(pregunta);
    return { message: `Pregunta con id ${id} eliminada correctamente` };
  }
}