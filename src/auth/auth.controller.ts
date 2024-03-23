import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from '../lib/DTO/auth/auth.dto';
import { Public } from 'src/lib/DTO/auth/constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/lib/DTO/auth/user.entity';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService
  ) {}



  @ApiOperation({summary: "Регистрирует пользователя"})
  @ApiResponse({status: 201, type: User})
  @Public()
  @Post('/reg')
  regUser(@Body() body: AuthDTO) {
    return this.AuthService.regUser(body)
  }

  @ApiOperation({summary: "Возвращает JWT-токен при успешной авторизации"})
  @ApiResponse({status: 200})
  @Public()
  @Post()
  login(@Body() body: AuthDTO) {
    return this.AuthService.login(body)
  }
}
