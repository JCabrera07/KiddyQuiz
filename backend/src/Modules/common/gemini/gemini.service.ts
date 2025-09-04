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
    const prompt = `
    Realiza un análisis académico del desempeño de este estudiante con la información siguiente:
    ${JSON.stringify(jsonEstudiante, null, 2)}
    , escribas un repaso de la informacion, solo da una respuesta con los datos que se te brindan`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
