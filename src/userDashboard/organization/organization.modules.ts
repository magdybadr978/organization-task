import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/Guards/auth.service';
import { RolesGuard } from 'src/Guards/Authorization';
import { OrganizationRepository } from 'src/models/organization/organization.repository';
import { Organization, organizationSchema } from 'src/models/organization/organization.schema';
import { UserMongoModule } from 'src/shared/modules/user-mongo.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [ MongooseModule.forFeature([{ name : Organization.name ,schema : organizationSchema}]),UserMongoModule],
  controllers: [OrganizationController],
  providers: [OrganizationService,OrganizationRepository,AuthService,JwtService,RolesGuard],
  exports: [OrganizationService , OrganizationRepository],
})
export class OrganizationModule {}
