import { Controller, Post, Body, Query, Get, BadRequestException } from '@nestjs/common';
import { ClassService } from './class.service';
import { Class } from './class.entity';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('join/:email')
  async joinClass(
    @Body('email') email: string,
    @Body('classname') classname: string,
    @Body('cemail') cemail: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('phone_number') phone_number: string,
    @Body('tx_ref') tx_ref: string,
   
  ) {
    const checkclass = await this.classService.validateEmail(email);
    if (!checkclass) {
      throw new BadRequestException('User does not exist');
    }

    const userClass = await this.classService.joinClass(email, classname, cemail, first_name, last_name, phone_number, tx_ref);
    return { success: true, userClass };
  }

  @Get('getclass')
  findAll(): Promise<Class[]> {
    return this.classService.findAll();
  }

  @Get('checkStatus')
  async checkUserStatus(
    @Query('email') email: string,
    @Query('classname') classname: string,
): Promise<{ isPayed: boolean }> {
    return this.classService.checkClassStatus(email, classname);
  }

  @Get('search')
    async searchClass(@Body('classname') classname: string): Promise<Class[]> {
        return this.classService.findByName(classname);
    }
}