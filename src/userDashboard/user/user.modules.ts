import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Guards/Auth.service';
import { RolesGuard } from 'src/Guards/Authorization';
import { UserMongoModule } from 'src/shared/modules/user-mongo.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UserMongoModule,
  ],
  controllers: [UserController],
  providers: [UserService,AuthService,JwtService,RolesGuard],
  exports: [UserService],
})
export class UserModule {}
