import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProgresoCompetenciaDto {

  @IsNumber()
  estudianteId: number;

  @IsNumber()
  competenciaId: number;

  @IsNumber()
  @Min(1) // Al menos debe haber 1 pregunta para calcular
  totalPreguntas: number;

  @IsNumber()
  @Min(0)
  preguntasCorrectas: number;

  @IsOptional()
  @IsNumber()
  detalleEvaluacionId?: number; // Opcional, por si quieres vincularlo al examen específico
}
