import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../Guards/auth.service';
import { RolesGuard } from '../../Guards/Authorization';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMongoModule } from '../../shared/modules/user-mongo.module';

@Module({
  imports: [
    UserMongoModule,
  ],
  controllers: [UserController],
  providers: [UserService,AuthService,JwtService,RolesGuard],
  exports: [UserService],
})
export class UserModule {}
