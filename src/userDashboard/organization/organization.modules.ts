import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/Guards/Auth.service';
import { RolesGuard } from 'src/Guards/Authorization';
import { Organization, organizationSchema } from 'src/models/organization/organization.schema';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrganizationRepository } from 'src/models/organization/organization.repository';
import { UserMongoModule } from 'src/shared/modules/user-mongo.module';

@Module({
  imports: [ MongooseModule.forFeature([{ name : Organization.name ,schema : organizationSchema}]) , OrganizationModule,UserMongoModule],
  controllers: [OrganizationController],
  providers: [OrganizationService,OrganizationRepository,AuthService,JwtService,RolesGuard],
  exports: [OrganizationService , OrganizationRepository],
})
export class OrganizationModule {}
