/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get(':year/:month')
  @ApiOperation({ summary: 'Get calendar events' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved calendar events.',
  })
  @ApiResponse({ status: 404, description: 'Events not found' })
  async getCalendarEvents(
    @Param('year') year: number,
    @Param('month') month: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;

    const tenementNotices = userisadmin
      ? await this.calendarService.getTenementCalendarEvents(year, month)
      : await this.calendarService.getUserCalendarEvents(
          year,
          month,
          req.user.userId,
        );

    const collectionNotices = userisadmin
      ? await this.calendarService.getCollectionNotices(year, month)
      : await this.calendarService.getUserCollectionNotices(
          year,
          month,
          req.user.userId,
        );

    const thisMonthDays = new Date(year, month, 0).getDate() + 1;

    type IOrganizedDayjsData = {
      day: number;
      events: {
        content: string;
        id: string;
        class: string;
      }[];
    };

    const mergedNotices: IOrganizedDayjsData[] = Array.from({
      length: thisMonthDays,
    })
      .map((_, thisDay) => {
        const tenementNotice = tenementNotices.find(
          (tenementNotice) => tenementNotice.day === thisDay,
        );
        const collectionNotice = collectionNotices.find(
          (collectionNotice) => collectionNotice.day === thisDay,
        );

        const tenementNoticeEvents = tenementNotice
          ? tenementNotice.events
          : [];
        const collectionNoticeEvents = collectionNotice
          ? collectionNotice.events
          : [];

        const thisDayEvents = [
          ...tenementNoticeEvents,
          ...collectionNoticeEvents,
        ];

        if (thisDayEvents.length === 0) {
          return null;
        }

        return {
          day: thisDay,
          events: thisDayEvents,
        };
      })
      .filter((item) => item !== null);

    return {
      message: 'Successfully retrieved the calendar events',
      data: mergedNotices,
    };
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get('collection/:year/:month')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get collection notices' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved collection notices.',
  })
  @ApiResponse({ status: 404, description: 'Notices not found' })
  async getCollectionNotices(
    @Param('year') year: number,
    @Param('month') month: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;
    const UserId = req.user.userId;
    const collectionData = await this.calendarService.getCollectionByYearMonth(
      year,
      month,
      userisadmin,
      UserId
    );
    type IOrganizedDayjsData = {
      day: number;
      events: {
        content: string;
        id: string;
        class: string;
      }[];
    };
    const organizedDayjsData: IOrganizedDayjsData[] =
      collectionData.data.reduce((acc, cur) => {
        const date = new Date(cur.collection_date);
        const day = date.getDate();

        const thisDateEntity = acc.find((item) => item.day === day);
        const thisDateEventInfo = {
          content: cur.collection_name,
          id: cur.id.toString(),
          class: cur.collection_type === '代收' ? 'prepay' : 'pay',
        };

        if (thisDateEntity) {
          thisDateEntity.events.push(thisDateEventInfo);
        } else {
          acc.push({
            day,
            events: [thisDateEventInfo],
          });
        }
        return acc;
      }, [] as IOrganizedDayjsData[]);

    return {
      message: 'Successfully retrieved the collection notices',
      data: organizedDayjsData,
    };
  }
}
