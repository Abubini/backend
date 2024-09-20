import { Module } from '@nestjs/common';
import { ContactEmailService } from './contact-email.service';
import { EmailController } from './contact-email.controller';

@Module({
  providers: [ContactEmailService],
  controllers: [EmailController],
})
export class ContactEmailModule {}
