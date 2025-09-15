export interface Evaluacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  estado: boolean;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  updatedAt: string | null;
}
