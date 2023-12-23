// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // 导入 PrismaService
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, PrismaService], // 添加 PrismaService 到 providers 数组中
  exports: [UsersService],
})
export class UsersModule {}
