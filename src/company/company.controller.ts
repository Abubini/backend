import { Controller, Post, Body, Get } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './create-company.dto';
import { Company } from './company.entity';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('updatecompany')
  async updateCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('email') email: string,
    @Body('phone_number') phone_number: string,
    @Body('tx_ref') tx_ref: string,
    @Body('companyCode') companyCode: string,
  ) {
    try {
      const updateSecces = await this.companyService.updateCompany(createCompanyDto,companyCode, first_name, last_name, email, phone_number, tx_ref);
      return { success: true, updateSecces };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  


  @Post('register')
  async registerCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('email') email: string,
    @Body('phone_number') phone_number: string,
    @Body('tx_ref') tx_ref: string,
    
  ) {
    try {
      const companyCode = await this.companyService.registerCompany(createCompanyDto, first_name, last_name, email, phone_number, tx_ref);
      return { success: true, companyCode };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('getCompany')
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
}
}
