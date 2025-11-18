import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoContenido } from '../entities/tipo-contenido.entity';

@Injectable()
export class TipoContenidoService {
  constructor(
    @InjectRepository(TipoContenido)
    private readonly tipoContenidoRepo: Repository<TipoContenido>,
  ) {}

  async findAll(): Promise<TipoContenido[]> {
    return this.tipoContenidoRepo.find();
  }
}
