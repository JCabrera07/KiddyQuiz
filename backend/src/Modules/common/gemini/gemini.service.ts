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

  // --- Retroalimentación IA---
  async generarComentarioIA(jsonEstudiante: any): Promise<string> {
    const datosFiltrados = this.filtrarDatos(jsonEstudiante);

    const prompt = `
    Eres un asistente académico que analiza en detalle el desempeño de estudiantes.
    Tienes la siguiente información del estudiante y su evaluación:
    ${JSON.stringify(datosFiltrados, null, 2)}

    Instrucciones:
    1. Genera un comentario académico muy detallado y completo.
    2. Incluye secciones como:
       - Información General de la Evaluación y Participación
       - Resultados Detallados por Pregunta
       - Análisis de Fortalezas
       - Análisis de Áreas de Oportunidad y Mejora
       - Conclusión y Recomendaciones Académicas
    3. Usa formato Markdown.
    4. Responde únicamente con el comentario.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  // --- NUEVO MÉTODO (CORTO - MÁX 2 LÍNEAS) ---
  async generarComentarioCortoIA(jsonEstudiante: any): Promise<string> {
    const datosFiltrados = this.filtrarDatos(jsonEstudiante);

    const prompt = `
    Eres un asistente académico amable y conciso.
    Analiza brevemente el siguiente desempeño:
    ${JSON.stringify(datosFiltrados, null, 2)}

    Instrucciones:
    1. Genera un comentario de retroalimentación motivador para el estudiante.
    2. RESTRICCIÓN ESTRICTA: El comentario debe tener MÁXIMO 2 líneas de texto (aprox 30 palabras).
    3. Debe ser directo y alentador.
    4. Responde únicamente con el texto del comentario, sin títulos ni explicaciones.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  // --- MÉTODO AUXILIAR PARA NO REPETIR CÓDIGO ---
  private filtrarDatos(json: any): any {
    return JSON.parse(
      JSON.stringify(json, (key, value) => {
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
  }

  async generarContenidoCompetencia(competencia: any): Promise<string> {
    // (Este método se mantiene igual que en tu archivo original)
    const datosFiltrados = JSON.parse(
      JSON.stringify(competencia, (key, value) => {
        if (['id', 'createdAt', 'updatedAt'].includes(key)) return undefined;
        return value;
      })
    );

    const prompt = `
    Eres un asistente académico infantil.
    Tienes la siguiente información de la competencia:
    ${JSON.stringify(datosFiltrados, null, 2)}

    Instrucciones:
    1. Genera contenido educativo y divertido.
    2. Describe la competencia en términos claros.
    3. Responde solo con el contenido.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}


