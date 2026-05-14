import { Controller, Post, Body, Get, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { EvaluacionPreguntaService } from '../services/evaluacion-pregunta.service';
import { CreateEvaluacionPreguntaDto } from '../dto/create-evaluacion-pregunta.dto';
import { UpdateOrdenDto } from '../dto/update-orden.dto';

@Controller('evaluacion-pregunta')
export class EvaluacionPreguntaController {
  constructor(private readonly evalPreguntaService: EvaluacionPreguntaService) {}

  @Post()
  async create(@Body() dto: CreateEvaluacionPreguntaDto) {
    return this.evalPreguntaService.create(dto);
  }

  @Get()
  async findAll() {
    return this.evalPreguntaService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.evalPreguntaService.remove(id);
  }
@Get('evaluacion/:id')
  async findByEvaluacion(@Param('id', ParseIntPipe) id: number) {
    return this.evalPreguntaService.findAllByEvaluacion(id);
  }

@Patch(':id/orden')
async updateOrden(
  @Param('id') id: number,
  @Body() dto: UpdateOrdenDto
) {
  return this.evalPreguntaService.updateOrden(id, dto.orden);
}
}
