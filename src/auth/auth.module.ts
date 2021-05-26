import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [
    UsersModule
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
