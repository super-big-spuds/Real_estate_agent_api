import { Module } from '@nestjs/common';
import { TenementService } from './tenement.service';
import { TenementController } from './tenement.controller';
import { PrismaService } from '../../prisma/prisma.service';
@Module({
  controllers: [TenementController],
  providers: [TenementService, PrismaService],
})
export class TenementModule {}
