import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes} from './classes.entity';
import { classesService } from './classes.service';
import { classesController } from './classes.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classes]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [classesService],
  controllers: [classesController],
})
export class classesModule {}
