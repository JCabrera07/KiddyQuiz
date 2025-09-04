import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRespuestaUsuarioDto {
  @IsOptional()
  @IsNumber()
  idDetalleEvaluacion?: number;

  @IsOptional()
  @IsNumber()
  idPregunta?: number;

  @IsOptional()
  @IsNumber()
  idOpcionSeleccionada?: number | null;

  @IsOptional()
  @IsString()
  respuestaAbierta?: string;

  @IsOptional()
  @IsBoolean()
  esCorrecta?: boolean;

  @IsOptional()
  @Type(() => Number)
  tiempoPorPregunta?: number;
}
