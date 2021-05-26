import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ToursModule } from './tours/tours.module';
import { ActivitiesModule } from './activities/activities.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CaslModule } from './casl/casl.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'touroll',
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    AuthModule,
    UsersModule,
    ChatModule,
    ToursModule,
    ActivitiesModule,
    ReservationsModule,
    CaslModule,
    UploadsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
