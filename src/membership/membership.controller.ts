import { Controller, Get, Delete, Post, Body, Put, Param } from '@nestjs/common';
import { MembershipsService } from './membership.service';
import { Membership } from './membership.entity';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post('addmembership')
  create(@Body() membership: Membership): Promise<Membership> {
    return this.membershipsService.create(membership);
  }

  @Get()
  findAll(): Promise<Membership[]> {
    return this.membershipsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() membership: Membership): Promise<Membership> {
    return this.membershipsService.update(id, membership);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.membershipsService.remove(+id);
  }
}
