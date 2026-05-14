import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer'; // <--- IMPORTANTE: IMPORTA ESTO

export class CreatePreguntaDto {
  @IsString()
  @IsNotEmpty()
  enunciado: string;

  // --- TRANSFORMAR DE TEXTO A NÚMERO ---

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // Convierte "1" a 1
  idTipoPregunta: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // Convierte "2" a 2
  idDificultad: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // Convierte "5" a 5
  idCompetencia: number;

  @IsNumber()
  @IsOptional()
  // Si viene valor lo convierte, si no, lo deja null
  @Transform(({ value }) => value ? parseInt(value) : null) 
  idTipoContenido?: number;

  @IsString()
  @IsOptional()
  urlContenido?: string;
}