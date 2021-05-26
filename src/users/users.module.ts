import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ChatModule } from 'src/chat/chat.module';
import { ToursModule } from 'src/tours/tours.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ChatModule, ToursModule, ReservationsModule, UploadsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
