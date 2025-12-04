import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ClaseService } from '../services/clase.service';
import { CreateClaseDto } from '../dto/create-clase.dto';
import { JoinClaseDto } from '../dto/join-clase.dto';
import { JwtAuthGuard } from 'src/Modules/auth/jwt-auth.guard';

@Controller('clase')
@UseGuards(JwtAuthGuard)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  // --- DOCENTE ---
  @Post()
  crear(@Request() req, @Body() createClaseDto: CreateClaseDto) {
    // CORRECCIÓN: Leemos 'id' que es lo que vimos en tu consola
    const idDocente = req.user.id || req.user.userId || req.user.sub;
    
    // Un log de seguridad para que verifiques que ahora sí llega el número 14
    console.log('ID Docente capturado:', idDocente);

    return this.claseService.crearClase(idDocente, createClaseDto);
  }

  @Get('docente/mis-clases')
  misClasesDocente(@Request() req) {
    // CORRECCIÓN AQUÍ TAMBIÉN
    const idDocente = req.user.id || req.user.userId || req.user.sub;
    return this.claseService.listarClasesDocente(idDocente);
  }

  @Get(':id/estudiantes')
  verEstudiantes(@Param('id', ParseIntPipe) id: number) {
    return this.claseService.obtenerDetalleClase(id);
  }

  // --- ESTUDIANTE ---
  @Post('unirse')
  unirse(@Request() req, @Body() joinClaseDto: JoinClaseDto) {
    // CORRECCIÓN AQUÍ TAMBIÉN
    const idEstudiante = req.user.id || req.user.userId || req.user.sub;
    return this.claseService.unirseAClase(idEstudiante, joinClaseDto.codigo);
  }

  @Get('estudiante/mis-clases')
  misClasesEstudiante(@Request() req) {
    // CORRECCIÓN AQUÍ TAMBIÉN
    const idEstudiante = req.user.id || req.user.userId || req.user.sub;
    return this.claseService.listarClasesEstudiante(idEstudiante);
  }
}