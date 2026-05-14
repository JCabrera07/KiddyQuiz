import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreatePersonaDto } from '../dto/create-persona.dto';
import { JwtAuthGuard } from 'src/Modules/auth/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdatePersonaDto } from '../dto/update-persona.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() dto: CreatePersonaDto) {
    return this.usuarioService.create(dto);
  }

@UseGuards(JwtAuthGuard)
  @Get('mis-estudiantes')
  async findMyStudents(@Request() req) {
    // El ID del docente viene del Token JWT
    const docenteId = req.user.id || req.user.userId || req.user.sub;
    return this.usuarioService.findStudentsByTeacher(docenteId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    const userId = req.user.id; // viene del JWT
    return this.usuarioService.changePassword(userId, dto.oldPassword, dto.newPassword);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
async findOne(@Param('id') id: number) {
  return this.usuarioService.findOne(+id);
}


@UseGuards(JwtAuthGuard)
@Patch(':id')
async updateUser(
  @Param('id') id: number,
  @Body() dto: UpdatePersonaDto,
) {
  return this.usuarioService.updateUser(+id, dto);
}

}
