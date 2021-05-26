import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Tour } from 'src/tours/entities/tour.entity';
import { ToursService } from 'src/tours/tours.service';
import { PageInfo } from 'src/types/pagination';
import { paginate } from 'src/utils/pagination';
import { Connection, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly toursService: ToursService,
    @InjectConnection() private connection: Connection
  ) { }
  private addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  create(createReservationDto: CreateReservationDto) {
    // check reserverd
    const { tourId, startDate, endDate } = createReservationDto
    return this.connection.transaction(async entityManager => {
      const { days, startDate: firstDay, endDate: lastDay } = await entityManager.findOne(Tour, +tourId, { lock: { mode: 'pessimistic_read' } })
      if (startDate < firstDay || endDate > lastDay) {
        return false;
      }
      if (startDate < new Date() || startDate > this.addDays(new Date(), 365)) {
        return false
      }
      // check # of days match
      const day = 24 * 60 * 60 * 1000;
      const calculatedDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / day)) + 1;
      if (calculatedDays != days) {
        return false;
      }
      const collided = await entityManager.findOne(Reservation, {
        where: {
          tourId,
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate)
        }
      })
      if (collided) {
        return false
      }
      return await entityManager.save(Reservation, {
        ...createReservationDto
      })
    })
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number, expansion?: string[]) {
    return this.reservationsRepository.findOne(id, { relations: expansion });
  }

  findByUser(userId: number, pageInfo: PageInfo, expansion: string[]) {
    return paginate(this.reservationsRepository, pageInfo, { userId }, expansion)
  }

  findByTour(tourId: number) {
    return this.reservationsRepository.find({
      where: {
        tourId
      }
    })
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
