import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../abstract.repository';
import { User } from './user.schema';
import { Document, Model } from 'mongoose';

export class UserRepository extends AbstractRepository<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User & Document>,
  ) {
    super(userModel);
  }
}
