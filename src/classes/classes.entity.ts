import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  schedules: string[];

  @Column()
  cost: number;

  @Column()
  picture: string;
}
