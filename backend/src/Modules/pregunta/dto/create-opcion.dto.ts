import { IsBoolean, IsNotEmpty, IsOptional, IsNumber, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer'; // <--- IMPORTAR ESTO

export class CreateOpcionDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // Asegurar que sea número
  idPregunta: number;

  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : null) // Asegurar número o null
  idTipoContenido?: number;

  @IsBoolean()
  @IsOptional()
  // --- ESTA ES LA SOLUCIÓN ---
  // Convierte el string "true" que envía el FormData a un booleano real
  @Transform(({ value }) => value === 'true' || value === true) 
  esCorrecta?: boolean;

  @IsString()
  @IsOptional()
  urlContenido?: string;
}
