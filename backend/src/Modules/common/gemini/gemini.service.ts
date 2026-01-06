import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private model;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está definido en el archivo .env');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generarComentarioIA(jsonEstudiante: any): Promise<string> {
    // Filtramos los campos internos y comentario previo
    const datosFiltrados = JSON.parse(
      JSON.stringify(jsonEstudiante, (key, value) => {
        if (
          key === 'id' ||
          key === 'createdAt' ||
          key === 'updatedAt' ||
          key === 'comentarioIA'
        ) {
          return undefined;
        }
        return value;
      })
    );

    const prompt = `
    Eres un asistente académico que analiza en detalle el desempeño de estudiantes.
    Tienes la siguiente información del estudiante y su evaluación:
    ${JSON.stringify(datosFiltrados, null, 2)}

    Instrucciones:
    1. Genera un comentario académico muy detallado y completo.
    2. Incluye secciones como:
       - Información General de la Evaluación y Participación
       - Resultados Detallados por Pregunta (puedes usar tabla Markdown)
       - Análisis de Fortalezas
       - Análisis de Áreas de Oportunidad y Mejora
       - Limitaciones del Análisis (si aplica)
       - Conclusión y Recomendaciones Académicas
    3. Usa formato Markdown para títulos, listas y tablas.
    4. No menciones IDs, fechas de creación o actualización, ni el comentario IA previo.
    5. Limítate a los datos proporcionados; no inventes información adicional.
    6. Responde únicamente con el comentario, sin explicaciones extra.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}


