import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PaymentModule } from './payment/payment.module';
import { EmailModule } from './email/email.module';
import { Company } from './company/company.entity';
import { Class } from './class/class.entity';
import { CompanyModule } from './company/company.module';
import { ContactEmailModule } from './conatct-email/contact-email.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { ClassModule } from './class/class.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Blog } from './blog/blog.entity';

import { BlogModule } from './blog/blog.module';
import { MembershipsModule } from './membership/membership.module';
import { Membership } from './membership/membership.entity';
import { classesModule } from './classes/classes.module';
import {  Classes } from './classes/classes.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Company,Class, Blog, Membership, Classes],
        synchronize: true, // set to false in production
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'AAiT@webproject.gym'),
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, Company, Class, Blog, Membership, Classes]),
    CompanyModule,
    UserModule,
    AuthModule,
    
    PaymentModule,
    EmailModule,
    ClassModule,
    
      
    ContactEmailModule,
    BlogModule,
    MembershipsModule,
    
    classesModule,
    
      
    
      
    
    
  ],
  controllers: [AuthController,],
    providers: [AuthService, JwtService],
})
export class AppModule {}

