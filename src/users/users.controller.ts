import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Request,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseInterceptor } from './response.interceptor';
@ApiTags('user')
@Controller('user')
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('auth')
  @ApiOperation({ summary: 'Get a user auth' })
  @ApiResponse({ status: 200, description: 'Successfully get user auth.' })
  async getAuthUser(@Request() req) {
    const userisAdmin = req.user.isadmin;

    return {
      isadmin: userisAdmin,
    };
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ description: 'User Registration Data', type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 403, description: 'User already register' })
  async register(@Request() req, @Body() createUserDto: CreateUserDto) {
    const userisAdmin = req.user.isadmin;

    if (userisAdmin === true) {
      return this.usersService.createUser(createUserDto);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ description: 'User Login Data', type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 404, description: 'User not exist' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.user_email,
      loginDto.user_password,
    );
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete(':user_id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Request() req,
    @Param('user_id', ParseIntPipe) userId: number,
  ) {
    const userisAdmin = req.user.isadmin;
    if (userisAdmin === true) {
      return this.usersService.deleteUser(userId);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete('rollback/:user_id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async RollbackdeleteUser(
    @Request() req,
    @Param('user_id', ParseIntPipe) userId: number,
  ) {
    const userisAdmin = req.user.isadmin;
    if (userisAdmin === true) {
      return this.usersService.rollbackdeleteUser(userId);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Put(':user_id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiBody({ description: 'User Update Data', type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Request() req,
    @Param('user_id', ParseIntPipe) userId: number,
    @Body() updateData: UpdateUserDto,
  ) {
    const userisAdmin = req.user.isadmin;
    if (userisAdmin === true) {
      return this.usersService.updateUser(userId, updateData);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user data' })
  async getUsers(@Request() req) {
    const userisAdmin = req.user.isadmin;

    if (userisAdmin === true) {
      return this.usersService.getUsers(false);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('rollback/list')
  @ApiOperation({ summary: 'Get user Roll Back list' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved Roll Back user data',
  })
  async getRollBackUsers(@Request() req) {
    const userisAdmin = req.user.isadmin;

    if (userisAdmin === true) {
      return this.usersService.getUsers(true);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get(':user_id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user details',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('user_id', ParseIntPipe) userId: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;
    if (userisadmin === true) {
      return this.usersService.getUserById(userId);
    } else {
      throw new ForbiddenException('Access Denied');
    }
  }
}
