import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "./dto";
import { UpdateUserDTO } from "../user/dto";


@Controller('organization')
export class OrganizationController{
  constructor(private readonly organizationService : OrganizationService) {}

  @Post('create')
  async createOrganization(@Body() createOrganizationDTO : CreateOrganizationDTO){
    return await this.organizationService.createOrganization(createOrganizationDTO)
  }

  @Get(':id')
  async getOrganization(@Param('id') id :string){
    return await this.organizationService.getOrganization(id)
  }

  @Get()
  async getAllOrganizations(){
    return await this.organizationService.getAllOrganizations();
  }

  @Put(':id')
  async updateOrganization(@Param('id') id : string , @Body() updateOrganizationDTO : UpdateOrganizationDTO){
    return this.organizationService.updateOrganization(id , updateOrganizationDTO);
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id : string){
     return this.organizationService.deleteOrganization(id)
  }

  @Post(':organizationId/invite')
  async inviteUser(@Param('organizationId') organizationId : string,@Body() updateUserDTO : UpdateUserDTO){
    return this.organizationService.inviteUser(organizationId , updateUserDTO)
  }
}