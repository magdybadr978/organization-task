import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrganizationDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description : string;

  @ApiProperty()
  @IsOptional()
  organization_members : Types.ObjectId[];
}

export class UpdateOrganizationDTO extends PartialType(CreateOrganizationDTO) {}




