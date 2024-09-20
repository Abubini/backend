import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  async processPayment(data: any): Promise<boolean> {
    // Make API call to Chapa payment system
    try {
      const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', data, {
        headers: {
          Authorization: `Bearer CHASECK_TEST-3iucWaLBgKOdZ1Yuqmef7UQulp0vxneZ`,
        'Content-Type': 'application/json',
            
        },
      });
      return response.data.status === 'success';
    } catch (error) {
      console.error('Payment is failed:', error);
      return false;
    }
  }
}
