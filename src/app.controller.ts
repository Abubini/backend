import { Controller, Post, Body, Get,Res, Render } from '@nestjs/common';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/create-user.dto';
import { User } from './user/user.entity';
import { CompanyService } from './company/company.service';
import { ClassService } from './class/class.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly classService: ClassService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }


  @Get('admin')
  getAdminPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'views', 'admin.html'));
  }
}

