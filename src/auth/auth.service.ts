import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../lib/DTO/auth/user.entity';
import { Repository } from 'typeorm';
import { AuthDTO } from '../lib/DTO/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly UsersRepository: Repository<User>,
    private jwtSerice: JwtService
  ) {}


  async regUser(body: AuthDTO) {
    const {userName, password} = body
    const userExists = await this.UsersRepository.findOneBy({userName: userName})
    if (userExists) {
      throw new BadRequestException({Message: `User ${userName} already exists`})
    }
    const newUser = this.UsersRepository.create({...body})
    return this.UsersRepository.save(newUser)
  }


  async login(body: AuthDTO) {
    const {userName, password} = body
    const foundUser = await this.UsersRepository.findOneBy({userName: userName})
    if (!foundUser) {
      throw new NotFoundException({Message: `User ${userName} not found`})
    }
    if (!(password === foundUser.password)) {
      throw new ForbiddenException({Message: `Incorrect password`})
    }

    
    const payload = {
      id: foundUser.id,
      login: foundUser.userName
    }
    const token = this.jwtSerice.sign(payload)
    return token
  }


  async findUser(id: number) {
    const foundUser = await this.UsersRepository.findOneBy({id: id})
    if (!foundUser) {
      throw new NotFoundException({message: 'User not found'})
    }
    return foundUser
  }

  
  async findUserByName(userName: string) {
    if (!userName) {
      return undefined
    }
    const foundUser = await this.UsersRepository.findOneBy({userName: userName})
    if (!foundUser) {
      throw new NotFoundException({message: `Author ${userName} not found`})
    }
    return foundUser
  }
}
