import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './create-company.dto';
import { PaymentService } from '../payment/payment.service';
import { EmailService } from '../email/email.service';
import { Cron } from '@nestjs/schedule';
import { User } from '../user/user.entity';


@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService,
    @InjectRepository(User) // Ensure User repository is injected correctly
    private readonly userRepository: Repository<User>,
  ) {}
  
  findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async updateCompany(createCompanyDto: CreateCompanyDto,companyCode:string, first_name: string, last_name: string, chapaemail: string, phone_number:string, tx_ref: string): Promise<string> {
    let amount: number;
    switch(createCompanyDto.plan){
      case 'gold':
        amount = 100 * createCompanyDto.numberOfPeople;
        break;
        case 'silver':
          amount = 50 * createCompanyDto.numberOfPeople;
          break;
        case 'normal':
          amount = 20 * createCompanyDto.numberOfPeople;
          break;
        default:
          amount = 0;
    }
    if (createCompanyDto.numberOfPeople >= 20){
      amount = amount - (amount*0.1);
    }

    

    const existingCompany = await this.companyRepository.findOne({ where: { companyCode} });
    const existinguser = await this.userRepository.find({ where: { companyCode} });


      if (existingCompany) {
        if (existingCompany.isPayed) {
          throw new ConflictException('your plan is not expired. still in use');
        } else {
          const paymentSuccessful = await this.paymentService.processPayment({
            email: chapaemail,
        amount: amount, // amount in your currency
        currency: 'ETB',
      

        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        tx_ref: tx_ref,
        callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
        return_url: "https://www.google.com/",
    
      // additional data required by Chapa
    });
    existingCompany.isPayed = true;
    existingCompany.registrationTime = new Date();
    existingCompany.plan = createCompanyDto.plan;
    if (existinguser.length > 0) {
      // Update each user's data
      existinguser.forEach(user => {
        user.membershipType = createCompanyDto.plan;
        user.registrationTime = new Date();
        user.isPayed = true;
      });
    
      // Save the updated users back to the database
      
    }
    if (createCompanyDto.numberOfPeople < existingCompany.activeMembers){
      throw new ConflictException(`${existingCompany.activeMembers} joind under this company so the number of people must be minimum of ${existingCompany.activeMembers}`);
    }
    existingCompany.numberOfPeople = createCompanyDto.numberOfPeople;

    await this.companyRepository.save(existingCompany);
    await this.userRepository.save(existinguser);
    if (paymentSuccessful) {
      
    return;  



    } else {
      throw new Error('Payment failed');
    }
    
  }
}
  }

  async registerCompany(createCompanyDto: CreateCompanyDto, first_name: string, last_name: string, chapaemail: string, phone_number:string, tx_ref: string): Promise<string> {
    let amount: number;
    switch(createCompanyDto.plan){
      case 'gold':
        amount = 100 * createCompanyDto.numberOfPeople;
        break;
        case 'silver':
          amount = 50 * createCompanyDto.numberOfPeople;
          break;
        case 'normal':
          amount = 20 * createCompanyDto.numberOfPeople;
          break;
        default:
          amount = 0;
    }
    if (createCompanyDto.numberOfPeople >= 20){
      amount = amount - (amount*0.1);
    }

    
    
    const paymentData = {
        email: chapaemail,
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
    const companyCode = this.generateCompanyCode();
      const company = this.companyRepository.create({ ...createCompanyDto,companyCode });
      await this.companyRepository.save(company);
      await this.emailService.sendMail(createCompanyDto.email, 'Company Registration', `Your company code is: ${companyCode} \n share this code to ${createCompanyDto.numberOfPeople} people`);
    
    console.log(amount);
    const paymentSuccessful = await this.paymentService.processPayment(paymentData);

    if (paymentSuccessful) {
     
      
      return companyCode;
    } else {
      throw new Error('Payment failed');
    }
  }

  private generateCompanyCode(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  @Cron('*/1 * * * *') 
  async updateIsPayedStatus(): Promise<void> {
    const twoDaysAgo = new Date();
    twoDaysAgo.setMinutes(twoDaysAgo.getMinutes() - 3);

    await this.companyRepository.update(
      { registrationTime: LessThan(twoDaysAgo) },
      { isPayed: false }
    );
    await this.userRepository.update(
      { registrationTime: LessThan(twoDaysAgo) },
      { isPayed: false }
    );
    
  }
}
