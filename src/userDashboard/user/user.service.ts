import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UserRepository } from "../../models/user/user.repository";
import { UserDocument } from "../../models/user/user.schema";
import { CreateUserDTO, RefreshTokenDTO, SignInDTO } from "./dto";
@Injectable()
export class UserService {
  constructor(private readonly userRepository : UserRepository , private readonly jwtService : JwtService) {}


    // signUp for user
    async signUp(createUserDTO : CreateUserDTO): Promise<{message : string}>{
      // check if user exist
      const userExist = await this.userRepository.getOne({ email : createUserDTO.email}) 
      // if exist throw error
      if(userExist) throw new BadRequestException("email already exist")
      // Hash password
      const hashPassword = await bcrypt.hash(createUserDTO.password,+process.env.SALT_ROUND)
      // make variable to add user 
      const user = await this.userRepository.create({...createUserDTO , password : hashPassword})as unknown as  UserDocument
      // send response
      return {message : "successfully signed up"}
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
      console.log('Stored refresh token:', user.refreshToken);
      console.log('Provided refresh token:', refresh_token);

      return {
        message: 'successfully signed in',
        access_token,
        refresh_token,
      };
    }

    // refresh token
    async refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<{ message: string; access_token: string; refresh_token: string }> {
      const { refresh_token } = refreshTokenDTO;
      // Verify the refresh token
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_SIGNATURE,
      });  
      // Retrieve the user using the token's payload
      const user = await this.userRepository.getOne({ _id: payload.id, refreshToken: refresh_token });
      // If user not found or refresh token is invalid
      if (!user) throw new UnauthorizedException('Invalid refresh token');
      // Generate new access token
      const access_token = this.jwtService.sign(
        { id: user._id, email: user.email },
        { secret: process.env.TOKEN_SIGNATURE, expiresIn: '15m' }
      );
      // Generate new refresh token
      const new_refresh_token = this.jwtService.sign(
        { id: user._id, email: user.email },
        { secret: process.env.REFRESH_TOKEN_SIGNATURE, expiresIn: '30d' }
      );
      // Update the user refresh token in the database
      await this.userRepository.update(user._id, { refreshToken: new_refresh_token }, { new: true, lean: true });
      // Return both tokens
      return {
        message: 'Token refreshed successfully',
        access_token,
        refresh_token: new_refresh_token,
      };
    }
    
    
  }

  
  
    