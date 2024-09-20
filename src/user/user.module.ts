import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Company } from 'src/company/company.entity';
import { PaymentModule } from '../payment/payment.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company]),
            AuthModule,
            PaymentModule,],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
