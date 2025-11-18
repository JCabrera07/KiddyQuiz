import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateDetalleEvaluacionDto {
  @IsNotEmpty()
  @IsNumber()
  evaluacionId: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @IsOptional()
  tiempo?: any;

  @IsOptional()
  @IsNumber()
  calificacion?: number;

  @IsOptional()
  @IsString()
  comentarioIA?: string;
}
