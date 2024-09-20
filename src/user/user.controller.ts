import { Controller,Get, Query, Post, UseGuards,Request, Body, ValidationPipe,BadRequestException, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private UserService: UserService,
    @InjectRepository(Company)
    private readonly companyCodeRepository: Repository<Company>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('account')
  async getAccount(@Request() req) {
    return this.UserService.findOneById(req.user.userId);
  }

  @Get('getusers')
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('checkStatus')
  async checkUserStatus(@Query('email') email: string): Promise<{ isPayed: boolean }> {
    return this.userService.checkUserStatusByEmail(email);
  }


  @Post('signup')
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, username, email, password, companyCode } = createUserDto;
   
    let companyname = '';
    let membershiptype = '';
    let companycode = '';
    let registrationTime: Date;
    let isPayed: boolean;
    

    if (companyCode) {
      // Validate the company code
      const company = await this.userService.validateCompanyCode(companyCode);
      if (!company) {
        throw new BadRequestException('Invalid company code');
      }
      if (company.numberOfPeople <= company.activeMembers) {
        throw new BadRequestException('User limit for this company code has been reached');
      }

      company.activeMembers += 1;
    await this.companyCodeRepository.save(company);

      companyname = company.name;
      membershiptype = company.plan;
      companycode = company.companyCode;
      registrationTime = company.registrationTime;
      isPayed = company.isPayed;
      

    }

    // Create user
    const user = await this.userService.create({
      firstName,
      lastName,
      username,
      email,
      password,
      companyname,
      membershiptype,
      companycode,
      registrationTime,
      isPayed
    });

    

    return user;
  }

  @Put('buymembership/:email')
  async updateMembership(
    @Param('email') email: string,
    @Body('membershiptype') membershiptype: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('cemail') cemail: string,
    @Body('phone_number') phone_number: string,
    @Body('tx_ref') tx_ref: string,
    
  ): Promise<User> {
    return this.userService.updateMembershipType(email, membershiptype, first_name, last_name, phone_number, tx_ref, cemail );
  }


  @Put('changepassword/:email')
async changepassword(
    @Param('email') email: string,
    @Body('password') password: string,
): Promise<{ success: boolean, message: string, user?: User }> {
    try {
        const user = await this.userService.changePassword(email, password);
        return { success: true, message: 'Password changed successfully', user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
}


