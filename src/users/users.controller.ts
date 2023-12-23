import { Controller, Post, Get, Delete, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard'
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  getAllUsers() {
    return this.usersService.getHello();
  }


  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(loginDto.user_email, loginDto.user_password);
    if (!user) {
      throw new Error('Invalid credentials456');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(parseInt(userId, 10));
  }
  
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put(':id')
  async updateUser(@Param('id') userId: string, @Body() updateData: any) {
    return this.usersService.updateUser(parseInt(userId, 10), updateData);
  }
}
