import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';

export class CreateClaseDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  gradoId?: number;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}