import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
// Importamos Grado
import { Grado } from './grado.entity';

@Entity('clase')
export class Clase {
  @PrimaryGeneratedColumn({ name: 'id_clase' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ name: 'codigo_vinculacion', length: 20, unique: true })
  codigoVinculacion: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.clasesCreadas)
  @JoinColumn({ name: 'id_docente' })
  docente: Usuario;

  @Column({ name: 'id_docente' })
  idDocente: number;

  @ManyToMany(() => Usuario, (usuario) => usuario.clasesInscritas)
  @JoinTable({
    name: 'clase_estudiante',
    joinColumn: { name: 'id_clase', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_estudiante', referencedColumnName: 'id' }
  })
  estudiantes: Usuario[];

  // --- NUEVA RELACIÓN ---
  @ManyToOne(() => Grado)
  @JoinColumn({ name: 'id_grado' })
  grado: Grado;

  @Column({ name: 'id_grado', nullable: true })
  idGrado: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}