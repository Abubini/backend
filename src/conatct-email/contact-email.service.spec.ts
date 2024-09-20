import { Test, TestingModule } from '@nestjs/testing';
import { ContactEmailService } from './contact-email.service';

describe('EmailService', () => {
  let service: ContactEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactEmailService],
    }).compile();

    service = module.get<ContactEmailService>(ContactEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
