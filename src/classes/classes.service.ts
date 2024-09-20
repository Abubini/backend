import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classes } from './classes.entity';

@Injectable()
export class classesService {
  constructor(
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
  ) {}

  create(classes: Classes): Promise<Classes> {
    return this.classesRepository.save(classes);
  }

  findAll(): Promise<Classes[]> {
    return this.classesRepository.find();
  }

  async update(id: number, classes: Classes): Promise<Classes> {
    await this.classesRepository.update(id, classes);
    return this.classesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.classesRepository.delete(id);
  }
}


