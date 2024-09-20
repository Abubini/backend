import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { UserService } from '../user/user.service'; // Assuming UserService exists
import { User } from '../user/user.entity';
import { Class } from './class.entity';
import { PaymentModule } from '../payment/payment.module';
import { CompanyModule } from '../company/company.module'; // Assuming CompanyModule exists

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Class]), // Importing entities for TypeORM
    PaymentModule, // Importing PaymentModule for payment-related services
    CompanyModule, // Importing CompanyModule for CompanyRepository
  ],
  providers: [ClassService, UserService],
  controllers: [ClassController],
})
export class ClassModule {}
