import { 
  Controller, 
  Post, 
  Body, 
  UploadedFile, 
  UseInterceptors, 
  Put, 
  Param, 
  ParseIntPipe, 
  BadRequestException, 
  Get,
  Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OpcionService } from '../services/opcion.service';
import { CreateOpcionDto } from '../dto/create-opcion.dto';
import { UpdateOpcionDto } from '../dto/update-opcion.dto';

@Controller('opciones')
export class OpcionController {
  constructor(private readonly opcionService: OpcionService) {}

  // Crear opción con archivo opcional
  @Post()
  @UseInterceptors(
    FileInterceptor('urlContenido', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `opcion-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async create(
    @Body() createOpcionDto: CreateOpcionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.opcionService.create(createOpcionDto, file);
  }

  // Actualizar opción (archivo opcional)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('urlContenido', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `opcion-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOpcionDto: UpdateOpcionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.opcionService.update(id, updateOpcionDto, file);
  }

    // Listar todas
  @Get()
  findAll() {
    return this.opcionService.findAll();
  }

  // Listar por ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.opcionService.findOne(+id);
  }

    // Ruta para eliminar
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.opcionService.remove(+id);
  }
}

