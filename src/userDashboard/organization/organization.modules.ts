import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../Guards/auth.service';
import { RolesGuard } from '../../Guards/Authorization';
import { OrganizationRepository } from '../..//models/organization/organization.repository';
import { Organization, organizationSchema } from '../..//models/organization/organization.schema';
import { UserMongoModule } from '../../shared/modules/user-mongo.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [ MongooseModule.forFeature([{ name : Organization.name ,schema : organizationSchema}]),UserMongoModule],
  controllers: [OrganizationController],
  providers: [OrganizationService,OrganizationRepository,AuthService,JwtService,RolesGuard],
  exports: [OrganizationService , OrganizationRepository],
})
export class OrganizationModule {}
