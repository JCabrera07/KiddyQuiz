import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';
// Importamos Grado
import { Grado } from './grado.entity';

@Entity('competencia')
export class Competencia {
  @PrimaryGeneratedColumn({ name: 'id_competencia' })
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.competencia)
  preguntas: Pregunta[];

  // --- NUEVA RELACIÓN ---
  @ManyToOne(() => Grado)
  @JoinColumn({ name: 'id_grado' })
  grado: Grado;

  @Column({ name: 'id_grado', nullable: true })
  idGrado: number;
}