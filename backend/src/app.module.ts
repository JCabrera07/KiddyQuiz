import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './Modules/usuario/usuario.module';
import { GradoModule } from './Modules/grado/grado.module';
import { EvaluacionModule } from './Modules/evaluacion/evaluacion.module';
import { PreguntaModule } from './Modules/pregunta/pregunta.module';
import { RespuestaModule } from './Modules/respuesta/respuesta.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Puerto docker
      username: 'postgres',
      password: '123456',
      database: 'KiddyQuizDB', // o el nombre que estés usando
      autoLoadEntities: true,
      synchronize: false, // en desarrollo, no usar en producción
    }),
    UsuarioModule,
    GradoModule,
    EvaluacionModule, 
    PreguntaModule,
    RespuestaModule,
  ],
})
export class AppModule {}
