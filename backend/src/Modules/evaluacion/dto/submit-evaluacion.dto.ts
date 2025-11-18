
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para cada respuesta individual
class RespuestaDto {
  @IsInt()
  @IsNotEmpty()
  id_pregunta: number;

  @IsInt()
  @IsNotEmpty()
  id_opcion_seleccionada: number;
}

// DTO principal para el body de la solicitud
export class SubmitEvaluacionDto {
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  // Puedes manejar 'interval' como string y convertirlo en el backend
  @IsNotEmpty()
  tiempo_total: string; 

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto dentro del array
  @Type(() => RespuestaDto) // Especifica el tipo del objeto en el array
  respuestas: RespuestaDto[];
}