import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pregunta } from './pregunta.entity';

@Entity('tipo_pregunta')
export class TipoPregunta {
  @PrimaryGeneratedColumn({ name: 'id_tipo_pregunta' })
  id: number;

  @Column({ name: 'nombre_tipo', length: 50 })
  nombre: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Pregunta, pregunta => pregunta.tipoPregunta)
  preguntas: Pregunta[];
}
