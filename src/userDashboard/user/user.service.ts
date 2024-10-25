

import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException, Req, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { CreateResponse, DeleteResponse, GetAllResponse, GetOneResponse, UpdateResponse } from "src/common/dto/response.dto";
import { UserRepository } from "src/models/user/user.repository";
import { User, UserDocument } from "src/models/user/user.schema";
import { CreateUserDTO, SignInDTO} from "./dto";
@Injectable()
export class UserService {
  constructor(private readonly userRepository : UserRepository , private readonly jwtService : JwtService) {}


    // signUp for user
    async signUp(createUserDTO : CreateUserDTO): Promise<CreateResponse<User>>{
      // check if user exist
      const userExist = await this.userRepository.getOne({ email : createUserDTO.email}) 
      // if exist throw error
      if(userExist) throw new BadRequestException("email already exist")
      // Hash password
      const hashPassword = await bcrypt.hash(createUserDTO.password,+process.env.SALT_ROUND)
      // make variable to add user 
      const user = await this.userRepository.create({...createUserDTO , password : hashPassword})as unknown as  UserDocument
      // send response
      return {success : true , data : user}
    }

    
     // signIn for user
     async signIn(signInDTO: SignInDTO): Promise<{ message: string; access_token: string; refresh_token: string }> {
      // check if user exists
      const user = await this.userRepository.getOne({ email: signInDTO.email });
      // if user not found
      if (!user) throw new NotFoundException('User not found');
      // Verify the password
      const passwordValid = await bcrypt.compare(signInDTO.password, user.password);
      // check valid password 
      if (!passwordValid) throw new UnauthorizedException('Invalid credentials');
      // Generate access token
      const access_token = this.jwtService.sign(
        { id: user._id, email: user.email },
        { secret: process.env.TOKEN_SIGNATURE, expiresIn: '15m' } 
      );
      // Generate refresh token
      const refresh_token = this.jwtService.sign(
        { id: user._id, email: user.email },
        { secret: process.env.REFRESH_TOKEN_SIGNATURE, expiresIn: '30d' }  
      );
      //  store refresh token in the database
      await this.userRepository.update(user._id, { refreshToken: refresh_token },{new : true , lean : true});
      // Return both tokens
      return {
        message: 'User successfully signed in',
        access_token,
        refresh_token,
      };
    }
    
  }

  
  
    