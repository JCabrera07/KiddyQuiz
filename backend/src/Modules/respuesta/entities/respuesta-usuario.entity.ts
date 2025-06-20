import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DetalleEvaluacion } from '../../evaluacion/entities/detalle-evaluacion.entity';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';
import { Opcion } from '../../pregunta/entities/opcion.entity';

@Entity('respuesta_usuario')
export class RespuestaUsuario {
  @PrimaryGeneratedColumn({ name: 'id_respuesta_usuario' })
  id: number;

  @ManyToOne(() => DetalleEvaluacion, detalle => detalle.respuestas)
  detalleEvaluacion: DetalleEvaluacion;

  @ManyToOne(() => Pregunta)
  pregunta: Pregunta;

  @ManyToOne(() => Opcion, { nullable: true })
  opcionSeleccionada: Opcion;

  @Column({ name: 'respuesta_abierta', type: 'text', nullable: true })
  respuestaAbierta: string;

  @Column({ name: 'es_correcta', nullable: true })
  esCorrecta: boolean;

  @Column({ name: 'tiempo_por_pregunta', type: 'interval', nullable: true })
  tiempoPorPregunta: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
