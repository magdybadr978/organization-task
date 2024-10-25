import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './Guards/Authorization';
import { UserDashboardModule } from './userDashboard/userDashboard.modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal : true ,envFilePath : './src/config/.env'}),
    MongooseModule.forRoot(process.env.DB_URL),
    UserDashboardModule
  ],
  controllers: [],
  providers: [{ provide : APP_GUARD , useClass : RolesGuard}],
})
export class AppModule {}
