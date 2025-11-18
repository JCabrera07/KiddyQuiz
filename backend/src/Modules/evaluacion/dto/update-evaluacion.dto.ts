import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEvaluacionDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @Type(() => Date)
  fechaInicio?: Date;

  @IsOptional()
  @Type(() => Date)
  fechaFin?: Date;
}
