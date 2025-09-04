import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class UpdateOpcionDto {
  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsBoolean()
  esCorrecta?: boolean;

  @IsOptional()
  @IsInt()
  idTipoContenido?: number; // Para actualizar relación con tipoContenido
}
