import { IsString, IsNotEmpty } from 'class-validator';

export class JoinClaseDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;
}