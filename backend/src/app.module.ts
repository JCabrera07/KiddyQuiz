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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'KiddyFinalDB',
      autoLoadEntities: true,
      synchronize: false, // en desarrollo, no usar en producción
    }),
    UsuarioModule,
    ExtraModule,
    EvaluacionModule, 
    PreguntaModule,
    RespuestaModule,
    AuthModule
  ],
})
export class AppModule {}
