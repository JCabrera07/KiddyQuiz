import { Controller, Post, Param, Get, ParseIntPipe, Body } from '@nestjs/common';
import { ProgresoCompetenciaService } from '../services/progreso-competencia.service';
import { UpdateProgresoCompetenciaDto } from '../dto/update-progreso-competencia.dto';

@Controller('progreso-competencia')
export class ProgresoCompetenciaController {
  constructor(
    private readonly progresoService: ProgresoCompetenciaService,
  ) {}

  @Post('actualizar')
  actualizar(@Body() dto: UpdateProgresoCompetenciaDto) {
    return this.progresoService.actualizarProgreso(
      dto.estudianteId,
      dto.competenciaId,
      dto.totalPreguntas,
      dto.preguntasCorrectas,
      dto.detalleEvaluacionId, // Nuevo parámetro opcional
    );
  }

  @Get('estudiante/:id')
  obtenerPorEstudiante(@Param('id', ParseIntPipe) id: number) {
    return this.progresoService.obtenerProgresoEstudiante(id);
  }
}

