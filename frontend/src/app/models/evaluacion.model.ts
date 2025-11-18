// src/app/models/evaluacion.model.ts

// 1. Definimos la pieza más pequeña: una Opción
export interface Opcion {
  id: number;
  texto: string;
  urlContenido?: string; // <-- AÑADE ESTA LÍNEA (la '?' la hace opcional)
}

// 2. Ahora definimos qué es una Pregunta (que está hecha de Opciones)
export interface Pregunta {
  id: number;
  enunciado: string;
  urlContenido?: string; // <-- AÑADE ESTA LÍNEA
  opciones: Opcion[]; 
}

// 3. Definimos la Evaluación base (la "portada del libro")
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

// 4. Finalmente, definimos la Evaluación completa, que está hecha de Preguntas
export interface EvaluacionConPreguntas extends Evaluacion {
  preguntas: Pregunta[];
}