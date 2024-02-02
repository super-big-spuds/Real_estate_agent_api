import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalStorageService } from './LocalStorageService';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@ApiTags('files')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth()
@Controller('files')
export class FileUploadController {
  constructor(private readonly localStorageService: LocalStorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'UploadFiles' })
  @ApiBody({
    description: 'Upload a file',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // 生成唯一文件名（此处使用当前时间戳和随机数来生成，您可以选择其他方式）
    // 首先获取文件原始名的扩展名
    const fileExtension = file.originalname.split('.').pop();
    // 使用当前时间戳和随机数生成新文件名
    const newFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}.${fileExtension}`;
    console.log(fileExtension);
    // 使用新的文件名保存文件
    // 假设 localStorageService.saveFile 方法可以接受一个新的文件名作为参数
    const fileUrl = await this.localStorageService.saveFile(file, newFileName);
    return {
      message: '文件上传成功',
      url: fileUrl,
    };
  }

  @Delete('delete/:filename')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(
    @Param('filename') filename: string,
  ): Promise<{ message: string }> {
    const isDeleted = await this.localStorageService.deleteFile(filename);
    if (!isDeleted) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'File deleted successfully' };
  }
}
