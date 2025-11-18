import { IsBoolean, IsNotEmpty, IsOptional, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateOpcionDto {
  @IsNumber()
  @IsNotEmpty()
  idPregunta: number;

  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsNumber()
  @IsOptional()
  idTipoContenido?: number;

  @IsBoolean()
  @IsOptional()
  esCorrecta?: boolean;

  @IsString()
  @IsOptional()
  @IsUrl()
  urlContenido?: string; // ahora se puede pasar la URL directamente
}
