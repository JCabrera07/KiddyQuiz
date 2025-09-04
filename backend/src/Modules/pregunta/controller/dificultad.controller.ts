import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DificultadService } from '../services/dificultad.service';
import { Dificultad } from '../entities/dificultad.entity';

@Controller('dificultad')
export class DificultadController {
  constructor(private readonly dificultadService: DificultadService) {}

  // GET /dificultad
  @Get()
  async findAll(): Promise<Dificultad[]> {
    return this.dificultadService.findAll();
  }

}
