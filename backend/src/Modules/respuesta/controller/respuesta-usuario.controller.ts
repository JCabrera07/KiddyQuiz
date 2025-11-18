import { Controller, Get, Post, Param, Delete, Body, Patch, ParseIntPipe, Put } from '@nestjs/common';
import { RespuestaUsuarioService } from '../services/respuesta-usuario.service';
import { CreateRespuestaUsuarioDto } from '../dto/create-respuesta-usuario.dto';
import { UpdateRespuestaUsuarioDto } from '../dto/update-respuesta-usuario.dto';

@Controller('respuesta-usuario')
export class RespuestaUsuarioController {
  respuestaService: any;
  constructor(private readonly respuestaUsuarioService: RespuestaUsuarioService) {}

  // Crear respuesta
  @Post()
  create(@Body() dto: CreateRespuestaUsuarioDto) {
    return this.respuestaUsuarioService.create(dto);
  }

  // Listar todas las respuestas
  @Get()
  findAll() {
    return this.respuestaUsuarioService.findAll();
  }

  // Listar una respuesta por ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.respuestaUsuarioService.findOne(+id);
  }

  // Eliminar respuesta por ID
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.respuestaUsuarioService.remove(+id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRespuestaUsuarioDto,
  ) {
    return this.respuestaUsuarioService.update(id, dto);
  }
}
