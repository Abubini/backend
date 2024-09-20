import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from '../user/user.entity';
import { Class } from './class.entity';
import { PaymentService } from '../payment/payment.service'; // Assuming PaymentService exists
import { Company } from 'src/company/company.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private readonly paymentService: PaymentService,
  ) {}

  findAll(): Promise<Class[]> {
    return this.classRepository.find();
  }

  async checkClassStatus(email: string, classname:string): Promise<{ isPayed: boolean }> {
    try {
      const user = await this.classRepository.findOne({ where: { email, classname } });

      if (!user) {
        throw new ConflictException('User not found.');
      }

      return { isPayed: user.isPayed };
    } catch (error) {
      throw new ConflictException(`Failed to check user status: ${error.message}`);
    }
  }

  async findByName(classname: string): Promise<Class[]> {
    return this.classRepository.find({ where: { classname } });
}

  async validateEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async joinClass(email: string, classname: string, cemail:string, first_name:string, last_name:string, phone_number:string, tx_ref:string): Promise<Class> {
    try {
      let amount: number;
    switch(classname){
      case 'yoga':
        amount = 100 
        break;
        case 'boxing':
          amount = 50 
          break;
        case 'aerobics':
          amount = 20 
          break;
        case 'karate':
          amount = 100 
          break;
        case 'aqua':
          amount = 50 
          break;
        case 'kickboxing':
          amount = 20 
          break;
        default:
          amount = 0;
    }
      const existingClass = await this.classRepository.findOne({ where: { email, classname } });
      
      if (existingClass) {
        if (existingClass.isPayed) {
          throw new ConflictException(`your registration for ${classname} class is not expired`);
        } else {
          const paymentSuccessful = await this.paymentService.processPayment({
            email: cemail,
            amount: amount,
            currency: 'ETB',
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            tx_ref: tx_ref,
            callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
            return_url: "https://www.google.com/",
          });
          existingClass.isPayed = true;
          existingClass.registrationTime = new Date();
          await this.classRepository.save(existingClass);
          
          if (paymentSuccessful) {
            
            return ;
    
  
    
          } else {
            throw new Error('Payment failed');
          }
          
        }
      }
      
    
    const paymentData = {
      email: 'bini.bg.bg@gmail.com',
      amount: amount, // amount in your currency
      currency: 'ETB',
    

      first_name: 'first_name',
      last_name: 'last_name',
      phone_number: 'phone_number',
      tx_ref: 'yujkhk,jhg',
      callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      return_url: "https://www.google.com/",
  
    // additional data required by Chapa
  };
  const newClass = new Class();
    newClass.email = email;
    newClass.classname = classname;
    newClass.registrationTime = new Date();
    newClass.isPayed = true;


    await this.classRepository.save(newClass);
  
  const paymentSuccessful = await this.paymentService.processPayment(paymentData);

  if (paymentSuccessful) {
    return ;
    
    
  } else {
    throw new Error('Payment failed');
  }


      
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // MySQL unique violation error code
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Cron('*/1 * * * *') 
  async updateIsPayedStatus(): Promise<void> {
    const twoDaysAgo = new Date();
    twoDaysAgo.setMinutes(twoDaysAgo.getMinutes() - 3);

    await this.classRepository.update(
      { registrationTime: LessThan(twoDaysAgo) },
      { isPayed: false }
    );
  }
}
