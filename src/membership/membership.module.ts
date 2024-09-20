import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { MembershipsService } from './membership.service';
import { MembershipsController } from './membership.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  providers: [MembershipsService],
  controllers: [MembershipsController],
})
export class MembershipsModule {}
