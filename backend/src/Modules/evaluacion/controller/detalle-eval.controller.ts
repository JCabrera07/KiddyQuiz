import { Controller, Post, Body, Get, Param, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { DetalleEvaluacionService } from '../services/detalle-eval.service';
import { CreateDetalleEvaluacionDto } from '../dto/create-detalle-eval.dto';
import { GeminiService } from 'src/Modules/common/gemini/gemini.service';

@Controller('detalle-evaluacion')
export class DetalleEvaluacionController {
  constructor(
    private readonly detalleService: DetalleEvaluacionService,
    private readonly geminiService: GeminiService,
  ) {}

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

  @Get(':id/respuestas')
  async getDetalleWithRespuestas(@Param('id', ParseIntPipe) id: number) {
    return this.detalleService.findWithRespuestas(id);
  }


  @Patch(':id/comentario-ia')
  async generarComentarioIA(
    @Param('id', ParseIntPipe) id: number,
  ) {
    // 1. Traer el detalle con todas las relaciones
    const detalle = await this.detalleService.findWithRespuestas(id);

    // 2. Generar comentario con Gemini
    const comentarioIA = await this.geminiService.generarComentarioIA(detalle);

    // 3. Guardar el comentario en la BD
    const actualizado = await this.detalleService.actualizarComentarioIA(id, comentarioIA);

    return {
      message: 'Comentario IA actualizado exitosamente',
      comentarioIA,
      detalleActualizado: actualizado,
    };
  }
}
