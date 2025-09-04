import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPregunta } from '../entities/tipo-pregunta.entity';

@Injectable()
export class TipoPreguntaService {
  constructor(
    @InjectRepository(TipoPregunta)
    private readonly tipoPreguntaRepo: Repository<TipoPregunta>,
  ) {}

  async findAll(): Promise<TipoPregunta[]> {
    return this.tipoPreguntaRepo.find();
  }
}
