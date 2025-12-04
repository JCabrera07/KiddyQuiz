import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Persona } from './persona.entity';
import { DetalleEvaluacion } from '../../evaluacion/entities/detalle-evaluacion.entity';
import { Clase } from 'src/Modules/extra/entities/clase.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  contrasena: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Persona, persona => persona.usuario)
  personas: Persona[];

  @OneToMany(() => DetalleEvaluacion, detalle => detalle.usuario)
  detallesEvaluacion: DetalleEvaluacion[];

    // Clases que el usuario creó como DOCENTE
  @OneToMany(() => Clase, (clase) => clase.docente)
  clasesCreadas: Clase[];

  // Clases donde el usuario está inscrito como ESTUDIANTE
  @ManyToMany(() => Clase, (clase) => clase.estudiantes)
  clasesInscritas: Clase[];
}
