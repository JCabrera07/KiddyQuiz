import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { DetalleEvaluacionService } from '../services/detalle-eval.service';
import { CreateDetalleEvaluacionDto } from '../dto/create-detalle-eval.dto';

@Controller('detalle-evaluacion')
export class DetalleEvaluacionController {
  constructor(private readonly detalleService: DetalleEvaluacionService) {}

  @Post()
  async create(@Body() dto: CreateDetalleEvaluacionDto) {
    return this.detalleService.create(dto);
  }

    // ✅ ENDPOINT: GET /detalle-evaluacion
  @Get()
  async findAll() {
    return this.detalleService.findAll();
  }

  @Get(':id')
findOne(@Param('id') id: string) {
  return this.detalleService.findOne(+id);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleService.remove(+id);
  }

}
