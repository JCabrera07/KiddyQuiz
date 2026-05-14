import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from '../entities/clase.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { CreateClaseDto } from '../dto/create-clase.dto';
import { UpdateClaseDto } from '../dto/update-clase.dto';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepo: Repository<Clase>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  private generarCodigo(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }

  async crearClase(idDocente: number, dto: CreateClaseDto) {
    const docente = await this.usuarioRepo.findOne({ where: { id: idDocente } });
    if (!docente) throw new NotFoundException('Docente no encontrado');

    let codigo = this.generarCodigo();
    let existe = await this.claseRepo.findOne({ where: { codigoVinculacion: codigo } });
    while (existe) {
      codigo = this.generarCodigo();
      existe = await this.claseRepo.findOne({ where: { codigoVinculacion: codigo } });
    }

    // Aquí podrías agregar la lógica para guardar el 'dto.gradoId' si actualizas el DTO
    const nuevaClase = this.claseRepo.create({
      nombre: dto.nombre,
      codigoVinculacion: codigo,
      docente: docente,
      grado: { id: dto.gradoId },
      imagenUrl: dto.imagenUrl
    });

    return await this.claseRepo.save(nuevaClase);
  }

  async actualizarClase(id: number, idDocente: number, dto: UpdateClaseDto) {
  // 1. Buscamos la clase y verificamos que pertenezca al docente (seguridad)
  const clase = await this.claseRepo.findOne({ 
    where: { id, idDocente }, // Solo si el docente es dueño
    relations: ['grado']
  });

  if (!clase) throw new NotFoundException('Clase no encontrada o no tienes permisos');

  // 2. Actualizamos campos simples
  if (dto.nombre) clase.nombre = dto.nombre;
  
  // 3. Actualizamos Grado si viene
  if (dto.gradoId) {
    clase.grado = { id: dto.gradoId } as any;
  }

  // 4. Actualizamos Imagen SOLO si viene una nueva en el DTO
  // (El controlador se encargará de pasar la URL si se subió archivo)
  if (dto.imagenUrl) {
    clase.imagenUrl = dto.imagenUrl;
  }

  return await this.claseRepo.save(clase);
}

  async listarClasesDocente(idDocente: number) {
    return await this.claseRepo.find({
      where: { idDocente },
      relations: ['grado'], // Traemos el grado para mostrarlo
      order: { createdAt: 'DESC' }
    });
  }

  // --- MEJORADO: Listar con relaciones completas ---
  async listarClasesEstudiante(idEstudiante: number) {
    // Usamos find para cargar relaciones anidadas desde la perspectiva del usuario
    // O podemos hacer una query directa sobre la tabla intermedia si queremos optimizar,
    // pero TypeORM lo maneja bien así para volúmenes normales.
    
    // Opción A: Buscar el usuario y sus clases (y dentro de sus clases, el docente y grado)
    const usuario = await this.usuarioRepo.findOne({
      where: { id: idEstudiante },
      relations: [
        'clasesInscritas', 
        'clasesInscritas.docente', // Traer nombre del profesor
        'clasesInscritas.docente.personas', // Para tener nombres y apellidos reales (si usas Persona)
        'clasesInscritas.grado'    // Traer nombre del grado
      ],
      order: {
        clasesInscritas: {
          createdAt: 'DESC'
        }
      }
    });
    
    if (!usuario) throw new NotFoundException('Estudiante no encontrado');
    
    // Mapeamos para devolver una estructura limpia si es necesario, 
    // o devolvemos el array directo.
    return usuario.clasesInscritas;
  }

  // --- LÓGICA DE VALIDACIÓN MEJORADA ---
  async unirseAClase(idEstudiante: number, codigo: string) {
    const clase = await this.claseRepo.findOne({ 
      where: { codigoVinculacion: codigo },
      relations: ['estudiantes', 'grado'] // Cargamos el grado de la clase
    });

    if (!clase) throw new NotFoundException('Código de clase inválido');

    // Verificar si ya está inscrito
    const yaInscrito = clase.estudiantes.some(e => e.id === idEstudiante);
    if (yaInscrito) throw new BadRequestException('Ya estás inscrito en esta clase');

    // Buscar al estudiante y sus datos personales (para ver su grado)
    const estudiante = await this.usuarioRepo.findOne({ 
      where: { id: idEstudiante },
      relations: ['personas', 'personas.grado'] // Asumiendo que 'grado' está en 'persona'
    });
    
    if (!estudiante) {
        throw new NotFoundException('Usuario estudiante no encontrado');
    }

    // VALIDACIÓN DE GRADO (Opcional)
    // Si la clase tiene grado y el estudiante tiene grado, verificamos que coincidan
    if (clase.grado && estudiante.personas && estudiante.personas.length > 0) {
       const personaEstudiante = estudiante.personas[0];
       if (personaEstudiante.grado && personaEstudiante.grado.id !== clase.grado.id) {
           // Aquí decides si lanzas error o solo warning.
           // throw new BadRequestException(`Esta clase es de ${clase.grado.nombre} y tú estás en ${personaEstudiante.grado.nombre}`);
           console.warn(`Estudiante de grado diferente uniéndose a clase.`);
       }
    }
    
    clase.estudiantes.push(estudiante);
    await this.claseRepo.save(clase);

    return { message: 'Inscripción exitosa', clase: { id: clase.id, nombre: clase.nombre } };
  }

  async obtenerDetalleClase(idClase: number) {
    const clase = await this.claseRepo.findOne({
      where: { id: idClase },
      relations: ['estudiantes', 'estudiantes.personas'] 
    });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }

   // --- NUEVO: OBTENER EVALUACIONES DE UNA CLASE ---
  async obtenerEvaluacionesDeClase(idClase: number) {
    const clase = await this.claseRepo.findOne({
      where: { id: idClase },
      relations: ['evaluaciones'] // <--- MAGIA AQUÍ
    });

    if (!clase) throw new NotFoundException('Clase no encontrada');
    
    return clase.evaluaciones;
  }

  // En clase.service.ts
async eliminarClase(id: number, idDocente: number) {
  // 1. Buscamos la clase, asegurando que sea del docente Y cargando sus evaluaciones
  const clase = await this.claseRepo.findOne({
    where: { id, idDocente },
    relations: ['evaluaciones'] 
  });

  if (!clase) {
    throw new NotFoundException('No se encontró la clase o no tienes permisos para eliminarla.');
  }

  // 2. VALIDACIÓN DE SEGURIDAD
  if (clase.evaluaciones && clase.evaluaciones.length > 0) {
    // Retornamos un error 400 (Bad Request) con un mensaje claro
    throw new BadRequestException(`No puedes eliminar la clase "${clase.nombre}" porque tiene evaluaciones registradas. Elimina las evaluaciones primero.`);
  }

  // 3. Si pasa la validación, eliminamos
  await this.claseRepo.remove(clase);
  return { message: 'Clase eliminada exitosamente' };
}
}