import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';
import { Transform } from 'class-transformer'; // <--- IMPORTAR ESTO

export class UpdateOpcionDto {
  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsBoolean()
  // --- ESTA ES LA SOLUCIÓN ---
  @Transform(({ value }) => value === 'true' || value === true)
  esCorrecta?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  idTipoContenido?: number;

  @IsOptional()
  @IsString()
  urlContenido?: string;
}