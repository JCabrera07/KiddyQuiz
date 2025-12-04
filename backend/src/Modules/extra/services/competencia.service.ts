import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competencia } from '../entities/competencia.entity';
import { CreateCompetenciaDto } from '../dto/create-competencia.dto';
import { UpdateCompetenciaDto } from '../dto/update-competencia.dto';

@Injectable()
export class CompetenciaService {
  constructor(
    @InjectRepository(Competencia)
    private readonly competenciaRepo: Repository<Competencia>,
  ) {}

  async create(createCompetenciaDto: CreateCompetenciaDto) {
    // CORRECCIÓN: Usamos 'undefined' en lugar de 'null'
    const competencia = this.competenciaRepo.create({
      ...createCompetenciaDto,
      grado: createCompetenciaDto.gradoId ? { id: createCompetenciaDto.gradoId } : undefined
    });
    
    return await this.competenciaRepo.save(competencia);
  }

  async findAll(gradoId?: number) {
    // CORRECCIÓN: Ajustamos la condición del where para que sea compatible con TypeORM
    // Si gradoId existe, filtramos por la relación. Si no, pasamos un objeto vacío.
    const whereCondition = gradoId ? { grado: { id: gradoId } } : {};
    
    return await this.competenciaRepo.find({
      where: whereCondition,
      order: { id: 'ASC' },
      relations: ['grado']
    });
  }

  async findOne(id: number) {
    const competencia = await this.competenciaRepo.findOne({ 
      where: { id }, 
      relations: ['grado'] 
    });
    
    if (!competencia) {
      throw new NotFoundException(`Competencia con ID ${id} no encontrada`);
    }
    return competencia;
  }

  async update(id: number, updateCompetenciaDto: UpdateCompetenciaDto) {
    const competencia = await this.findOne(id);
    
    // Preparamos los datos a actualizar
    const datosActualizados = {
        ...updateCompetenciaDto,
        // Usamos undefined si no viene el dato
        grado: updateCompetenciaDto.gradoId ? { id: updateCompetenciaDto.gradoId } : undefined
    };

    // Usamos Object.assign o merge, asegurándonos de limpiar undefineds si es necesario
    this.competenciaRepo.merge(competencia, datosActualizados);
    return await this.competenciaRepo.save(competencia);
  }

  async remove(id: number) {
    const competencia = await this.findOne(id);
    return await this.competenciaRepo.remove(competencia);
  }
}