import { Module } from '@nestjs/common';
import { PreguntaController } from './pregunta.controller';
import { PreguntaService } from './pregunta.service';

@Module({
  controllers: [PreguntaController],
  providers: [PreguntaService]
})
export class PreguntaModule {}
