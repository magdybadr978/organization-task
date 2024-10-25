import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Document, Model } from 'mongoose';
import { Organization } from './organization.schema';

export class OrganizationRepository extends AbstractRepository<Organization> {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<Organization & Document>,
  ) {
    super(organizationModel);
  }
}
