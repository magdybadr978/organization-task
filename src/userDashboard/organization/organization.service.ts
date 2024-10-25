import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { DeleteResponse, GetAllResponse, GetOneResponse, UpdateResponse } from "src/common/dto/response.dto";
import { OrganizationRepository } from "src/models/organization/organization.repository";
import { Organization, OrganizationDocument } from "src/models/organization/organization.schema";
import { UserRepository } from "src/models/user/user.repository";
import { UpdateUserDTO } from "../user/dto";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "./dto";


@Injectable()
export class OrganizationService{
  constructor(private readonly organizationRepository : OrganizationRepository, private readonly userRepository : UserRepository) {}

  // create organization 
  async createOrganization(createOrganizationDTO : CreateOrganizationDTO):Promise<{organization_id : string}>{
    // create organization
    const org = await this.organizationRepository.create(createOrganizationDTO) as OrganizationDocument;
    // failed
    if(!org) throw new BadGatewayException("failed to create organization")
      // send response
    return { organization_id : org._id.toString()}
  }
// get specific organization
  async getOrganization(id : string):Promise<GetOneResponse<Organization>>{
    // check if organization exist
    const organization = await this.organizationRepository.getOne({ _id : new Types.ObjectId(id)})
    // failed
    if(!organization) throw new NotFoundException("organization not found")
      // // Populate organization members
    const populatedOrganization = await organization.populate({
      path: 'organization_members',
      select: 'name email access_level'
  });
    //send response
    return { success : true , data : populatedOrganization}
  }

  // get all organizations
  async getAllOrganizations():Promise<GetAllResponse<Organization>>{
    // use getall method 
    const organizations = await this.organizationRepository.getAll({},{} ,{ populate:{ path: 'organization_members', select: 'name email access_level'} })
    //faild
    if(organizations.length == 0) throw new NotFoundException("there is no organizations")
    //send response
    return { success : true , data : organizations}
  }

  // update organization 
  async updateOrganization(id : string ,updateOrganizationDTO : UpdateOrganizationDTO):Promise<UpdateResponse<Organization>>{
  // check if organization exist 
  const organization = await this.organizationRepository.getOne({ _id : new Types.ObjectId(id)})
  // failed
  if(!organization) throw new NotFoundException("organization not found")
    // update organization
  const updated = await this.organizationRepository.update({_id : new Types.ObjectId(id)},updateOrganizationDTO ,{new : true , lean : true})
    //return response
    return { success : true , data : updated}
  }

  // delete organization 
  async deleteOrganization(id : string):Promise<DeleteResponse>{
    // check if organization exist 
    const organization = await this.organizationRepository.getOne({ _id : new Types.ObjectId(id)})
    // failed
    if(!organization) throw new NotFoundException("organization not found")
      // delete organization
     await this.organizationRepository.delete({_id : new Types.ObjectId(id)})
      //return response
      return { success : true}
    }


    // invite user
    async inviteUser(organizationId : string ,updateUserDTO : UpdateUserDTO):Promise<{message : string}>{
      // check if organization exits
      const organization = await this.organizationRepository.getOne({_id : new Types.ObjectId(organizationId)})
      //failed
      if(!organization) throw new NotFoundException("organization not found")
        //check if user exist by email
      const user = await this.userRepository.getOne({email : updateUserDTO.email})
      //failed
      if(!user) throw new NotFoundException("user not found")
        // check if this user is already in organization
      if (organization.organization_members.some(memberId => memberId.toString() == user._id.toString())) {
        throw new NotFoundException("User already exists in this organization");
    }
      // add user to organization_members array
      organization.organization_members.push(user._id as Types.ObjectId) ;
      // save in database
      await organization.save()
      //return response
      return { message : "User invited successfully"}
    }


}