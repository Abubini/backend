import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
