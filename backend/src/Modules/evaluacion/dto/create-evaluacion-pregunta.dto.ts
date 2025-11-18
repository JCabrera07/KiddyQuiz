import { IsNumber, IsOptional } from 'class-validator';

export class CreateEvaluacionPreguntaDto {
  @IsNumber()
  evaluacionId: number;

  @IsNumber()
  preguntaId: number;

  @IsOptional()
  @IsNumber()
  orden?: number;
}
