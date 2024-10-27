import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  access_level : string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refreshToken : string
}



export class RefreshTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}


export class SignInDTO extends PartialType(CreateUserDTO) {}
export class UpdateUserDTO extends PartialType(CreateUserDTO) {}


