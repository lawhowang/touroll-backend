import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import admin from '../firebase';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) {
    //console.log('token: ' + this.generateToken(1))
  }

  generateToken(userId: number): string {
    try {
      const token = jwt.sign({ id: userId }, 'vx29uiy6qaBMT3dmSTpLv14UHWW9JjOC', { expiresIn: '2d' });
      return token
    } catch {
      return null
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decodedToken = jwt.verify(token, 'vx29uiy6qaBMT3dmSTpLv14UHWW9JjOC');
      console.log(decodedToken)
      const id = (decodedToken as any).id
      let user = await this.usersService.findOne(id)
      return user
    } catch {
      return null
    }
  }

  async validateFirebaseToken(token: string): Promise<User> {
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(token.split(" ")[1])
      const uid = decodedIdToken.uid
      let user = await this.usersService.findOneByFirebaseUid(uid)
      if (!user) {
        user = await this.usersService.insertNewUser(uid)
      }
      return user
    } catch {
      return null
    }
  }
}
