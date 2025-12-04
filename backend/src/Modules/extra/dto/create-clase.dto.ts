import { IsString, IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';

export class CreateClaseDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nombre: string;

  @IsOptional()
  @IsNumber()
  gradoId?: number;
}