import { Module } from '@nestjs/common';
import { GradoController } from './grado.controller';
import { GradoService } from './grado.service';

@Module({
  controllers: [GradoController],
  providers: [GradoService]
})
export class GradoModule {}
