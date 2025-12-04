import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCompetenciaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  gradoId?: number;
}