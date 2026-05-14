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

  // ✅ ENDPOINT ORIGINAL (Comentario Largo)
  @Patch(':id/comentario-ia')
  async generarComentarioIA(
    @Param('id', ParseIntPipe) id: number,
  ) {
    // 1. Traer el detalle con todas las relaciones
    const detalle = await this.detalleService.findWithRespuestas(id);

    // 2. Generar comentario con Gemini (Largo)
    const comentarioIA = await this.geminiService.generarComentarioIA(detalle);

    // 3. Guardar el comentario en la BD
    const actualizado = await this.detalleService.actualizarComentarioIA(id, comentarioIA);

    return {
      message: 'Comentario IA actualizado exitosamente',
      comentarioIA,
      detalleActualizado: actualizado,
    };
  }

  // ✅ NUEVO ENDPOINT (Comentario Corto - Máx 2 líneas)
  @Patch(':id/comentario-ia-corto')
  async generarComentarioCortoIA(
    @Param('id', ParseIntPipe) id: number,
  ) {
    // 1. Traer el detalle con todas las relaciones
    const detalle = await this.detalleService.findWithRespuestas(id);

    // 2. Generar comentario con Gemini (NUEVO MÉTODO CORTO)
    const comentarioIA = await this.geminiService.generarComentarioCortoIA(detalle);

    // 3. Guardar el comentario en la BD (Reutilizamos el servicio existente)
    const actualizado = await this.detalleService.actualizarComentarioIA(id, comentarioIA);

    return {
      message: 'Comentario IA corto actualizado exitosamente',
      comentarioIA,
      detalleActualizado: actualizado,
    };
  }
}