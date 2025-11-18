export class CreatePersonaDto {
  nombres: string;
  apellidos: string;
  fechaNacimiento?: Date;
  ciudad?: string;
  sexo?: string;
  edad: number;

  // datos del usuario
  username: string;
  password: string;

  // relaciones
  rolId: number;
  gradoId: number;
}
