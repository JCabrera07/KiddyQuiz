import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  // NUEVO: Recibimos el ID de la clase para hacer la relación
  @IsNotEmpty()
  @Type(() => Number) // Convierte el string del FormData a número
  claseId: number; 

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // Importante para FormData
  estado?: boolean;

  @IsOptional()
  @Type(() => Date)
  fechaInicio?: Date;

  @IsOptional()
  @Type(() => Date)
  fechaFin?: Date;
}