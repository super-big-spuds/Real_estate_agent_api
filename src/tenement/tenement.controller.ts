import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { CreateTenementRentDto } from './dto/create-rent.dto';
import { CreateTenementSellDto } from './dto/create-sell.dto';
import { CreateTenementDevelopDto } from './dto/create-develop.dto';
import { CreateTenementMarketDto } from './dto/create-market.dto';
import { TenementService } from './tenement.service';
import { UpdateTenementSellDto } from './dto/update-sell.dto';
import { UpdateTenementRentDto } from './dto/update-rent.dtp';
import { UpdateTenementDevelopDto } from './dto/update-develop.dto';
import { UpdateTenementMarketDto } from './dto/update-market.dto';
import { TenementQueryDto } from './dto/tenement-query.dto';
import { TenementRentQueryDto } from './dto/get-rents-fillter.dto';
@ApiTags('tenement')
@Controller('tenement')
export class TenementController {
  constructor(
    private tenementService: TenementService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('')
  @ApiOperation({ summary: 'Get all or filtered tenements' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tenements.',
  })
  @ApiResponse({ status: 404, description: 'Tenement not found' })
  async getAllTenements(@Request() req, @Query() query: TenementQueryDto) {
    const userisadmin = req.user.isadmin;
    const hasQueryParams = Object.keys(query).length > 0;
    if (hasQueryParams) {
      if (userisadmin === true) {
        return this.tenementService.getFilteredTenements(query, false);
      } else {
        return this.tenementService.getFilteredTenementsForUser(
          query,
          req.user.userId,
          false,
        );
      }
    } else {
      if (userisadmin === true) {
        return this.tenementService.getAllTenements(false);
      } else {
        return this.tenementService.getTenementsByUserId(
          req.user.userId,
          false,
        );
      }
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('rollback')
  @ApiOperation({ summary: 'Get all or filtered tenements' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tenements.',
  })
  @ApiResponse({ status: 404, description: 'Tenement not found' })
  async getAllRollBackTenements() {
    return this.tenementService.getAllTenements(true);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('/sell')
  @ApiOperation({ summary: 'Get all tenement sells' })
  async getAllTenementSells(@Request() req, @Query() query: TenementQueryDto) {
    const userisadmin = req.user.isadmin;
    0;
    const hasQueryParams = Object.keys(query).length > 0;

    if (hasQueryParams) {
      console.log('query', query);
      return this.tenementService.getFilteredTenementSells(
        userisadmin === true,
        req.user.userId,
        query,
      );
    } else {
      return this.tenementService.getAllTenementSells(
        userisadmin === true,
        req.user.userId,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('rent')
  @ApiOperation({ summary: 'Get all tenement rents' })
  async getAllTenementRents(
    @Request() req,
    @Query() query: TenementRentQueryDto,
  ) {
    const userisadmin = req.user.isadmin;
    const userId = req.user.userId;
    const hasQueryParams = Object.keys(query).length > 0;

    if (hasQueryParams) {
      return this.tenementService.getFilteredTenementRents(
        userisadmin,
        userId,
        query,
      );
    } else {
      return this.tenementService.getAllTenementRents(userisadmin, userId);
    }
  }
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('/edit/sell/:id')
  @ApiOperation({ summary: 'Get a specific tenement sell for editing' })
  async getTenementSellById(
    @Param('id', ParseIntPipe) tenementId: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;
    return this.tenementService.getTenementSellById(
      tenementId,
      req.user.userId,
      userisadmin,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('/edit/rent/:id')
  @ApiOperation({
    summary: 'Get details of a specific tenement rent for editing',
  })
  async getTenementRentById(
    @Param('id', ParseIntPipe) tenementId: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;
    return this.tenementService.getTenementRentById(
      tenementId,
      req.user.userId,
      userisadmin,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('/edit/develop/:id')
  @ApiOperation({
    summary: 'Get details of a specific tenement develop for editing',
  })
  async getTenementDevelopById(
    @Param('id', ParseIntPipe) tenementId: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;
    return this.tenementService.getTenementDevelopById(
      tenementId,
      req.user.userId,
      userisadmin,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Get('/edit/market/:id')
  @ApiOperation({
    summary: 'Get details of a specific tenement market for editing',
  })
  async getTenementMarketDetails(
    @Param('id', ParseIntPipe) tenementId: number,
    @Request() req,
  ) {
    const userisadmin = req.user.isadmin;
    return this.tenementService.getTenementMarketById(
      tenementId,
      req.user.userId,
      userisadmin,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/add/rent')
  @ApiOperation({ summary: 'Add new tenement rent' })
  async createTenementRent(
    @Request() req,
    @Body() createTenementRentDto: CreateTenementRentDto,
  ) {
    return this.tenementService.createTenementRent(
      createTenementRentDto,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/add/sell')
  @ApiOperation({ summary: 'Add new tenement sell' })
  async createTenementSell(
    @Request() req,
    @Body() createTenementSellDto: CreateTenementSellDto,
  ) {
    return this.tenementService.createTenementSell(
      createTenementSellDto,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/add/develop')
  @ApiOperation({ summary: 'Add new tenement development' })
  async createTenementDevelop(
    @Request() req,
    @Body() createTenementDevelopDto: CreateTenementDevelopDto,
  ) {
    return this.tenementService.createTenementDevelop(
      createTenementDevelopDto,
      req.user.userId,
    );
  }
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/add/market')
  @ApiOperation({ summary: 'Add new tenement development' })
  async createTenementMarket(
    @Request() req,
    @Body() createTenementMarketDto: CreateTenementMarketDto,
  ) {
    return this.tenementService.createTenementMarket(
      createTenementMarketDto,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete('/delete/sell/:tenementId')
  @ApiOperation({ summary: 'Delete tenement sell' })
  async deleteTenementSell(
    @Param('tenementId', ParseIntPipe) tenementId: number,
  ) {
    return this.tenementService.deleteTenementSell(tenementId);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete('/delete/market/:tenementId')
  async deleteTenementMarket(
    @Param('tenementId', ParseIntPipe) tenementId: number,
  ) {
    return this.tenementService.deleteTenementMarket(tenementId);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete('/delete/develop/:tenementId')
  async deleteTenementDevelop(
    @Param('tenementId', ParseIntPipe) tenementId: number,
  ) {
    return this.tenementService.deleteTenementDevelop(tenementId);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete('/delete/rent/:tenementId')
  async deleteTenementRent(
    @Param('tenementId', ParseIntPipe) tenementId: number,
  ) {
    return this.tenementService.deleteTenementRent(tenementId);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Delete('/delete/rollback/:tenementType/:tenementId')
  @ApiOperation({ summary: 'Rollback deletion of a specific tenement type' })
  async rollbackDeleteTenement(
    @Param('tenementId', ParseIntPipe) tenementId: number,
    @Param('tenementType') tenementType: string,
    @Request() req,
  ): Promise<any> {
    if (!req.user.isadmin) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return this.tenementService.rollbackDeleteTenement(
      tenementId,
      tenementType,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('/edit/sell/:tenementId')
  @ApiOperation({ summary: 'Update tenement sell' })
  async updateTenementSell(
    @Param('tenementId', ParseIntPipe) tenementId: number,
    @Body() updateTenementSellDto: UpdateTenementSellDto,
  ) {
    return this.tenementService.updateTenementSell(updateTenementSellDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/edit/rent/:tenementId')
  @ApiOperation({ summary: 'Update tenement sell' })
  async updateTenementRent(
    @Param('tenementId', ParseIntPipe) tenementId: number,
    @Body() updateTenementRentDto: UpdateTenementRentDto,
  ) {
    return this.tenementService.updateTenementRent(updateTenementRentDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/edit/develop/:tenementId')
  async updateTenementDevelop(
    @Request() req,
    @Param('tenementId', ParseIntPipe) tenementId: number,
    @Body() updateTenementDevelopDto: UpdateTenementDevelopDto,
  ) {
    return this.tenementService.updateTenementDevelop(
      tenementId,
      updateTenementDevelopDto,
    );
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @Post('/edit/market/:tenementId')
  async updateTenementMarket(
    @Param('tenementId', ParseIntPipe) tenementId: number,
    @Body() updateTenementMarketDto: UpdateTenementMarketDto,
  ) {
    return this.tenementService.updateTenementMarket(
      tenementId,
      updateTenementMarketDto,
    );
  }
}
