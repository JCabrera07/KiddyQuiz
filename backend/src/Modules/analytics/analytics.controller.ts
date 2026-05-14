import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard) // Protegemos la rutas
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(@Request() req) {
    // Obtenemos el ID del docente desde el token JWT
    const docenteId = req.user.id || req.user.userId || req.user.sub;
    return this.analyticsService.getTeacherDashboard(docenteId);
  }
}