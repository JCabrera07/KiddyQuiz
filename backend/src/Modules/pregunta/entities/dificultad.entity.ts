import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pregunta } from './pregunta.entity';

@Entity('dificultad')
export class Dificultad {
  @PrimaryGeneratedColumn({ name: 'id_dificultad' })
  id: number;

  @Column({ name: 'nombre_dificultad', length: 50 })
  nombre: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Pregunta, pregunta => pregunta.dificultad)
  preguntas: Pregunta[];
}
