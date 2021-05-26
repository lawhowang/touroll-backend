import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException, BadRequestException, NotFoundException, ForbiddenException, Query } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/casl-policy.decorator';
import { PoliciesGuard } from 'src/casl/casl-policy.guard';
import { Action } from 'src/casl/action.enum';
import { Tour } from './entities/tour.entity';
import { AuthGuard, SetAuthGuardOptional } from 'src/auth/auth.guard';
import { Me } from 'src/users/users.decorator';
import { ReservationsService } from 'src/reservations/reservations.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { NearbyTourDto } from './dto/nearby-tour.dto';
import { Pagination } from 'src/types/pagination';
import { extractFields } from 'src/utils/fields';
import { Expansion } from 'src/types/expansion';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService,
    private readonly reservationsService: ReservationsService,
    private readonly activitiesService: ActivitiesService,
    private readonly caslAbilityFactory: CaslAbilityFactory) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTourDto: CreateTourDto, @Me() user) {
    createTourDto.organizerId = user.id
    return this.toursService.create(createTourDto);
  }

  // @Get()
  // findAll() {
  //   return this.toursService.findAll();
  // }
  @Get('nearby')
  findNearbyTours(@Query() nearbyTourDto: NearbyTourDto, @Pagination(extractFields(() => Tour, ['id', 'startDate', 'price'])) pageInfo) {
    return this.toursService.findByCoordinates(nearbyTourDto, pageInfo)
  }

  @Get('most-viewed')
  findMostViewedTours() {
    return this.toursService.findMostViewed()
  }

  @Get('search')
  search(@Query('query') query = '', @Pagination(extractFields(() => Tour, ['id', 'startDate', 'price'])) pageInfo) {
    return this.toursService.search(query, pageInfo)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @SetAuthGuardOptional()
  async findOne(@Param('id') id: number, @Me() user, @Expansion(extractFields(() => Tour, ['activities', 'organizer'])) expand) {
    const tour = await this.toursService.findOne(id)
    if (!tour) throw new NotFoundException()
    //const ability = this.caslAbilityFactory.createForUser(user);
    //if (!tour.published && ability.cannot(Action.Read, tour)) throw new ForbiddenException()
    this.toursService.addView(id)
    return this.toursService.findOne(id, expand);
  }

  @Get(':id/reservations')
  async findTourReservations(@Param('id') id: number) {
    return this.reservationsService.findByTour(id)
  }

  @Get(':id/activities')
  async findTourActivities(@Param('id') id: number) {
    return this.activitiesService.findByTour(id)
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateTourDto: UpdateTourDto, @Me() user) {
    updateTourDto.organizerId = user.id
    const tour = await this.toursService.findOne(id)
    if (!tour) throw new NotFoundException()
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Update, tour)) {
      return await this.toursService.update(id, updateTourDto)
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Me() user) {
    const tour = await this.toursService.findOne(id)
    if (!tour) throw new NotFoundException()

    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Delete, tour)) {
      await this.toursService.remove(id);
      return true
    } else {
      throw new UnauthorizedException();
    }
  }
}
