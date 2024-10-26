import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "./dto";
import { UpdateUserDTO } from "../user/dto";
import { AuthGuard } from "src/Guards/Authentication";


@Controller('organization')
export class OrganizationController{
  constructor(private readonly organizationService : OrganizationService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createOrganization(@Body() createOrganizationDTO : CreateOrganizationDTO){
    return await this.organizationService.createOrganization(createOrganizationDTO)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrganization(@Param('id') id :string){
    return await this.organizationService.getOrganization(id)
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllOrganizations(){
    return await this.organizationService.getAllOrganizations();
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateOrganization(@Param('id') id : string , @Body() updateOrganizationDTO : UpdateOrganizationDTO){
    return this.organizationService.updateOrganization(id , updateOrganizationDTO);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOrganization(@Param('id') id : string){
     return this.organizationService.deleteOrganization(id)
  }

  @Post(':organizationId/invite')
  @UseGuards(AuthGuard)
  async inviteUser(@Param('organizationId') organizationId : string,@Body() updateUserDTO : UpdateUserDTO){
    return this.organizationService.inviteUser(organizationId , updateUserDTO )
  }
}