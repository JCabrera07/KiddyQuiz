import { IsInt, Min } from 'class-validator';

export class UpdateOrdenDto {
  @IsInt()
  @Min(1)
  orden: number;
}
