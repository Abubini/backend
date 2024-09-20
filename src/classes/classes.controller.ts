import { Controller, Post, Get, Put, Param, Delete,  Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { classesService } from './classes.service';
import { Classes } from './classes.entity';

@Controller('classes')
export class classesController {
  constructor(private readonly classesService: classesService) {}

  @Post('postClass')
  @UseInterceptors(FileInterceptor('picture'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { name, description, schedules, cost } = body;
    const classes = new Classes();
    classes.name = name;
    classes.description = description;
    classes.schedules = schedules.split(',').map((item) => item.trim());
    classes.cost = cost;
    classes.picture = file.filename;

    return await this.classesService.create(classes);
  }

  @Get('getClass')
  findAll(): Promise<Classes[]> {
    return this.classesService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() classes: Classes): Promise<Classes> {
    return this.classesService.update(id, classes);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.classesService.remove(+id);
  }
}
