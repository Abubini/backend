import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactEmailService {
  private readonly logger = new Logger(ContactEmailService.name);
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error configuring SMTP transporter', error.message);
      } else {
        this.logger.log('SMTP transporter configured successfully');
      }
    });
  }

  async sendMail(firstname: string, lastname: string, email: string, phone: string, comment: string) {
    const mailOptions = {
      from: `\"${firstname}\" <${email}>`,
      to: this.configService.get<string>('EMAIL_USER'),
      subject: `Message from ${firstname} ${lastname}`,
      text: `name: ${firstname} ${lastname} \n email: ${email} \n phone number: ${phone}\n ${comment}`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return 'your comment is sent successfully'
    } catch (error) {
      this.logger.error('Error sending email', error.message);
      throw new Error('Error sending email');
    }
  }
}
