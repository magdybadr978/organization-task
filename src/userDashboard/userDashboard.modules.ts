import { Module } from '@nestjs/common';
import { UserModule } from './user/user.modules';
import { OrganizationModule } from './organization/organization.modules';


@Module({
  imports: [UserModule, OrganizationModule],
  controllers: [],
  providers: [],
})
export class UserDashboardModule {}
