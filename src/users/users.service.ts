import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateMeDto } from './dto/update-me.dto';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private uploadsService: UploadsService
  ) { }

  // async create({ email, password }: CreateUserDto) {
  //   const hash = await bcrypt.hash(password, 16)
  //   const { password: pwd, ...result } = await this.usersRepository.save({
  //     password: hash
  //   })
  //   return result
  // }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id)
  }

  findOneByFirebaseUid(uid: string) {
    return this.usersRepository.findOne({
      firebaseUid: uid
    })
  }

  insertNewUser(uid: string) {
    const user = new User()
    user.firebaseUid = uid
    user.name = uid.substr(0,5);
    return this.usersRepository.save(user)
  }

  // async findOneByEmail(email: string): Promise<User | undefined> {
  //   return this.usersRepository.findOne({ email })
  // }

  async update(id: number, updateUserDto: UpdateUserDto | UpdateMeDto) : Promise<User> {
    if (updateUserDto.icon) {
      const newId = await this.uploadsService.confirmFile(updateUserDto.icon, 'users/icons/', `${id}_`);
      updateUserDto.icon = newId
    }
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findOne(id);
    return user
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
