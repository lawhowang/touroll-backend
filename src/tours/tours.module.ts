import { forwardRef, Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './entities/tour.entity';
import { CaslModule } from 'src/casl/casl.module';
import { UploadsModule } from 'src/uploads/uploads.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tour]), CaslModule, UploadsModule, forwardRef(() => ReservationsModule), forwardRef(() => ActivitiesModule)],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService]
})
export class ToursModule {}
