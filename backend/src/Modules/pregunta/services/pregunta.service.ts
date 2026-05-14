import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from '../entities/pregunta.entity';
import { CreatePreguntaDto } from '../dto/create-pregunta.dto';
import { UpdatePreguntaDto } from '../dto/update-pregunta.dto';

// Entidades Relacionadas
import { TipoPregunta } from '../entities/tipo-pregunta.entity';
import { Dificultad } from '../entities/dificultad.entity';
import { TipoContenido } from '../entities/tipo-contenido.entity';
// Asegúrate de que esta ruta sea correcta en tu proyecto
import { Competencia } from 'src/Modules/extra/entities/competencia.entity';

@Injectable()
export class PreguntaService {
  constructor(
    @InjectRepository(Pregunta)
    private readonly preguntaRepo: Repository<Pregunta>,
    @InjectRepository(TipoPregunta)
    private readonly tipoRepo: Repository<TipoPregunta>,
    @InjectRepository(Dificultad)
    private readonly dificultadRepo: Repository<Dificultad>,
    @InjectRepository(TipoContenido)
    private readonly tipoContenidoRepo: Repository<TipoContenido>,
    @InjectRepository(Competencia)
    private readonly competenciaRepo: Repository<Competencia>,
  ) {}

  // --- CREAR ---
  async create(dto: CreatePreguntaDto) {
    // 1. Validar y buscar relaciones OBLIGATORIAS
    // Usamos 'idTipoPregunta' porque así lo definimos en el DTO
    const tipo = await this.tipoRepo.findOneBy({ id: dto.idTipoPregunta });
    if (!tipo) throw new BadRequestException('Tipo de pregunta no válido');

    const dificultad = await this.dificultadRepo.findOneBy({ id: dto.idDificultad });
    if (!dificultad) throw new BadRequestException('Dificultad no válida');

    const competencia = await this.competenciaRepo.findOneBy({ id: dto.idCompetencia });
    if (!competencia) throw new BadRequestException('Competencia no válida');

    // 2. Validar relaciones OPCIONALES (Tipo Contenido)
    let tipoContenido: TipoContenido | null = null;

    if (dto.idTipoContenido) {
      tipoContenido = await this.tipoContenidoRepo.findOneBy({ id: dto.idTipoContenido });
      if (!tipoContenido) throw new BadRequestException('Tipo de contenido no existe');
    }

    // 3. Crear la entidad
    const nuevaPregunta = this.preguntaRepo.create({
      enunciado: dto.enunciado,
      urlContenido: dto.urlContenido,
      tipoPregunta: tipo,
      dificultad: dificultad,
      competencia: competencia,
      // Si es null, TypeORM lo maneja correctamente al pasar undefined o null
      tipoContenido: tipoContenido || undefined 
    });

    return await this.preguntaRepo.save(nuevaPregunta);
  }

  // --- LISTAR TODO ---
  async findAll(): Promise<Pregunta[]> {
    return this.preguntaRepo.find({
      // Traemos las relaciones necesarias para mostrar nombres en la tabla
      relations: ['tipoPregunta', 'dificultad', 'competencia', 'tipoContenido'],
      order: { createdAt: 'DESC' }
    });
  }

  // --- BUSCAR UNO ---
  async findOne(id: number): Promise<Pregunta> {
    const pregunta = await this.preguntaRepo.findOne({
      where: { id },
      relations: ['tipoPregunta', 'dificultad', 'competencia', 'tipoContenido'] // Opciones se cargarán en otro endpoint si es necesario
    });
    if (!pregunta) throw new NotFoundException(`Pregunta con id ${id} no encontrada`);
    return pregunta;
  }

  // --- ACTUALIZAR ---
  async update(id: number, dto: UpdatePreguntaDto) {
    const pregunta = await this.preguntaRepo.findOneBy({ id });
    if (!pregunta) throw new NotFoundException(`La pregunta con id ${id} no existe`);

    // Actualizar campos simples
    if (dto.enunciado) pregunta.enunciado = dto.enunciado;
    if (dto.urlContenido !== undefined) pregunta.urlContenido = dto.urlContenido;

    // Actualizar relaciones solo si vienen en el DTO
    if (dto.idTipoPregunta) {
      const tipo = await this.tipoRepo.findOneBy({ id: dto.idTipoPregunta });
      if (!tipo) throw new BadRequestException('Tipo de pregunta no existe');
      pregunta.tipoPregunta = tipo;
    }

    if (dto.idDificultad) {
      const dificultad = await this.dificultadRepo.findOneBy({ id: dto.idDificultad });
      if (!dificultad) throw new BadRequestException('Dificultad no existe');
      pregunta.dificultad = dificultad;
    }

    if (dto.idCompetencia) {
      const competencia = await this.competenciaRepo.findOneBy({ id: dto.idCompetencia });
      if (!competencia) throw new BadRequestException('Competencia no existe');
      pregunta.competencia = competencia;
    }

    if (dto.idTipoContenido) {
      const tc = await this.tipoContenidoRepo.findOneBy({ id: dto.idTipoContenido });
      if (!tc) throw new BadRequestException('Tipo de contenido no existe');
      pregunta.tipoContenido = tc;
    }

    return await this.preguntaRepo.save(pregunta);
  }

  // --- ELIMINAR ---
  async remove(id: number) {
    const pregunta = await this.preguntaRepo.findOneBy({ id });
    if (!pregunta) throw new NotFoundException(`La pregunta con id ${id} no existe`);

    await this.preguntaRepo.remove(pregunta);
    return { message: `Pregunta con id ${id} eliminada correctamente` };
  }

  // --- MÉTODOS AUXILIARES PARA LOS SELECTS DEL FRONTEND ---
  // Estos son necesarios para que funcionen los endpoints de 'catalogo/*' en el Controller
  
  async listarTipos() {
    return this.tipoRepo.find();
  }

  async listarDificultades() {
    return this.dificultadRepo.find();
  }

  async listarCompetencias() {
    return this.competenciaRepo.find();
  }
}