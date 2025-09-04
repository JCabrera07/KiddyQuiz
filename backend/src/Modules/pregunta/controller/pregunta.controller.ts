import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PreguntaService } from '../services/pregunta.service';
import { CreatePreguntaDto } from '../dto/create-pregunta.dto';
import cloudinary from 'src/cloudinary.config';
import { UpdatePreguntaDto } from '../dto/update-pregunta.dto';

@Controller('pregunta')
export class PreguntaController {
  constructor(private readonly preguntaService: PreguntaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('urlContenido', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `pregunta-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|mp3|mp4)$/)) {
          return cb(new BadRequestException('Formato no permitido'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreatePreguntaDto,
  ) {
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path);
      createDto.urlContenido = uploaded.secure_url;
    } else if (!createDto.urlContenido) {
      throw new BadRequestException('Debes enviar un archivo o una URL');
    }

    return this.preguntaService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.preguntaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preguntaService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('urlContenido', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `pregunta-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|mp3|mp4)$/)) {
          return cb(new BadRequestException('Formato no permitido'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdatePreguntaDto,
  ) {
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path);
      dto.urlContenido = uploaded.secure_url;
    }

    return this.preguntaService.update(id, dto);
  }

    @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.preguntaService.remove(id);
  }
}

