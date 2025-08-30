import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Evaluacion } from './evaluacion.entity';
import { RespuestaUsuario } from '../../respuesta/entities/respuesta-usuario.entity';

@Entity('detalle_evaluacion')
export class DetalleEvaluacion {
  @PrimaryGeneratedColumn({ name: 'id_detalle_evaluacion' })
  id: number;

@ManyToOne(() => Evaluacion, evaluacion => evaluacion.detalles)
@JoinColumn({ name: 'id_evaluacion' })
evaluacion: Evaluacion;

@ManyToOne(() => Usuario, usuario => usuario.detallesEvaluacion)
@JoinColumn({ name: 'id_usuario' })
usuario: Usuario;

  @Column({ type: 'interval', nullable: true })
  tiempo: any;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  calificacion: number;

  @Column({ name: 'comentario_ia', nullable: true, type: 'text' })
  comentarioIA: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RespuestaUsuario, respuesta => respuesta.detalleEvaluacion)
  respuestas: RespuestaUsuario[];
}
