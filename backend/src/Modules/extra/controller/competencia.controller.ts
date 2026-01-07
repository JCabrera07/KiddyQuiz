import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CompetenciaService } from '../services/competencia.service';
import { CreateCompetenciaDto } from '../dto/create-competencia.dto';
import { UpdateCompetenciaDto } from '../dto/update-competencia.dto';
import { GeminiService } from 'src/Modules/common/gemini/gemini.service';

@Controller('competencia')
export class CompetenciaController {
  constructor(private readonly competenciaService: CompetenciaService,    
    private readonly geminiService: GeminiService,) {}

  @Post()
  create(@Body() createCompetenciaDto: CreateCompetenciaDto) {
    return this.competenciaService.create(createCompetenciaDto);
  }

  // --- MODIFICADO PARA ACEPTAR QUERY PARAM ---
  @Get()
  findAll(@Query('grado') gradoId?: string) {
    return this.competenciaService.findAll(gradoId ? + gradoId : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competenciaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCompetenciaDto: UpdateCompetenciaDto) {
    return this.competenciaService.update(id, updateCompetenciaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competenciaService.remove(id);
  }

    @Get(':id/contenido-ia')
  async generarContenidoCompetencia(@Param('id', ParseIntPipe) idCompetencia: number) {
    const competencia = await this.competenciaService.findOne(idCompetencia);
    if (!competencia) return { message: 'Competencia no encontrada' };

    const contenidoIA = await this.geminiService.generarContenidoCompetencia(competencia);

    return { message: 'Contenido generado exitosamente', contenidoIA, competencia };
  }
}