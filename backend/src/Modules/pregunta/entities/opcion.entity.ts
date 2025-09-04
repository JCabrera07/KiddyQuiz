import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { TipoContenido } from './tipo-contenido.entity';

@Entity('opcion')
export class Opcion {
  @PrimaryGeneratedColumn({ name: 'id_opcion' })
  id: number;

  @ManyToOne(() => Pregunta, pregunta => pregunta.opciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  @Column({ name: 'texto_opcion', type: 'text' })
  texto: string;

  @ManyToOne(() => TipoContenido, tipo => tipo.opciones, { nullable: true })
  @JoinColumn({ name: 'id_tipo_contenido' })
  tipoContenido: TipoContenido | null; // ahora puede ser null

@Column({ name: 'url_contenido', type: 'text', nullable: true })
urlContenido: string | null;

  @Column({ name: 'es_correcta', default: false })
  esCorrecta: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
