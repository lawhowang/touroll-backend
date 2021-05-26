import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Me } from 'src/users/users.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Expansion } from 'src/types/expansion';
import { extractFields } from 'src/utils/fields';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createReservationDto: CreateReservationDto, @Me() user) {
    createReservationDto.userId = user.id
    const result = await this.reservationsService.create(createReservationDto);
    if (!result) {
      throw new BadRequestException()
    }
    return result
  }

  // @Get()
  // findAll() {
  //   return this.reservationsService.findAll();
  // }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number, @Expansion(extractFields(() => Reservation, ['tour'])) expansion) {
    return this.reservationsService.findOne(id, expansion);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
  //   return this.reservationsService.update(id, updateReservationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservationsService.remove(id);
  // }
}
