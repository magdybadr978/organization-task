import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateResponse, DeleteResponse, GetAllResponse, GetOneResponse, UpdateResponse } from "src/common/dto/response.dto";
import { OrganizationRepository } from "src/models/organization/organization.repository";
import { Organization, OrganizationDocument } from "src/models/organization/organization.schema";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "./dto";
import { Types } from "mongoose";
import { UserRepository } from "src/models/user/user.repository";
import { UpdateUserDTO } from "../user/dto";
import { UserDocument } from "src/models/user/user.schema";


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
    const organization = await (await this.organizationRepository.getOne({ _id : new Types.ObjectId(id)})).populate({ path : 'organization_members' , select : 'name email access_level'})
    // failed
    if(!organization) throw new NotFoundException("organization not found")
    //send response
    return { success : true , data : organization}
  }

  // get all organizations
  async getAllOrganizations():Promise<GetAllResponse<Organization>>{
    // use getall method 
    const organizations = await this.organizationRepository.getAll({})
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


    // invite organization
    async inviteOrganization(organizationId : string ,updateUserDTO : UpdateUserDTO):Promise<{message : string}>{
      // check if organization exits
      const organization = await this.organizationRepository.getOne({_id : new Types.ObjectId(organizationId)})
      //failed
      if(!organization) throw new NotFoundException("organization not found")
        //check if user exist by email
      const user = await this.userRepository.getOne({email : updateUserDTO.email}) as unknown as Types.ObjectId
      //failed
      if(!user) throw new NotFoundException("user not found")
        // check if this user is already in organization
      if(organization.organization_members.includes(user._id)){
        throw new NotFoundException("user already exist in this organization")
      }
      // add user to organization_members array
      organization.organization_members.push(user._id);
      // save in database
      await organization.save()
      //return response
      return { message : "User invited successfully"}
    }


}