import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { Company } from '../company/company.entity';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly paymentService: PaymentService,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async validateCompanyCode(companyCode: string): Promise<Company> {
    return await this.companyRepository.findOne({ where: { companyCode } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async checkUserStatusByEmail(email: string): Promise<{ isPayed: boolean }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new ConflictException('User not found.');
      }

      return { isPayed: user.isPayed };
    } catch (error) {
      throw new ConflictException(`Failed to check user status: ${error.message}`);
    }
  }

  async create(createUserDto: Partial<CreateUserDto & { companyname: string, membershiptype: string, companycode:string,registrationTime: Date, isPayed: boolean; }>): Promise<User> {
    const { companyname, membershiptype,companycode,registrationTime,isPayed, ...userDetails } = createUserDto;
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);
    const user = new User();
    user.firstName = userDetails.firstName;
    user.lastName = userDetails.lastName;
  
    user.username = userDetails.username;
    user.email = userDetails.email;
    user.password = hashedPassword;
    if (companyname) {
      user.companyName = companyname;
    }

    if (membershiptype) {
      user.membershipType = membershiptype;
    }
    if (companycode) {
      user.companyCode = companycode;
    }
    if (registrationTime) {
      user.registrationTime = registrationTime;
    }
    if (isPayed) {
      user.isPayed = isPayed;
    }
    


    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') { // MySQL unique violation error code
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async changePassword(email: string, password:string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  async updateMembershipType(email: string, newMembershipType: string, first_name:string, last_name:string, phone_number:string, tx_ref:string, cemail:string): Promise<User> {
    let amount: number;
    switch(newMembershipType){
      case 'gold':
        amount = 100 
        break;
        case 'silver':
          amount = 50 
          break;
        case 'normal':
          amount = 20 
          break;
        default:
          amount = 0;
    }
    
    const paymentData = {
      email: cemail,
      amount: amount, // amount in your currency
      currency: 'ETB',
    

      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      tx_ref: tx_ref,
      callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      return_url: "https://www.google.com/",
  
    // additional data required by Chapa
  };
  const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.companyCode){
      throw new ConflictException(`you are sponsered by a ${user.companyName}. can not change a membership type` )
    }

    if (user.isPayed){
      throw new ConflictException(`your ${user.membershipType} membership is not expired still in use` )
    }
    user.membershipType = newMembershipType;
    user.registrationTime = new Date();
    user.isPayed = true;
    await this.userRepository.save(user);
  
  
  const paymentSuccessful = await this.paymentService.processPayment(paymentData);

  if (paymentSuccessful) {
    return ;
  
    
  } else {
    throw new ConflictException('Payment failed');
  }
}
    
    
    
  }


  
