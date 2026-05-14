import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

// Entidades necesarias
import { Clase } from '../extra/entities/clase.entity';
import { DetalleEvaluacion } from '../evaluacion/entities/detalle-evaluacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clase, DetalleEvaluacion]) 
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}