import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgresoCompetencia } from '../entities/progreso-competencia.entity';
import { Usuario } from 'src/Modules/usuario/entities/usuario.entity';
import { Competencia } from 'src/Modules/extra/entities/competencia.entity'; // Ajusta ruta
import { DetalleEvaluacion } from 'src/Modules/evaluacion/entities/detalle-evaluacion.entity'; // Ajusta ruta

@Injectable()
export class ProgresoCompetenciaService {

  constructor(
    @InjectRepository(ProgresoCompetencia)
    private readonly progresoRepo: Repository<ProgresoCompetencia>,
  ) {}

  async actualizarProgreso(
    estudianteId: number,
    competenciaId: number,
    totalPreguntas: number,
    preguntasCorrectas: number,
    detalleEvaluacionId?: number,
  ) {
    // 1. Calcular lógica de negocio
    // Evitar división por cero
    const porcentajeCalc = totalPreguntas > 0 
      ? (preguntasCorrectas / totalPreguntas) * 100 
      : 0;
    
    // Asegurar que no pase de 100% y redondear a 2 decimales
    const porcentajeFinal = Math.min(Math.round(porcentajeCalc * 100) / 100, 100);
    
    // Se considera logrado solo si el 100% está correcto (según tu requerimiento anterior)
    const logrado = preguntasCorrectas === totalPreguntas && totalPreguntas > 0;

    // 2. Buscar si ya existe progreso para este estudiante y competencia
    let progreso = await this.progresoRepo.findOne({
      where: {
        estudiante: { id: estudianteId },
        competencia: { id: competenciaId },
      },
      relations: ['estudiante', 'competencia'],
    });

    // 3. Crear o Actualizar
if (!progreso) {
      progreso = this.progresoRepo.create({
        estudiante: { id: estudianteId } as Usuario,
        competencia: { id: competenciaId } as Competencia,
        totalPreguntas,
        preguntasCorrectas,
        porcentaje: porcentajeFinal,
        logrado,
        fechaLogro: logrado ? new Date() : null, // Aquí null suele ser aceptado por ser columna simple
        // CORRECCIÓN AQUÍ: Cambiar null por undefined
        detalleEvaluacion: detalleEvaluacionId 
          ? ({ id: detalleEvaluacionId } as DetalleEvaluacion) 
          : undefined, 
      });
    } else {
      // Actualizamos los valores
      progreso.totalPreguntas = totalPreguntas;
      progreso.preguntasCorrectas = preguntasCorrectas;
      progreso.porcentaje = porcentajeFinal;
      
      // Si antes no estaba logrado y ahora sí, actualizamos la fecha
      if (logrado && !progreso.logrado) {
        progreso.fechaLogro = new Date();
      }
      
      // Si ya estaba logrado y sigue logrado, NO tocamos la fecha original
      // Si dejó de estar logrado (raro, pero posible si bajó su nota), limpiamos fecha?
      // Usualmente se mantiene el logro histórico, pero aquí actualizamos el estado actual:
      progreso.logrado = logrado;
      
      if (detalleEvaluacionId) {
        progreso.detalleEvaluacion = { id: detalleEvaluacionId } as DetalleEvaluacion;
      }
    }

    return this.progresoRepo.save(progreso);
  }

  async obtenerProgresoEstudiante(estudianteId: number) {
    return this.progresoRepo.find({
      where: {
        estudiante: { id: estudianteId },
      },
      relations: ['competencia'], // Opcional: cargar 'detalleEvaluacion' si lo necesitas ver
      order: {
        updatedAt: 'DESC',
      },
    });
  }
}