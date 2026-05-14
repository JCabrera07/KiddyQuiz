import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, UseInterceptors, BadRequestException, UploadedFile, Patch, Delete } from '@nestjs/common';
import { ClaseService } from '../services/clase.service';
import { CreateClaseDto } from '../dto/create-clase.dto';
import { JoinClaseDto } from '../dto/join-clase.dto';
import { JwtAuthGuard } from 'src/Modules/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateClaseDto } from '../dto/update-clase.dto';

@Controller('clase')
@UseGuards(JwtAuthGuard)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}
 // --- DOCENTE ---
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads', // Asegúrate de que esta carpeta exista
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `clase-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos JPG, JPEG o PNG'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async crear(
    @Request() req, 
    @Body() createClaseDto: CreateClaseDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const idDocente = req.user.id || req.user.userId || req.user.sub;
    console.log('ID Docente creando clase:', idDocente);

    let imagenUrl: string | undefined = undefined;

    // Si se subió un archivo, lo enviamos a Cloudinary
    if (file) {
      try {
        const uploaded = await cloudinary.uploader.upload(file.path);
        imagenUrl = uploaded.secure_url;
      } catch (error) {
        console.error('Error subiendo a Cloudinary:', error);
        // Opcional: lanzar excepción si la imagen es obligatoria
      }
    }

    // Llamamos al servicio pasando el DTO actualizado con la URL
    // Nota: Asegúrate de que tu servicio acepte este parámetro extra o inyéctalo en el DTO
    const dtoConImagen = { ...createClaseDto, imagenUrl };

    return this.claseService.crearClase(idDocente, dtoConImagen);
  }

  @Get('docente/mis-clases')
  misClasesDocente(@Request() req) {
    // CORRECCIÓN AQUÍ TAMBIÉN
    const idDocente = req.user.id || req.user.userId || req.user.sub;
    return this.claseService.listarClasesDocente(idDocente);
  }

  @Get(':id/estudiantes')
  verEstudiantes(@Param('id', ParseIntPipe) id: number) {
    return this.claseService.obtenerDetalleClase(id);
  }

  // --- ESTUDIANTE ---
  @Post('unirse')
  unirse(@Request() req, @Body() joinClaseDto: JoinClaseDto) {
    // CORRECCIÓN AQUÍ TAMBIÉN
    const idEstudiante = req.user.id || req.user.userId || req.user.sub;
    return this.claseService.unirseAClase(idEstudiante, joinClaseDto.codigo);
  }

  @Patch(':id')
@UseInterceptors(
  FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `clase-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Solo JPG, JPEG o PNG'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
)
async editar(
  @Request() req,
  @Param('id', ParseIntPipe) id: number,
  @Body() updateClaseDto: UpdateClaseDto,
  @UploadedFile() file: Express.Multer.File
) {
  const idDocente = req.user.id || req.user.userId || req.user.sub;
  
  let imagenUrl: string | undefined = undefined;

  // Si se sube una NUEVA imagen, la procesamos
  if (file) {
    try {
      const uploaded = await cloudinary.uploader.upload(file.path);
      imagenUrl = uploaded.secure_url;
    } catch (error) {
      console.error('Error Cloudinary:', error);
    }
  }

  // Pasamos la URL nueva (si existe) o undefined
  const dtoConImagen = { ...updateClaseDto, ...(imagenUrl && { imagenUrl }) };

  return this.claseService.actualizarClase(id, idDocente, dtoConImagen);
}

@Delete(':id')
async eliminar(
  @Request() req,
  @Param('id', ParseIntPipe) id: number
) {
  const idDocente = req.user.id || req.user.userId || req.user.sub;
  return this.claseService.eliminarClase(id, idDocente);
}

  @Get('estudiante/mis-clases')
  misClasesEstudiante(@Request() req) {
    // CORRECCIÓN AQUÍ TAMBIÉN
    const idEstudiante = req.user.id || req.user.userId || req.user.sub;
    return this.claseService.listarClasesEstudiante(idEstudiante);
  }

    @Get(':id/evaluaciones')
  obtenerEvaluaciones(@Param('id', ParseIntPipe) id: number) {
    return this.claseService.obtenerEvaluacionesDeClase(id);
  }
}