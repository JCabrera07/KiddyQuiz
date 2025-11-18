import { Controller, Get } from '@nestjs/common';
import { TipoContenidoService } from '../services/tipo-contenido.service';

@Controller('tipo-contenido')
export class TipoContenidoController {
  constructor(private readonly tipoContenidoService: TipoContenidoService) {}

  @Get()
  findAll() {
    return this.tipoContenidoService.findAll();
  }
}
