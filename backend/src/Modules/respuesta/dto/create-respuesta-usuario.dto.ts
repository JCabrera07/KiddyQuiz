import { IsInt, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateRespuestaUsuarioDto {
  @IsInt()
  idDetalleEvaluacion: number;

  @IsInt()
  idPregunta: number;

  @IsOptional()
  @IsInt()
  idOpcionSeleccionada?: number;

  @IsOptional()
  @IsString()
  respuestaAbierta?: string;

  @IsOptional()
  @IsBoolean()
  esCorrecta?: boolean;

  @IsOptional()
  tiempoPorPregunta?: string; // Puedes enviarlo como '00:01:30' por ejemplo
}
