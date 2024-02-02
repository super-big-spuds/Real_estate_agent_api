import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import {
  CreateCollectionNoticeDto,
  UpdateCollectionNoticeDto,
  CreateTenementNoticeDto,
  UpdateTenementNoticeDto,
} from './dto/notice.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { ParseIntPipe } from '@nestjs/common';

@ApiTags('notices')
@Controller('notices')
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get(':id/:type')
  @ApiOperation({ summary: 'Get notice by ID and type' })
  @ApiParam({ name: 'id', description: 'Tenement ID or Colletion ID' })
  @ApiParam({
    name: 'type',
    description:
      'Notice type (collection or sell or rent or develop or market)',
  })
  @ApiResponse({ status: 200, description: 'Notice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Notice not found' })
  async getNoticeByIdAndType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: string,
  ) {
    const notices = await this.noticeService.getNoticeByIdAndType(id, type);

    return {
      message: 'Notice retrieved successfully',
      data: notices,
    };
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/:type')
  @ApiOperation({ summary: 'Create new notices' })
  @ApiParam({
    name: 'type',
    description:
      'Notice type (collection or sell or rent or develop or market)',
  })
  @ApiResponse({ status: 200, description: 'Notices created successfully' })
  async createNotices(
    @Param('type') type: string,
    @Body()
    noticeDataArray: CreateCollectionNoticeDto[] | CreateTenementNoticeDto[],
    @Request() req,
  ) {
    const userId = req.user.userId;

    const newNoticesData = await this.noticeService.createNotices(
      type,
      noticeDataArray,
      userId,
    );

    return {
      message: 'Notices created successfully',
      data: newNoticesData,
    };
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Put('/:type')
  @ApiOperation({ summary: 'Update multiple notices' })
  @ApiParam({
    name: 'type',
    description: 'Notice type (collection or tenement)',
  })
  @ApiResponse({ status: 200, description: 'Notices updated successfully' })
  updateNotices(
    @Param('type') type: string,
    @Body()
    noticeDataArray: (UpdateCollectionNoticeDto | UpdateTenementNoticeDto)[],
  ) {
    return this.noticeService.updateNotices(type, noticeDataArray);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete(':id/:type')
  @ApiOperation({ summary: 'Delete a notice' })
  @ApiParam({ name: 'id', description: 'Notice ID' })
  @ApiParam({
    name: 'type',
    description: 'Notice type (collection or tenement)',
  })
  @ApiResponse({ status: 200, description: 'Notice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Notice not found' })
  deleteNotice(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: string,
  ) {
    return this.noticeService.deleteNotice(id, type);
  }
}
