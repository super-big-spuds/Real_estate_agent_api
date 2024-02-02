/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getTenementCalendarEvents(year: number, month: number) {
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, '0');

    const notices = await this.prisma.tenement_Notice.findMany({
      where: {
        visitDate: {
          startsWith: `${yearStr}-${monthStr}`,
        },
      },
    });

    return this.formatTenementNoticeEvents(notices);
  }

  async getUserCalendarEvents(year: number, month: number, userId: number) {
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, '0');

    const notices = await this.prisma.tenement_Notice.findMany({
      where: {
        visitDate: {
          startsWith: `${yearStr}-${monthStr}`,
        },
        owner: userId,
      },
    });

    return this.formatTenementNoticeEvents(notices);
  }

  async getCollectionNotices(year: number, month: number) {
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, '0');

    const collectionNotices = await this.prisma.collection_Notice.findMany({
      where: {
        visitDate: {
          startsWith: `${yearStr}-${monthStr}`,
        },
      },
    });

    return this.formatCollectionNotices(collectionNotices);
  }

  async getUserCollectionNotices(year: number, month: number, userId: number) {
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, '0');

    const collectionNotices = await this.prisma.collection_Notice.findMany({
      where: {
        visitDate: {
          startsWith: `${yearStr}-${monthStr}`,
        },
        Collection: {
          owner: userId,
        },
      },
    });

    return this.formatCollectionNotices(collectionNotices);
  }

  async getCollectionByYearMonth(
    year: number,
    month: number,
    isAdmin: boolean,
    UserId: number
  ) {
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, '0');
  
    const collections = await this.prisma.collection.findMany({
      where: {
        AND: [
          {
            collection_date: {
              startsWith: `${yearStr}-${monthStr}`,
            },
          },
          isAdmin ? {} : { is_deleted: false },
          isAdmin ? {} : { owner: UserId },
        ],
      },
    });
  
    return {
      message: 'Successfully retrieved the collection',
      data: collections,
    };
  }

  private formatTenementNoticeEvents(
    notices: IFormatTenementNotice[],
  ): IDayjsResponseItem[] {
    const eventsByDay = {};

    notices.forEach((notice) => {
      const date = new Date(notice.visitDate);
      const day = date.getDate();

      if (!eventsByDay[day]) {
        eventsByDay[day] = { day, events: [] };
      }

      eventsByDay[day].events.push({
        content: notice.record,
        id: notice.tenement_id.toString(),
        class: notice.type,
      });
    });

    return Object.values(eventsByDay);
  }

  private formatCollectionNotices(
    notices: IFormatCollectionNotice[],
  ): IDayjsResponseItem[] {
    const groupedByDay = {};

    notices.forEach((notice) => {
      const date = new Date(notice.visitDate);
      const day = date.getDate();

      if (!groupedByDay[day]) {
        groupedByDay[day] = { day, events: [] };
      }

      groupedByDay[day].events.push({
        content: notice.record,
        id: notice.id.toString(),
        class: 'collection',
      });
    });

    return Object.values(groupedByDay);
  }
}

type IFormatTenementNotice = {
  id: number;
  tenement_id: number;
  visitDate: string;
  record: string;
  remindDate: string;
  remind: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  owner: number;
};

type IFormatCollectionNotice = {
  id: number;
  collection_id: number;
  visitDate: string;
  record: string;
  remindDate: string;
  remind: string;
  createdAt: Date;
  updatedAt: Date;
};

type IDayjsResponseItem = {
  day: number;
  events: {
    content: string;
    id: string;
    class: string;
  }[];
};
