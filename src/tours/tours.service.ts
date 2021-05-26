import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInfo } from 'src/types/pagination';
import { UploadsService } from 'src/uploads/uploads.service';
import { paginate } from 'src/utils/pagination';
import { IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { CreateTourDto } from './dto/create-tour.dto';
import { NearbyTourDto } from './dto/nearby-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Tour } from './entities/tour.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly toursRepository: Repository<Tour>,
    private readonly uploadsService: UploadsService
  ) { }

  async create(createTourDto: CreateTourDto) {
    console.log(createTourDto);
    const tour = await this.toursRepository.save(createTourDto)
    if (tour.coverImage) {
      const newId = await this.uploadsService.confirmFile(tour.coverImage, 'tours/covers/', `${tour.id}_`);
      await this.toursRepository.update(tour.id, { coverImage: newId })
      tour.coverImage = newId
    }
    return tour
  }

  findAll() {
    return `This action returns all tours`;
  }

  findByCoordinates(nearbyTourDto: NearbyTourDto, pageInfo: PageInfo) {
    return paginate(this.toursRepository, pageInfo, (q) => {
      return q.where({ published: true, location: Not(IsNull()) })
        .orderBy("ST_Distance(location, ST_GeomFromGeoJSON(:origin))", "ASC")
        .setParameters({ origin: JSON.stringify({ type: 'Point', coordinates: [nearbyTourDto.lat, nearbyTourDto.lon] }) })
    })
    return this.toursRepository
      .createQueryBuilder()
      .where({ published: true, location: Not(IsNull()) })
      .orderBy("ST_Distance(location, ST_GeomFromGeoJSON(:origin))", "ASC")
      .setParameters({ origin: JSON.stringify({ type: 'Point', coordinates: [nearbyTourDto.lat, nearbyTourDto.lon] }) })
      .take(10)
      .getMany()
  }

  findMostViewed() {
    return this.toursRepository.find({
      where: {
        published: true
      },
      order: {
        views: 'DESC'
      },
      take: 10
    })
  }

  search(query: string, pageInfo: PageInfo) {
    //https://stackoverflow.com/questions/59849262/postgresql-full-text-search-with-typeorm
    const formattedQuery = query.trim().replace(/ /g, ' & ').replace(/([!$()*+.:<=>?[\\\]^{|}-])/g, ' ').trim();
    return paginate(this.toursRepository, pageInfo, (q) => {
      if (formattedQuery.length == 0) return q;
      return q.where(
        `to_tsvector('simple', title) @@ to_tsquery('simple', :query)`,
        { query: `${formattedQuery}:*` }
      )
    })
  }

  findByOrganizer(organizerId: number, pageInfo: PageInfo) {
    return paginate(this.toursRepository, pageInfo, { organizerId });
  }

  findOne(id: number, expand?: string[]) {
    let q = this.toursRepository
      .createQueryBuilder()
      .where({ id })
    if (Array.isArray(expand)) {
      for (const relation of expand) {
        if (relation == 'activities') {
          q.orderBy('activities.time', 'ASC')
        }
        q = q.leftJoinAndSelect(`Tour.${relation}`, relation);
      }
    }
    return q.getOne()
  }

  async update(id: number, updateTourDto: UpdateTourDto): Promise<Tour> {
    if (updateTourDto.coverImage) {
      try {
        const newId = await this.uploadsService.confirmFile(updateTourDto.coverImage, 'tours/covers/', `${id}_`);
        updateTourDto.coverImage = newId
      } catch (ex) {
        delete updateTourDto.coverImage
      }
    }
    await this.toursRepository.update(id, updateTourDto);
    const tour = await this.findOne(id);
    return tour
  }

  addView(id: number) {
    return this.toursRepository.update(id, {
      views: () => "views + 1"
    })
  }

  remove(id: number) {
    return this.toursRepository.delete(id);
  }
}
