import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique : true})
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    nullable: true
  })
  companyName: string;

  @Column({
    nullable: true
  })
  membershipType: string;

  @Column({
    nullable: true
  })
  companyCode: string;

  @Column({ type: 'timestamp', default: null})
  registrationTime: Date;

  @Column({ default: false })
  isPayed: boolean;
}
