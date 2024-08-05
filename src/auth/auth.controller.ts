import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('logout')
  async logout() {
    return await this.authService.logout();
  }

  @Get('me')
  async getCurrentUser() {
    return await this.authService.getCurrentUser();
  }

  @Patch('me')
  async updateCurrentUser(@Body() updateUserDto: Partial<CreateUserDto>) {
    return await this.authService.updateCurrentUser(updateUserDto);
  }
}
