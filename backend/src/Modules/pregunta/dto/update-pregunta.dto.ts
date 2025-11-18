// update-pregunta.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePreguntaDto {
  @IsOptional()
  @IsString()
  enunciado?: string;

  @IsOptional()
  @IsNumber()
  tipoPreguntaId?: number;

  @IsOptional()
  @IsNumber()
  dificultadId?: number;

  @IsOptional()
  @IsNumber()
  tipoContenidoId?: number;

  @IsOptional()
  @IsString()
  urlContenido?: string;
}
