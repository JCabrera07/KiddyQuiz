import { Controller, Get } from '@nestjs/common';
import { TipoPreguntaService } from '../services/tipo-pregunta.service';

@Controller('tipo-pregunta')
export class TipoPreguntaController {
  constructor(private readonly tipoPreguntaService: TipoPreguntaService) {}

  @Get()
  findAll() {
    return this.tipoPreguntaService.findAll();
  }
}
