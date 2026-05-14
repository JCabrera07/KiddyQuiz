import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PreguntaService } from '../services/pregunta.service';
import { CreatePreguntaDto } from '../dto/create-pregunta.dto';
import { UpdatePreguntaDto } from '../dto/update-pregunta.dto';
import cloudinary from 'src/cloudinary.config'; // Asegúrate de importar tu config

@Controller('pregunta')
export class PreguntaController {
  constructor(private readonly preguntaService: PreguntaService) {}

  // --- CREAR PREGUNTA CON IMAGEN ---
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', { // El frontend enviará el archivo en el campo 'imagen'
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `pregunta-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) { // Solo imágenes por ahora
          return cb(new BadRequestException('Solo se permiten imágenes (JPG, PNG, GIF)'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreatePreguntaDto,
  ) {
    // 1. Subir imagen a Cloudinary si existe
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, { 
        folder: 'preguntas' 
      });
      createDto.urlContenido = uploaded.secure_url;
    }

    // 2. Crear pregunta
    return this.preguntaService.create(createDto);
  }

  // --- ACTUALIZAR PREGUNTA CON IMAGEN ---
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `pregunta-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdatePreguntaDto,
  ) {
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, { 
        folder: 'preguntas' 
      });
      dto.urlContenido = uploaded.secure_url;
    }

    return this.preguntaService.update(id, dto);
  }

  @Get()
  async findAll() { return this.preguntaService.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.preguntaService.findOne(id); }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) { return this.preguntaService.remove(id); }
}

