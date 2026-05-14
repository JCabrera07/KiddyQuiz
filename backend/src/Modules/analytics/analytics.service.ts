import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Ajusta estas rutas a donde tengas tus entidades
import { Clase } from '../extra/entities/clase.entity';
import { DetalleEvaluacion } from '../evaluacion/entities/detalle-evaluacion.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Clase) private claseRepo: Repository<Clase>,
    @InjectRepository(DetalleEvaluacion) private detalleRepo: Repository<DetalleEvaluacion>,
  ) {}

  async getTeacherDashboard(docenteId: number) {
    
    // ---------------------------------------------------------
    // 1. KPIs
    // ---------------------------------------------------------

    // A. Clases Activas
    const clasesActivas = await this.claseRepo.count({ 
      where: { idDocente: docenteId } 
    });

    // B. Estudiantes Totales (Únicos)
    // Asumiendo que Clase tiene la relación 'estudiantes' definida
    const estudiantesQuery = await this.claseRepo.createQueryBuilder('clase')
      .innerJoin('clase.estudiantes', 'estudiante') 
      .where('clase.idDocente = :docenteId', { docenteId })
      .select('COUNT(DISTINCT estudiante.id)', 'total')
      .getRawOne();
    
    const totalEstudiantes = parseInt(estudiantesQuery?.total || '0');

    // C. Promedio General del Docente
    // detalle -> evaluacion -> clases -> docente
    const promedioQuery = await this.detalleRepo.createQueryBuilder('detalle')
      .innerJoin('detalle.evaluacion', 'evaluacion')
      .innerJoin('evaluacion.clases', 'clase') 
      .where('clase.idDocente = :docenteId', { docenteId })
      .select('AVG(detalle.calificacion)', 'promedio')
      .getRawOne();

    const promedioGeneral = parseFloat(promedioQuery?.promedio || '0').toFixed(2);


    // ---------------------------------------------------------
    // 2. Gráfico de Barras: Rendimiento por Clase
    // ---------------------------------------------------------
    const rendimientoClases = await this.detalleRepo.createQueryBuilder('detalle')
      .innerJoin('detalle.evaluacion', 'evaluacion')
      .innerJoin('evaluacion.clases', 'clase')
      .where('clase.idDocente = :docenteId', { docenteId })
      .select('clase.nombre', 'clase')
      .addSelect('AVG(detalle.calificacion)', 'promedio')
      .groupBy('clase.id')
      .getRawMany();

    // ---------------------------------------------------------
    // 3. Gráfico de Dona: Estado General
    // ---------------------------------------------------------
    // Umbrales: Aprobado >= 7, Riesgo 5-7, Reprobado < 5 (Ajusta si es necesario)
    const estadoQuery = await this.detalleRepo.createQueryBuilder('detalle')
      .innerJoin('detalle.evaluacion', 'evaluacion')
      .innerJoin('evaluacion.clases', 'clase')
      .where('clase.idDocente = :docenteId', { docenteId })
      .select("SUM(CASE WHEN detalle.calificacion >= 7 THEN 1 ELSE 0 END)", "aprobados")
      .addSelect("SUM(CASE WHEN detalle.calificacion < 7 AND detalle.calificacion >= 5 THEN 1 ELSE 0 END)", "riesgo")
      .addSelect("SUM(CASE WHEN detalle.calificacion < 5 THEN 1 ELSE 0 END)", "reprobados")
      .getRawOne();

    // ---------------------------------------------------------
    // 4. Tabla: Estudiantes en Riesgo (Alerta Temprana)
    // ---------------------------------------------------------
    // Usamos 'detalle.usuario' como definiste en tu entidad
    const estudiantesRiesgo = await this.detalleRepo.createQueryBuilder('detalle')
      .innerJoin('detalle.usuario', 'usuario') // <--- CAMBIO AQUÍ: usuario
      .innerJoin('usuario.personas', 'persona') // Para obtener nombre real
      .innerJoin('detalle.evaluacion', 'evaluacion')
      .innerJoin('evaluacion.clases', 'clase')
      .where('clase.idDocente = :docenteId', { docenteId })
      .select(['usuario.id', 'persona.nombres', 'persona.apellidos', 'clase.nombre'])
      .addSelect('AVG(detalle.calificacion)', 'promedio')
      .groupBy('usuario.id')
      .addGroupBy('persona.id') 
      .addGroupBy('clase.id')
      .having('AVG(detalle.calificacion) < :umbral', { umbral: 7 }) 
      .getRawMany();

    // ---------------------------------------------------------
    // 5. Retorno
    // ---------------------------------------------------------
    return {
      kpis: {
        totalEstudiantes,
        clasesActivas,
        promedioGeneral,
        evaluacionesPendientes: 0 
      },
      rendimientoPorClase: rendimientoClases.map(r => ({
        clase: r.clase,
        promedio: parseFloat(Number(r.promedio).toFixed(2))
      })),
      estadoEstudiantes: {
         aprobados: parseInt(estadoQuery?.aprobados || '0'),
         riesgo: parseInt(estadoQuery?.riesgo || '0'),
         reprobados: parseInt(estadoQuery?.reprobados || '0')
      },
      estudiantesEnRiesgo: estudiantesRiesgo.map(e => ({
        id: e.usuario_id,
        nombre: `${e.persona_nombres} ${e.persona_apellidos}`,
        clase: e.clase_nombre,
        promedio: parseFloat(Number(e.promedio).toFixed(2)),
        estado: Number(e.promedio) < 5 ? 'Crítico' : 'Riesgo'
      }))
    };
  }
}