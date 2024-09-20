import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PaymentModule } from '../payment/payment.module';
import { EmailModule } from '../email/email.module';
import { UserModule } from 'src/user/user.module';
import { User } from '../user/user.entity';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    PaymentModule,
    EmailModule,
    UserModule,
  ],
  providers: [CompanyService ],
  controllers: [CompanyController],
  exports: [CompanyService, TypeOrmModule],
  
})
export class CompanyModule {}
