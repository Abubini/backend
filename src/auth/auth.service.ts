import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly secretCode: string;
    private readonly adminname: string;
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private UserService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
        this.secretCode = this.configService.get<string>('ADMIN_CODE');
        this.adminname = this.configService.get<string>('ADMIN_USERNAME');
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email } });
        
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') }),
        };
      }


      async verifyCode(code: string, adminname: string) {
        if (code === this.secretCode && adminname === this.adminname) {
            const payload = { code, adminname };
            return {
                access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') }),
            };
        }
        throw new UnauthorizedException('Invalid username or code');
    }
}

