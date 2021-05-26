import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Tour } from 'src/tours/entities/tour.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { Connection, EntityManager, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    @InjectConnection() private connection: Connection,
    private readonly uploadsService: UploadsService
  ) { }

  private checkConflictBeforeAction(id: number, dto, callback: (entityManager: EntityManager) => Promise<Activity>, exclusion?: number[]): Promise<Activity> {
    let { time, duration, tourId } = dto
    return this.connection.transaction(async entityManager => {
      const original = await entityManager.findOne(Activity, id);
      if (time == null || time == undefined) {
        time = original.time
      }
      if (duration == null || duration == undefined) {
        duration = original.duration
      }
      if (tourId == null || tourId == undefined) {
        tourId = original.tourId
      }
      const { days } = await entityManager.findOne(Tour, +tourId, { lock: { mode: 'pessimistic_read' } })
      const max = (days + 1) * 1440
      if (time < 0 || time >= max || duration > 1440) {
        throw new Error()
      }
      const base = await entityManager
        .getRepository(Activity)
        .createQueryBuilder('a')
        .select()
        .where('a.tourId = :tourId', { tourId })
        .andWhere('a.time < :endTime', { endTime: time + duration })
        .andWhere('(a.time + a.duration) > :time', { time: time })

      if (exclusion)
        base.andWhere('a.id NOT IN (:...ids)', { ids: exclusion })
      const collided = await base.getMany()

      if (collided.length) {
        throw new Error()
      }
      return await callback(entityManager)
    })
  }
  create(createActivityDto: CreateActivityDto) {
    // check
    return this.checkConflictBeforeAction(null, createActivityDto, async (e) => {
      const activity: Activity = await e.save(Activity, createActivityDto as Activity)
      if (activity.image) {
        const newId = await this.uploadsService.confirmFile(activity.image, 'tours/activities/', `${activity.id}_`);
        await e.update(Activity, activity.id, { image: newId })
        activity.image = newId
      }
      return activity
    })
  }

  findAll() {
    return `This action returns all activities`;
  }

  findOne(id: number) {
    return this.activitiesRepository.findOne(id, {
      order: {
        time: 'ASC'
      }
    });
  }

  findByTour(tourId: number) {
    return this.activitiesRepository.find({
      where: {
        tourId
      },
      order: {
        time: 'ASC'
      }
    })
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) : Promise<Activity> {
    return this.checkConflictBeforeAction(id, updateActivityDto, async (e) => {
      if (updateActivityDto.image) {
        updateActivityDto.image = await this.uploadsService.confirmFile(updateActivityDto.image, 'tours/activities/', `${id}_`);
      }
      await e.update(Activity, id, updateActivityDto)
      const updated = await e.findOne(Activity, id)
      return updated;
    }, [id])
  }

  remove(id: number) {
    return this.activitiesRepository.delete(id);
  }
}
