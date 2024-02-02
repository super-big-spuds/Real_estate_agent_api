import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCollectionNoticeDto,
  UpdateCollectionNoticeDto,
  CreateTenementNoticeDto,
  UpdateTenementNoticeDto,
} from './dto/notice.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoticeService {
  constructor(private prisma: PrismaService) {}

  async getNoticeByIdAndType(id: number, type: string) {
    let notices;
    const numericId = parseInt(id.toString(), 10);

    if (type === 'collection') {
      notices = await this.prisma.collection_Notice.findMany({
        where: {
          collection_id: numericId,
        },
      });
    } else {
      notices = await this.prisma.tenement_Notice.findMany({
        where: {
          tenement_id: numericId,
        },
      });
    }

    return notices;
  }

  async createNotices(
    type: string,
    noticeDataArray: CreateCollectionNoticeDto[] | CreateTenementNoticeDto[],
    userId: number,
  ) {
    let createdNotices;

    if (type === 'collection') {
      createdNotices = await this.createCollectionNotices(
        noticeDataArray as CreateCollectionNoticeDto[],
      );
    } else if (
      type === 'market' ||
      type === 'develop' ||
      type === 'sell' ||
      type === 'rent'
    ) {
      createdNotices = await this.createTenementNotices(
        noticeDataArray as CreateTenementNoticeDto[],
        userId,
        type,
      );
    } else {
      throw new BadRequestException('Unsupported notice type');
    }

    return createdNotices;
  }

  async updateNotices(
    type: string,
    noticeDataArray:
      | CreateCollectionNoticeDto[]
      | UpdateCollectionNoticeDto[]
      | UpdateTenementNoticeDto[],
  ) {

    type UpdateCollectionNotice = {
      id: string;
      visitDate: string;
      record: string;
      remindDate: string;
      remind: string;
    }

    try {
      for (const noticeData of noticeDataArray) {
        if (type === 'collection') {
          if (noticeData.isNew) {
            const { isNew, ...createNoticeData } = noticeData;
            await this.prisma.collection_Notice.create({
              data: createNoticeData as CreateCollectionNoticeDto,
            });
          } else {

      
            const updateNoticeData = noticeData as UpdateCollectionNotice;
            
            await this.prisma.collection_Notice.update({
              where: { id: parseInt(updateNoticeData.id) },
              data: {
                visitDate: updateNoticeData.visitDate,
                record: updateNoticeData.record,
                remindDate: updateNoticeData.remindDate,
                remind: updateNoticeData.remind,
              },
            });
          }
        } else if (
          type === 'market' ||
          type === 'develop' ||
          type === 'sell' ||
          type === 'rent'
        ) {
          if (noticeData.isNew) {
            const { isNew, ...createNoticeData } = noticeData;
            await this.prisma.tenement_Notice.create({
              data: createNoticeData as CreateTenementNoticeDto,
            });
          } else {
            const updateNoticeData = noticeData as UpdateCollectionNotice;

            await this.prisma.tenement_Notice.update({
              where: { id: parseInt(updateNoticeData.id) },
              data: {
                visitDate: updateNoticeData.visitDate,
                record: updateNoticeData.record,
                remindDate: updateNoticeData.remindDate,
                remind: updateNoticeData.remind,
              },
            });
          }
        }
      }
      return { message: 'notices updated' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the notices.',
      );
    }
  }

  async deleteNotice(id: number, type: string) {
    const noticeId = parseInt(id.toString(), 10);
    try {
      if (type === 'collection') {
        await this.prisma.collection_Notice.delete({
          where: { id: noticeId },
        });
      } else if (type === 'tenement') {
        await this.prisma.tenement_Notice.delete({
          where: { id: noticeId },
        });
      } else {
        throw new BadRequestException('Unsupported notice type');
      }

      return { message: 'notices deleted' };
    } catch (error) {
      console.error(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Notice with ID ${id} not found`);
      }
    }
  }

  private async createCollectionNotices(
    noticeDataArray: CreateCollectionNoticeDto[],
  ) {
    try {
      const createdNotices = await Promise.all(
        noticeDataArray.map(async (noticeData) => {
          if ('isNew' in noticeData) {
            delete noticeData.isNew;
          }
          return await this.prisma.collection_Notice.create({
            data: {
              ...noticeData,
              collection_id: noticeData.collection_id,
            },
          });
        }),
      );

      return createdNotices;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the collection notices.',
      );
    }
  }

  private async createTenementNotices(
    noticeDataArray: CreateTenementNoticeDto[],
    userId: number,
    type: string,
  ) {
    try {
      const createdNotices = await Promise.all(
        noticeDataArray.map(async (noticeData) => {
          if ('isNew' in noticeData) {
            delete noticeData.isNew;
          }
          return await this.prisma.tenement_Notice.create({
            data: {
              ...noticeData,
              owner: userId,
              type: type,
            },
          });
        }),
      );

      return createdNotices;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the tenement notices.',
      );
    }
  }
}
