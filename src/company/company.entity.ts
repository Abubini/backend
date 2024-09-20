import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  companyCode: string;

  @Column()
  numberOfPeople: number;

  @Column({ default: 0 })
  activeMembers: number;

  @Column()
  plan: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationTime: Date;

  @Column({ default: true })
  isPayed: boolean;
}
