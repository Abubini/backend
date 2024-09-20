import { Controller, Get, Delete, Param, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('postBlog')
  @UseInterceptors(FileInterceptor('bgPicture'))
  async create(@Body() body: Blog, @UploadedFile() file: Express.Multer.File): Promise<Blog> {
    const blog = new Blog();
    blog.title = body.title;
    blog.description = body.description;
    blog.bgPicture = file.filename; // Save the file path in the database

    return this.blogService.create(blog);
  }

  @Get()
  findAll(): Promise<Blog[]> {
    return this.blogService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.blogService.delete(id);
  }
}
