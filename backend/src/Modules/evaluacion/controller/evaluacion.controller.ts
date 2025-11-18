import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Patch, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EvaluacionService } from '../services/evaluacion.service';
import { CreateEvaluacionDto } from '../dto/create-evaluacion.dto';
import cloudinary from 'src/cloudinary.config';
import { UpdateEvaluacionDto } from '../dto/update-evaluacion.dto';
<<<<<<< HEAD
import { SubmitEvaluacionDto } from '../dto/submit-evaluacion.dto';
=======
>>>>>>> dae56bda09222a7943d6f2bed32053550878ec49

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads', // ruta temporal local
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `evaluacion-${uniqueSuffix}${ext}`);
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

  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateEvaluacionDto,
  ) {
    if (!file) throw new BadRequestException('La imagen es obligatoria');

    //Subir imagen a Cloudinary
    const uploaded = await cloudinary.uploader.upload(file.path);
    const imagenUrl = uploaded.secure_url; // URL pública

    //Crear la evaluación con la URL de Cloudinary
    return this.evaluacionService.create({ ...createDto, imagenUrl });
  }
  // Listar todas las evaluaciones
  @Get()
  async findAll() {
    return this.evaluacionService.findAll();
  }

  // Listar evaluaciones por usuario
  @Get('usuario/:id')
  async findByUsuario(@Param('id') id: string) {
    const usuarioId = parseInt(id, 10);
    return this.evaluacionService.findByUsuarioId(usuarioId);
  }

<<<<<<< HEAD
  @Get(':id/quiz')
async findQuiz(@Param('id', ParseIntPipe) id: number) {
  return this.evaluacionService.findQuizById(id);
}

=======
>>>>>>> dae56bda09222a7943d6f2bed32053550878ec49
  // ACTUALIZAR EVALUACION (con imagen opcional)
  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEvaluacionDto: UpdateEvaluacionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evaluacionService.update(id, updateEvaluacionDto, file);
  }

    // ELIMINAR
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionService.remove(id);
  }

  @Get(':id')
async findOne(@Param('id') id: number) {
  return this.evaluacionService.findOne(+id);
}

<<<<<<< HEAD
@Post(':id/submit')
  async submitEvaluacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() submitEvaluacionDto: SubmitEvaluacionDto,
  ) {
    // La validación del DTO ocurre automáticamente gracias a los pipes de NestJS
    // Simplemente llamamos al servicio con los datos ya validados.
    return this.evaluacionService.calificarEvaluacion(id, submitEvaluacionDto);
  }

=======
>>>>>>> dae56bda09222a7943d6f2bed32053550878ec49

}

