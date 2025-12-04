import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CompetenciaService } from '../services/competencia.service';
import { CreateCompetenciaDto } from '../dto/create-competencia.dto';
import { UpdateCompetenciaDto } from '../dto/update-competencia.dto';

@Controller('competencia')
export class CompetenciaController {
  constructor(private readonly competenciaService: CompetenciaService) {}

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
}