import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grado } from './entities/grado.entity';

@Injectable()
export class GradoService {
  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepo: Repository<Grado>,
  ) {}

  async findAll(): Promise<Grado[]> {
    return this.gradoRepo.find();
  }
}
