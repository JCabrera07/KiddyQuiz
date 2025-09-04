import { Controller, Get } from '@nestjs/common';
import { RolService } from '../services/rol.service';

@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  findAll() {
    return this.rolService.findAll();
  }
}
