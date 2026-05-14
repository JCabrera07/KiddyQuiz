import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioModule } from './Modules/usuario/usuario.module';
import { ExtraModule } from './Modules/extra/extra.module';
import { EvaluacionModule } from './Modules/evaluacion/evaluacion.module';
import { PreguntaModule } from './Modules/pregunta/pregunta.module';
import { RespuestaModule } from './Modules/respuesta/respuesta.module';
import { AuthModule } from './Modules/auth/auth.module';
import { AnalyticsModule } from './Modules/analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,

  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
    }),

    UsuarioModule,
    ExtraModule,
    EvaluacionModule,
    PreguntaModule,
    RespuestaModule,
    AuthModule,
    AnalyticsModule,
  ],
})
export class AppModule {}