import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO, RefreshTokenDTO, SignInDTO } from './dto';
import { UserService } from './user.service';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  @UsePipes(ValidationPipe)
  async signUp(@Body() createUserDTO : CreateUserDTO){
    return await this.userService.signUp(createUserDTO)
  }

 @Post("signIn")
 @UsePipes(ValidationPipe)
 async signIn(@Body() signInDTO : SignInDTO){
  return this.userService.signIn(signInDTO)
 }

 @Post('refresh-token')
 async refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO) {
   return this.userService.refreshToken(refreshTokenDTO);
 }

  
}
