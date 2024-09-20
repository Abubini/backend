import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ContactEmailService } from './contact-email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: ContactEmailService) {}

  @Post('send-email')
  async sendEmail(
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
    @Body('comment') Comment: string,
  ) {
    try {
      return await this.emailService.sendMail(firstname, lastname, email, phone, Comment);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
