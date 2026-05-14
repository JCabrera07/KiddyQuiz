import { PartialType } from '@nestjs/mapped-types';
import { CreatePreguntaDto } from './create-pregunta.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePreguntaDto extends PartialType(CreatePreguntaDto) {
  // Agregamos esto para permitir que llegue la URL de Arasaac como texto
  @IsOptional()
  @IsString()
  urlContenido?: string;
}