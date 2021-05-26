import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Optional } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChatService } from 'src/chat/chat.service';
import { UseGuards } from '@nestjs/common';
import { Me } from './users.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ToursService } from 'src/tours/tours.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Pagination } from 'src/types/pagination';
import { Tour } from 'src/tours/entities/tour.entity';
import { User } from './entities/user.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { UpdateMeDto } from './dto/update-me.dto';
import { extractFields } from 'src/utils/fields';
import { Expansion } from 'src/types/expansion';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
    private readonly toursService: ToursService,
    private readonly reservationsService: ReservationsService
  ) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Me() user) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateMe(
    @Body() updateMeDto: UpdateMeDto,
    @Me() me: User
  ) {
    return await this.usersService.update(me.id, updateMeDto);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }

  @UseGuards(AuthGuard)
  @Get('me/tours')
  myTours(
    @Me() user,
    @Pagination(extractFields(() => Tour, ['id', 'startDate'])) pageInfo,
  ) {
    return this.toursService.findByOrganizer(user.id, pageInfo)
  }

  @UseGuards(AuthGuard)
  @Get('me/reservations')
  myReservations(
    @Me() user,
    @Pagination(extractFields(() => Reservation, ['id', 'startDate'])) pageInfo,
    @Expansion(extractFields(() => Reservation, ['tour'])) expansion
  ) {
    return this.reservationsService.findByUser(user.id, pageInfo, expansion)
  }
}
