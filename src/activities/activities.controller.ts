import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Action } from 'src/casl/action.enum';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ToursService } from 'src/tours/tours.service';
import { Me } from 'src/users/users.decorator';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly toursService: ToursService,
    private readonly caslAbilityFactory: CaslAbilityFactory) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createActivityDto: CreateActivityDto, @Me() user) {
    const tour = await this.toursService.findOne(+createActivityDto.tourId)
    if (!tour) {
      throw new NotFoundException()
    }
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.cannot(Action.Update, tour)) {
      throw new UnauthorizedException()
    }
    const result = await this.activitiesService.create(createActivityDto);
    if (!result) {
      throw new BadRequestException()
    }
    return result
  }

  // @Get()
  // findAll() {
  //   return this.activitiesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.activitiesService.findOne(id);
  // }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateActivityDto: UpdateActivityDto, @Me() user) {
    const activity = await this.activitiesService.findOne(id)
    if (!activity) {
      throw new NotFoundException()
    }
    const tour = await this.toursService.findOne(+activity.tourId)
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.cannot(Action.Update, tour)) {
      //throw new UnauthorizedException()
    }
    const result = await this.activitiesService.update(id, updateActivityDto);
    if (!result) {
      throw new BadRequestException()
    }
    return result
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.activitiesService.remove(id);
  }
}
