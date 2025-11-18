import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    // Solo devolver id y nombre
    return this.rolRepo.find({
      select: ['id', 'nombre'],
    });
  }
}
