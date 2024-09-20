import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  create(membership: Membership): Promise<Membership> {
    return this.membershipsRepository.save(membership);
  }

  findAll(): Promise<Membership[]> {
    return this.membershipsRepository.find();
  }

  async update(id: number, membership: Membership): Promise<Membership> {
    await this.membershipsRepository.update(id, membership);
    return this.membershipsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.membershipsRepository.delete(id);
  }
}
