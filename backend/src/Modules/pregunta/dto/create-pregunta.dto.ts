import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePreguntaDto {
  @IsNumber()
  tipoPreguntaId: number;

  @IsNumber()
  dificultadId: number;

  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @IsNumber()
  tipoContenidoId: number;

  @IsOptional()
  @IsString()
  urlContenido?: string; // será la URL de Cloudinary si se sube archivo

  // Campo opcional para asociar la pregunta a una competencia (tema)
  @IsOptional()
  @IsNumber()
  competenciaId?: number; 
}