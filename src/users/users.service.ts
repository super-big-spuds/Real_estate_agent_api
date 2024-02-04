import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { GetUserListDto } from './dto/get-userlist.dto';
import { User } from '@prisma/client';
import { UserData } from './interface/user.interface';
import { ConfigService } from '@nestjs/config'; // 引入 ConfigService
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: {
    user_name: string;
    user_email: string;
    user_password: string;
    isadmin: boolean;
    isDelete: boolean;
  }): Promise<UserData> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        user_email: createUserDto.user_email,
      },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.user_password, 10);
    const user = await this.prisma.user.create({
      data: {
        user_name: createUserDto.user_name,
        user_email: createUserDto.user_email,
        user_password: hashedPassword,
        status: true, // 根据业务逻辑设置默认状态
        isadmin: createUserDto.isadmin, // 使用传入的值
        isDeleted: createUserDto.isDelete,
      },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        status: true,
        isadmin: true,
        isDeleted: true,
        user_password: false,
        // 注意：不返回 user_password 字段
      },
    });

    return {
      ...user,
      isadmin: user.isadmin,
      isDelete: user.isDeleted,
    };
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User with this email does not exist');
    }

    return user;
  }

  async updateUser(userId: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    async function getUserPasswordLogic(userInputPassword: string) {
      if (userInputPassword === '') {
        return user.user_password;
      } else {
        return await bcrypt.hash(userInputPassword, 10);
      }
    }
    const updateDataWithPassword = {
      ...updateData,
      user_password: await getUserPasswordLogic(updateData.user_password),
    };

    return this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        ...updateDataWithPassword,
        isDeleted: false,
      },
    });
  }

  async deleteUser(userId: number): Promise<User> {
    return this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
  async rollbackdeleteUser(userId: number): Promise<User> {
    return this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        is_true_deleted: true,
      },
    });
  }

  async getUsers(isDeleted: boolean): Promise<GetUserListDto[]> {
    return this.prisma.user.findMany({
      where: {
        isDeleted: isDeleted,
        is_true_deleted: false,
      },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        status: true,
        isadmin: true,
      },
    });
  }

  async getUserById(userId: number): Promise<GetUserListDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
        is_true_deleted: false,
      },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        status: true,
        isadmin: true,
        isDeleted: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
  async ensureAdminUser() {
    const adminName = 'admin';
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    // 检查是否存在管理员用户
    const adminExists = await this.prisma.user.findUnique({
      where: {
        user_email: adminEmail,
      },
    });
    // 加密密码
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    if (!adminExists) {
      await this.prisma.user.create({
        data: {
          user_name: adminName,
          user_email: adminEmail,
          user_password: hashedPassword,
          isadmin: true,
          status: true,
        },
      });
    } else {
      console.log('Admin user already exists');
    }
  }
}
