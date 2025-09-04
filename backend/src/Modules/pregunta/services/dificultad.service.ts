import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dificultad } from '../entities/dificultad.entity';

@Injectable()
export class DificultadService {
  constructor(
    @InjectRepository(Dificultad)
    private readonly dificultadRepository: Repository<Dificultad>,
  ) {}

  // Listar todas las dificultades
  async findAll(): Promise<Dificultad[]> {
    return this.dificultadRepository.find({
      order: { id: 'ASC' }, // opcional: orden ascendente por id
    });
  }

}
