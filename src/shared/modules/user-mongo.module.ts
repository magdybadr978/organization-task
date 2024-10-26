import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, personSchema } from '../../models/common/person.schema';
import { UserRepository } from '../../models/user/user.repository';
import { User, userSchema } from '../../models/user/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Person.name,
        schema: personSchema,
        discriminators: [
          { name: User.name, schema: userSchema },
        ],
      },
    ]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserMongoModule {}
