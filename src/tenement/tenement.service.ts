/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenementRentDto } from './dto/create-rent.dto';
import { CreateTenementSellDto } from './dto/create-sell.dto';
import { CreateTenementDevelopDto } from './dto/create-develop.dto';
import { CreateTenementMarketDto } from './dto/create-market.dto';
import { UpdateTenementSellDto } from './dto/update-sell.dto';
import { UpdateTenementRentDto } from './dto/update-rent.dtp';
import { UpdateTenementDevelopDto } from './dto/update-develop.dto';
import { UpdateTenementMarketDto } from './dto/update-market.dto';
import { GetTenementSellsFilterDto } from './dto/get-sells-fillter.dto';
import { TenementRentQueryDto } from './dto/get-rents-fillter.dto';

@Injectable()
export class TenementService {
  constructor(private prisma: PrismaService) {}

  async getAllTenements(isDeleted: boolean): Promise<{ message: string; data: any[] }> {
    const tenements = await this.prisma.tenement.findMany({
      
    });
  
    const resultData = [];
  
    for (const cur of tenements) {
      // 检查并添加Tenement Create数据，如果存在
      const tenementCreate = await this.prisma.tenement_Create.findUnique({
        where: { tenement_id: cur.id },
      });
  
      // 如果Tenement Create存在，则检查其他状态的数据
      if (tenementCreate) {
        const tenementRent = await this.prisma.tenement_Rent.findMany({
          where: { tenement_id: cur.id,is_deleted: isDeleted },
        });
        const tenementSell = await this.prisma.tenement_Sell.findMany({
          where: { tenement_id: cur.id ,is_deleted: isDeleted },
        });
        const tenementDevelop = await this.prisma.tenement_Develop.findMany({
          where: { tenement_id: cur.id,is_deleted: isDeleted  },
        });
  
        // 为Tenement Create添加一个条目

  
        // 为每个Rent, Sell, Develop状态添加条目
        tenementRent.forEach(rent => {
          resultData.push({
            tenement_id: cur.id,
            tenement_address: cur.tenement_address,
            tenement_face: cur.tenement_face ?? '',
            tenement_status: cur.tenement_status,
            tenement_type: "出售", // 标识这是一个"Rent"条目
            tenement_product_type: cur.tenement_product_type,
          });
        });
        tenementSell.forEach(sell => {
          resultData.push({
            tenement_id: cur.id,
            tenement_address: cur.tenement_address,
            tenement_face: cur.tenement_face ?? '',
            tenement_status: cur.tenement_status,
            tenement_type: "出租", // 标识这是一个"Sell"条目
            tenement_product_type: cur.tenement_product_type,
          });
        });
        tenementDevelop.forEach(develop => {
          resultData.push({
            tenement_id: cur.id,
            tenement_address: cur.tenement_address,
            tenement_face: cur.tenement_face ?? '',
            tenement_status: cur.tenement_status,
            tenement_type: "開發追蹤", // 标识这是一个"Develop"条目
            tenement_product_type: cur.tenement_product_type,
          });
        });
      }
        const marketTenement = await this.prisma.tenement_Market.findUnique({
          where: { tenement_id: cur.id,is_deleted: isDeleted  },
        });
        if (marketTenement) {
          resultData.push({
            tenement_id: cur.id,
            tenement_address: cur.tenement_address,
            tenement_face: cur.tenement_face ?? '',
            tenement_status: cur.tenement_status,
            tenement_type: "行銷追蹤", // 标识这是一个"Market"条目
            tenement_product_type: cur.tenement_product_type,
          });
        }
      }
    
  
    return {
      message: 'Successfully get the tenements',
      data: resultData,
    };
  }
  
  
  async getTenementsByUserId(userId: number, isDelete: boolean): Promise<{ message: string; data: any[] }> {
    const tenements = await this.prisma.tenement.findMany({
      where: { owner: userId, is_deleted: isDelete },
    });
  console.log(tenements)
    const resultData = [];
  
    for (const cur of tenements) {
      const types = [];
  
      const tenementCreate = await this.prisma.tenement_Create.findUnique({
        where: { tenement_id: cur.id },
      });

  
      const tenementRent = await this.prisma.tenement_Rent.findMany({
        where: { tenement_id: cur.id, is_deleted: isDelete },
      });
      if (tenementRent.length > 0) {
        types.push("Rent");
      }
  
      const tenementSell = await this.prisma.tenement_Sell.findMany({
        where: { tenement_id: cur.id, is_deleted: isDelete },
      });
      if (tenementSell.length > 0) {
        types.push("Sell");
      }
  
      const tenementDevelop = await this.prisma.tenement_Develop.findMany({
        where: { tenement_id: cur.id, is_deleted: isDelete },
      });
      if (tenementDevelop.length > 0) {
        types.push("Develop");
      }
  
      const marketTenement = await this.prisma.tenement_Market.findUnique({
        where: { tenement_id: cur.id },
      });
      if (marketTenement) {
        types.push("Market");
      }
  
      // 根据类型创建条目
      types.forEach(type => {
        resultData.push({
          tenement_id: cur.id,
          tenement_address: cur.tenement_address,
          tenement_face: cur.tenement_face ?? '',
          tenement_status: cur.tenement_status,
          tenement_type: type, // 根据当前的状态设置类型
          tenement_product_type: cur.tenement_product_type,
          management_fee_bottom: tenementCreate ? tenementCreate.management_fee : marketTenement ? marketTenement.burget_rent_min : null,
          management_floor_bottom: tenementCreate ? tenementCreate.tenement_floor : marketTenement ? marketTenement.hopefloor_min : null,
        });
      });
    }
  
    return {
      message: 'Successfully get the tenements',
      data: resultData,
    };
  }
  
  async getAllTenementSells(isadmin: boolean, userId: number): Promise<{ message: string; data: any[] }> {
    try {
      const queryOptions = {
        include: {
          Tenement_Create: {
            include: {
              Tenement: true,
            },
          },
        },
        where: {
          is_deleted: false, // 确保只获取未标记为删除的销售记录
        },
      };
      
      if (!isadmin) {
        // 非管理员用户，确保只能看到属于自己的记录
        // 通过Tenement_Create关联到Tenement，再通过Tenement的owner字段进行过滤
        queryOptions.where['Tenement_Create'] = {
          Tenement: {
            owner: userId,
            is_deleted: false, // 同时确保Tenement本身也未被标记为删除
          },
        };
      }
  
      const tenementSells = await this.prisma.tenement_Sell.findMany(queryOptions);
  
      const data = tenementSells.map((sell) => ({
        tenement_id: sell.tenement_id,
        tenement_address: sell.Tenement_Create.Tenement.tenement_address,
        tenement_face: sell.Tenement_Create.Tenement.tenement_face,
        tenement_status: sell.Tenement_Create.Tenement.tenement_status,
        tenement_type: sell.Tenement_Create.Tenement.tenement_type,
        tenement_product_type: sell.Tenement_Create.Tenement.tenement_product_type,
        management_fee_bottom: sell.Tenement_Create.management_fee,
        management_floor_bottom: sell.Tenement_Create.tenement_floor,
        selling_price: sell.Tenement_Create.selling_price,
        Total_rating: sell.Tenement_Create.total_rating,
        inside_rating: sell.Tenement_Create.inside_rating,
        public_building: sell.Tenement_Create.public_building,
        tenement_floor: sell.Tenement_Create.tenement_floor,
      }));
  
      return { message: 'Successfully retrieved tenement sells', data };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving tenements sells.',
      );
    }
  }

  async getAllTenementRents(isadmin: boolean, userId: number): Promise<{ message: string; data: any[] }> {
    try {
      const queryOptions = {
        include: {
          Tenement_Create: {
            include: {
              Tenement: true,
            },
          },
        },
        where: { // 加入`is_deleted`的判断
          is_deleted: false,
        },
      };
      
      if (!isadmin) {
        // 非管理员用户还需要确保他们只能看到自己的记录
        queryOptions.where['Tenement_Create'] = {
          Tenement: {
            owner: userId,
            is_deleted: false, // 确保Tenement本身也未被标记为删除
          },
        };
      }
  
      const tenementRents = await this.prisma.tenement_Rent.findMany(queryOptions);
  
      const data = tenementRents.map((rent) => ({
        tenement_id: rent.tenement_id,
        tenement_product_type: rent.Tenement_Create.Tenement.tenement_product_type,
        tenement_address: rent.Tenement_Create.Tenement.tenement_address,
        tenement_face: rent.Tenement_Create.Tenement.tenement_face,
        tenement_status: rent.Tenement_Create.Tenement.tenement_status, // 正确引用Tenement的状态
        tenement_type: rent.Tenement_Create.Tenement.tenement_type, // 正确引用Tenement的类型
        management_fee_bottom: rent.Tenement_Create.management_fee,
        management_floor_bottom: rent.Tenement_Create.tenement_floor,
        rent_price: rent.Tenement_Create.rent_price, // 使用正确的属性名
        total_rating: rent.Tenement_Create.total_rating,
        inside_rating: rent.Tenement_Create.inside_rating,
        public_building: rent.Tenement_Create.public_building,
        tenement_floor: rent.Tenement_Create.tenement_floor,
      }));
  
      return { message: 'Successfully retrieved tenement rents', data };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving tenements rents.'
      );
    }
  }

  async getTenementSellById(
    tenementId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<{ message: string; data: any }> {
    const tenementSell = await this.prisma.tenement_Sell.findUnique({
      where: { tenement_id: tenementId, is_deleted: false },
      include: { Tenement_Create: { include: { Tenement: true } } },
    });

    if (!tenementSell) {
      throw new NotFoundException('Tenement sell not found.');
    }

    if (!isAdmin && tenementSell.Tenement_Create.Tenement.owner !== userId) {
      throw new ForbiddenException(
        'Access to this tenement sell is forbidden.',
      );
    }
    const buyerIdImagesArray = tenementSell.buyer_id_images && tenementSell.buyer_id_images.trim() !== ''
    ? tenementSell.buyer_id_images.split(',')
    : [];
  
  const tenementImagesArray = tenementSell.Tenement_Create.Tenement.tenement_images && tenementSell.Tenement_Create.Tenement.tenement_images.trim() !== ''
    ? tenementSell.Tenement_Create.Tenement.tenement_images.split(',')
    : [];
    const data = {
      tenement_id: tenementSell.tenement_id,
      tenement_address: tenementSell.Tenement_Create.Tenement.tenement_address,
      tenement_product_type:
        tenementSell.Tenement_Create.Tenement.tenement_product_type,
      tenement_type: tenementSell.Tenement_Create.Tenement.tenement_type,
      tenement_status: tenementSell.Tenement_Create.Tenement.tenement_status,
      tenement_face: tenementSell.Tenement_Create.Tenement.tenement_face,
      tenement_images: tenementImagesArray,
      total_rating: tenementSell.Tenement_Create.total_rating,
      main_building: tenementSell.Tenement_Create.main_building,
      affiliated_building: tenementSell.Tenement_Create.affiliated_building,
      public_building: tenementSell.Tenement_Create.public_building,
      unregistered_area: tenementSell.Tenement_Create.unregistered_area,
      management_magnification:
        tenementSell.Tenement_Create.management_magnification,
      management_fee: tenementSell.Tenement_Create.management_fee,
      selling_price: tenementSell.Tenement_Create.selling_price,
      rent_price: tenementSell.Tenement_Create.rent_price,
      tenement_floor: tenementSell.Tenement_Create.tenement_floor,
      tenement_host_name: tenementSell.Tenement_Create.tenement_host_name,
      tenement_host_telphone:
        tenementSell.Tenement_Create.tenement_host_telphone,
      tenement_host_phone: tenementSell.Tenement_Create.tenement_host_phone,
      tenement_host_line: tenementSell.Tenement_Create.tenement_host_line,
      tenement_host_remittance_bank:
        tenementSell.Tenement_Create.tenement_host_remittance_bank,
      tenement_host_remittance_account:
        tenementSell.Tenement_Create.tenement_host_remittance_account,
      tenement_host_address: tenementSell.Tenement_Create.tenement_host_address,
      tenement_host_birthday:
        tenementSell.Tenement_Create.tenement_host_birthday,
      tenement_host_hobby: tenementSell.Tenement_Create.tenement_host_hobby,
      tenement_host_remark: tenementSell.Tenement_Create.tenement_host_remark,
      buyer_order_date: tenementSell.buyer_order_date,
      buyer_handout_date: tenementSell.buyer_handout_date,
      buyer_name: tenementSell.buyer_name,
      buyer_id_images: buyerIdImagesArray,
      buyer_phone: tenementSell.buyer_phone,
      buyer_jobtitle: tenementSell.buyer_jobtitle,
      buyer_remark: tenementSell.buyer_remark,
    };

    return { message: 'Successfully update the media', data };
  }
  async getTenementRentById(
    tenementId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<{ message: string; data: any }> {
    console.log(tenementId, userId, isAdmin )
    const tenementRent = await this.prisma.tenement_Rent.findUnique({
      where: { tenement_id: tenementId },
      include: {
        Tenement_Create: {
          include: {
            Tenement: true,
          },
        },
      },
    });

    if (!tenementRent) {
      throw new NotFoundException('Tenement rent not found.');
    }

    if (!isAdmin && tenementRent.Tenement_Create.Tenement.owner !== userId) {
      throw new ForbiddenException(
        'Access to this tenement rent is forbidden.',
      );
    }
    // 进行字符串到数组的转换
    const tenementImagesArray = tenementRent.Tenement_Create.Tenement.tenement_images
    ? tenementRent.Tenement_Create.Tenement.tenement_images.split(',').filter(img => img.trim() !== '')
    : [];
  
  const renterIdImagesArray = tenementRent.renter_id_images
    ? tenementRent.renter_id_images.split(',').filter(idImg => idImg.trim() !== '')
    : [];
    const data = {
      tenement_id: tenementRent.Tenement_Create.Tenement.id,
      tenement_address: tenementRent.Tenement_Create.Tenement.tenement_address,
      tenement_product_type:
        tenementRent.Tenement_Create.Tenement.tenement_product_type,
      tenement_type: tenementRent.Tenement_Create.Tenement.tenement_type,
      tenement_face: tenementRent.Tenement_Create.Tenement.tenement_face,
      tenement_images: tenementImagesArray,
      tenement_status: tenementRent.Tenement_Create.Tenement.tenement_status,
      total_rating: tenementRent.Tenement_Create.total_rating,
      main_building: tenementRent.Tenement_Create.main_building,
      affiliated_building: tenementRent.Tenement_Create.affiliated_building,
      public_building: tenementRent.Tenement_Create.public_building,
      unregistered_area: tenementRent.Tenement_Create.unregistered_area,
      management_magnification:
        tenementRent.Tenement_Create.management_magnification,
      management_fee: tenementRent.Tenement_Create.management_fee,
      rent_price: tenementRent.Tenement_Create.rent_price,
      deposit_price: tenementRent.Tenement_Create.deposit_price,
      tenement_floor: tenementRent.Tenement_Create.tenement_floor,
      tenement_host_name: tenementRent.Tenement_Create.tenement_host_name,
      tenement_host_telphone:
        tenementRent.Tenement_Create.tenement_host_telphone,
      tenement_host_phone: tenementRent.Tenement_Create.tenement_host_phone,
      tenement_host_line: tenementRent.Tenement_Create.tenement_host_line,
      tenement_host_remittance_bank:
        tenementRent.Tenement_Create.tenement_host_remittance_bank,
      tenement_host_remittance_account:
        tenementRent.Tenement_Create.tenement_host_remittance_account,
      tenement_host_address: tenementRent.Tenement_Create.tenement_host_address,
      tenement_host_birthday:
        tenementRent.Tenement_Create.tenement_host_birthday,
      tenement_host_hobby: tenementRent.Tenement_Create.tenement_host_hobby,
      tenement_host_remark: tenementRent.Tenement_Create.tenement_host_remark,
      renter_start_date: tenementRent.renter_start_date,
      renter_end_date: tenementRent.renter_end_date,
      renter_name: tenementRent.renter_name,
      renter_id_images: renterIdImagesArray,
      renter_phone: tenementRent.renter_phone,
      renter_jobtitle: tenementRent.renter_jobtitle,
      renter_guarantor_name: tenementRent.renter_guarantor_name,
      renter_guarantor_phone: tenementRent.renter_guarantor_phone,
      renter_remark: tenementRent.renter_remark,
    };

    return { message: 'Successfully update the media', data };
  }

  async getTenementDevelopById(
    tenementId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<{ message: string; data: any }> {
    const tenementDevelop = await this.prisma.tenement_Develop.findUnique({
      where: { tenement_id: tenementId },
      include: {
        Tenement_Create: {
          include: {
            Tenement: true,
          },
        },
      },
    });

    if (!tenementDevelop) {
      throw new NotFoundException('Tenement develop not found.');
    }

    if (!isAdmin && tenementDevelop.Tenement_Create.Tenement.owner !== userId) {
      throw new ForbiddenException(
        'Access to this tenement develop is forbidden.',
      );
    }
    const tenementImagesArray = tenementDevelop.Tenement_Create.Tenement.tenement_images
    ? tenementDevelop.Tenement_Create.Tenement.tenement_images.split(',').filter(img => img.trim() !== '')
    : [];
      
    const data = {
      tenement_id: tenementDevelop.Tenement_Create.Tenement.id,
      tenement_address:
        tenementDevelop.Tenement_Create.Tenement.tenement_address,
      tenement_product_type:
        tenementDevelop.Tenement_Create.Tenement.tenement_product_type,
      tenement_type: tenementDevelop.Tenement_Create.Tenement.tenement_type,
      tenement_face: tenementDevelop.Tenement_Create.Tenement.tenement_face,
      tenement_images: tenementImagesArray,
      total_rating: tenementDevelop.Tenement_Create.total_rating,
      main_building: tenementDevelop.Tenement_Create.main_building,
      affiliated_building: tenementDevelop.Tenement_Create.affiliated_building,
      public_building: tenementDevelop.Tenement_Create.public_building,
      unregistered_area: tenementDevelop.Tenement_Create.unregistered_area,
      management_magnification:
        tenementDevelop.Tenement_Create.management_magnification,
      management_fee: tenementDevelop.Tenement_Create.management_fee,
      selling_price: tenementDevelop.Tenement_Create.selling_price,
      rent_price: tenementDevelop.Tenement_Create.rent_price,
      deposit_price: tenementDevelop.Tenement_Create.deposit_price,
      tenement_floor: tenementDevelop.Tenement_Create.tenement_floor,
      tenement_host_name: tenementDevelop.Tenement_Create.tenement_host_name,
      tenement_host_telphone:
        tenementDevelop.Tenement_Create.tenement_host_telphone,
      tenement_host_phone: tenementDevelop.Tenement_Create.tenement_host_phone,
      tenement_host_line: tenementDevelop.Tenement_Create.tenement_host_line,
      tenement_host_remittance_bank:
        tenementDevelop.Tenement_Create.tenement_host_remittance_bank,
      tenement_host_remittance_account:
        tenementDevelop.Tenement_Create.tenement_host_remittance_account,
      tenement_host_address:
        tenementDevelop.Tenement_Create.tenement_host_address,
      tenement_host_birthday:
        tenementDevelop.Tenement_Create.tenement_host_birthday,
      tenement_host_hobby: tenementDevelop.Tenement_Create.tenement_host_hobby,
      tenement_host_remark:
        tenementDevelop.Tenement_Create.tenement_host_remark,
    };

    return { message: 'Successfully update the media', data };
  }

  async getTenementMarketById(
    tenementId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<{ message: string; data: any }> {
    const tenementMarket = await this.prisma.tenement_Market.findUnique({
      where: { tenement_id: tenementId },
      include: {
        Tenement: true,
      },
    });

    if (!tenementMarket) {
      throw new NotFoundException('Tenement market not found.');
    }

    if (!isAdmin && tenementMarket.Tenement.owner !== userId) {
      throw new ForbiddenException(
        'Access to this tenement market is forbidden.',
      );
    }
    const tenementImagesArray = tenementMarket.Tenement.tenement_images
    ? tenementMarket.Tenement.tenement_images.split(',').filter(img => img)
    : [];
    const data = {
      tenement_address: tenementMarket.Tenement.tenement_address,
      tenement_product_type: tenementMarket.Tenement.tenement_product_type,
      tenement_type: tenementMarket.Tenement.tenement_type,
      tenement_face: tenementMarket.Tenement.tenement_face,
      tenement_images: tenementImagesArray,
      tenement_host_name: tenementMarket.tenement_host_name,
      tenement_host_telphone: tenementMarket.tenement_host_telphone,
      tenement_host_phone: tenementMarket.tenement_host_phone,
      tenement_host_line: tenementMarket.tenement_host_line,
      tenement_host_remittance_bank:
        tenementMarket.tenement_host_remittance_bank,
      tenement_host_remittance_account:
        tenementMarket.tenement_host_remittance_account,
      tenement_host_address: tenementMarket.tenement_host_address,
      tenement_host_birthday: tenementMarket.tenement_host_birthday,
      tenement_host_hobby: tenementMarket.tenement_host_hobby,
      tenement_host_remark: tenementMarket.tenement_host_remark,
      tenement_area_max: tenementMarket.tenement_area_max,
      tenement_area_min: tenementMarket.tenement_area_min,
      burget_rent_max: tenementMarket.burget_rent_max,
      burget_rent_min: tenementMarket.burget_rent_min,
      hopefloor_max: tenementMarket.hopefloor_max,
      hopefloor_min: tenementMarket.hopefloor_min,
      market_state: tenementMarket.market_state,
    };

    return { message: 'Successfully update the media', data };
  }

  async createTenementRent(createTenementRentDto: CreateTenementRentDto, userId: number) {
    let tenement;
    const { tenement_id, renter_id_images, tenement_images, ...rest } = createTenementRentDto;
    const renterIdImagesAsString = renter_id_images.join(',');
    const tenementIdImagesAsString = tenement_images.join(',');
  
    // 检查 Tenement 是否存在
    if (tenement_id) {
      tenement = await this.prisma.tenement.findUnique({
        where: { id: tenement_id },
      });
  
      // 如果 Tenement 存在，则更新
      if (tenement) {
        tenement = await this.prisma.tenement.update({
          where: { id: tenement_id },
          data: {
            tenement_address: rest.tenement_address,
            tenement_product_type: rest.tenement_product_type,
            tenement_type: rest.tenement_type,
            tenement_status: rest.tenement_status,
            tenement_face: rest.tenement_face,
            tenement_images: tenementIdImagesAsString,
            owner: userId,
            is_deleted: false,
          },
        });
      }
    }
  
    // 如果 Tenement 不存在，则创建新的 Tenement
    if (!tenement) {
      tenement = await this.prisma.tenement.create({
        data: {
          tenement_address: rest.tenement_address,
          tenement_product_type: rest.tenement_product_type,
          tenement_type: rest.tenement_type,
          tenement_status: rest.tenement_status,
          tenement_face: rest.tenement_face,
          tenement_images: tenementIdImagesAsString,
          owner: userId,
          is_deleted: false,
        },
      });
    }
  
    // 检查 TenementCreate 是否存在
    let tenementCreate = await this.prisma.tenement_Create.findUnique({
      where: { tenement_id: tenement.id },
    });
  
    // 如果 TenementCreate 存在，则更新；否则，创建新的
    if (tenementCreate) {
      tenementCreate = await this.prisma.tenement_Create.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新的字段
          total_rating: rest.total_rating,
          main_building: rest.main_building,
          inside_rating: rest.main_building + rest.affiliated_building,
          affiliated_building: rest.affiliated_building,
          public_building: rest.public_building,
          unregistered_area: rest.unregistered_area,
          management_magnification: rest.management_magnification,
          management_fee: rest.management_fee,
          tenement_floor: rest.tenement_floor,
          tenement_host_name: rest.tenement_host_name,
          tenement_host_telphone: rest.tenement_host_telphone,
          tenement_host_phone: rest.tenement_host_phone,
          tenement_host_line: rest.tenement_host_line,
          tenement_host_remittance_bank: rest.tenement_host_remittance_bank,
          tenement_host_remittance_account: rest.tenement_host_remittance_account,
          tenement_host_address: rest.tenement_host_address,
          tenement_host_birthday: rest.tenement_host_birthday,
          tenement_host_hobby: rest.tenement_host_hobby,
          tenement_host_remark: rest.tenement_host_remark,
          rent_price: rest.rent_price,
        },
      });
    } else {
      tenementCreate = await this.prisma.tenement_Create.create({
        data: {
          tenement_id: tenement.id,
          // 创建的字段
          total_rating: rest.total_rating,
          main_building: rest.main_building,
          inside_rating: rest.main_building + rest.affiliated_building,
          affiliated_building: rest.affiliated_building,
          public_building: rest.public_building,
          deposit_price: rest.deposit_price,
          unregistered_area: rest.unregistered_area,
          management_magnification: rest.management_magnification,
          management_fee: rest.management_fee,
          tenement_floor: rest.tenement_floor,
          tenement_host_name: rest.tenement_host_name,
          tenement_host_telphone: rest.tenement_host_telphone,
          tenement_host_phone: rest.tenement_host_phone,
          tenement_host_line: rest.tenement_host_line,
          tenement_host_remittance_bank: rest.tenement_host_remittance_bank,
          tenement_host_remittance_account: rest.tenement_host_remittance_account,
          tenement_host_address: rest.tenement_host_address,
          tenement_host_birthday: rest.tenement_host_birthday,
          tenement_host_hobby: rest.tenement_host_hobby,
          tenement_host_remark: rest.tenement_host_remark,
          rent_price: rest.rent_price,
        },
      });
    }
  
    // 检查 TenementRent 是否存在
    let tenementRent = await this.prisma.tenement_Rent.findUnique({
      where: { tenement_id: tenement.id },
    });
  
    // 如果 TenementRent 存在，则更新；否则，创建新的
    if (tenementRent) {
      tenementRent = await this.prisma.tenement_Rent.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新的字段
          tenement_status: rest.tenement_status,
          renter_start_date: rest.renter_start_date,
          renter_end_date: rest.renter_end_date,
          renter_name: rest.renter_name,
          renter_id_images: renterIdImagesAsString,
          renter_phone: rest.renter_phone,
          renter_jobtitle: rest.renter_jobtitle,
          renter_guarantor_name: rest.renter_guarantor_name,
          renter_guarantor_phone: rest.renter_guarantor_phone,
          renter_remark: rest.renter_remark,
          is_deleted: false,
        },
      });
    } else {
      tenementRent = await this.prisma.tenement_Rent.create({
        data: {
          tenement_id: tenement.id,
          // 创建的字段
          tenement_status: rest.tenement_status,
          renter_start_date: rest.renter_start_date,
          renter_end_date: rest.renter_end_date,
          renter_name: rest.renter_name,
          renter_id_images: renterIdImagesAsString,
          renter_phone: rest.renter_phone,
          renter_jobtitle: rest.renter_jobtitle,
          renter_guarantor_name: rest.renter_guarantor_name,
          renter_guarantor_phone: rest.renter_guarantor_phone,
          renter_remark: rest.renter_remark,
          is_deleted: false,
        },
      });
    }
  
    return {
      message: 'Successfully processed the tenement rent',
      data: { tenement_id: tenement.id }
    };
  }

  async createTenementSell(createTenementSellDto: CreateTenementSellDto, userId: number) {
    const { tenement_id, buyer_id_images, tenement_images, ...rest } = createTenementSellDto;
    const sellIdImagesAsString = buyer_id_images.join(',');
    const tenementIdImagesAsString = tenement_images.join(',');
    let tenement;
  
    // 检查 Tenement 是否存在
    if (tenement_id) {
      tenement = await this.prisma.tenement.findUnique({
        where: { id: tenement_id },
      });
  
      // 如果 Tenement 存在，则更新
      if (tenement) {
        tenement = await this.prisma.tenement.update({
          where: { id: tenement_id },
          data: {
            tenement_address: rest.tenement_address,
            tenement_product_type: rest.tenement_product_type,
            tenement_type: rest.tenement_type,
            tenement_status: rest.tenement_status,
            tenement_face: rest.tenement_face,
            tenement_images: tenementIdImagesAsString,
            owner: userId,
            is_deleted: false,
          },
        });
      }
    }
  
    // 如果 Tenement 不存在，则创建新的 Tenement
    if (!tenement) {
      tenement = await this.prisma.tenement.create({
        data: {
          tenement_address: rest.tenement_address,
          tenement_product_type: rest.tenement_product_type,
          tenement_type: rest.tenement_type,
          tenement_status: rest.tenement_status,
          tenement_face: rest.tenement_face,
          tenement_images: tenementIdImagesAsString,
          owner: userId,
          is_deleted: false,
        },
      });
    }
  
    // 检查 TenementCreate 是否存在
    let tenementCreate = await this.prisma.tenement_Create.findUnique({
      where: { tenement_id: tenement.id },
    });
  
    // 如果 TenementCreate 存在，则更新；否则，创建新的
    if (tenementCreate) {
      tenementCreate = await this.prisma.tenement_Create.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新的字段
          total_rating: rest.total_rating,
          main_building: rest.main_building,
          inside_rating: rest.main_building + rest.affiliated_building,
          affiliated_building: rest.affiliated_building,
          public_building: rest.public_building,
          unregistered_area: rest.unregistered_area,
          management_magnification: rest.management_magnification,
          management_fee: rest.management_fee,
          tenement_floor: rest.tenement_floor,
          tenement_host_name: rest.tenement_host_name,
          tenement_host_telphone: rest.tenement_host_telphone,
          tenement_host_phone: rest.tenement_host_phone,
          tenement_host_line: rest.tenement_host_line,
          tenement_host_remittance_bank: rest.tenement_host_remittance_bank,
          tenement_host_remittance_account: rest.tenement_host_remittance_account,
          tenement_host_address: rest.tenement_host_address,
          tenement_host_birthday: rest.tenement_host_birthday,
          tenement_host_hobby: rest.tenement_host_hobby,
          tenement_host_remark: rest.tenement_host_remark,
          selling_price: rest.selling_price,
        },
      });
    } else {
      tenementCreate = await this.prisma.tenement_Create.create({
        data: {
          tenement_id: tenement.id,
          // 创建的字段
          total_rating: rest.total_rating,
          main_building: rest.main_building,
          inside_rating: rest.main_building + rest.affiliated_building,
          affiliated_building: rest.affiliated_building,
          public_building: rest.public_building,
          unregistered_area: rest.unregistered_area,
          management_magnification: rest.management_magnification,
          management_fee: rest.management_fee,
          tenement_floor: rest.tenement_floor,
          tenement_host_name: rest.tenement_host_name,
          tenement_host_telphone: rest.tenement_host_telphone,
          tenement_host_phone: rest.tenement_host_phone,
          tenement_host_line: rest.tenement_host_line,
          tenement_host_remittance_bank: rest.tenement_host_remittance_bank,
          tenement_host_remittance_account: rest.tenement_host_remittance_account,
          tenement_host_address: rest.tenement_host_address,
          tenement_host_birthday: rest.tenement_host_birthday,
          tenement_host_hobby: rest.tenement_host_hobby,
          tenement_host_remark: rest.tenement_host_remark,
          selling_price: rest.selling_price,
        },
      });
    }
  
    // 检查 TenementSell 是否存在
    let tenementSell = await this.prisma.tenement_Sell.findUnique({
      where: { tenement_id: tenement.id },
    });
  
    // 如果 TenementSell 存在，则更新；否则，创建新的
    if (tenementSell) {
      tenementSell = await this.prisma.tenement_Sell.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新的字段
          buyer_order_date: rest.buyer_order_date,
          buyer_handout_date: rest.buyer_handout_date,
          buyer_name: rest.buyer_name,
          buyer_id_images: sellIdImagesAsString,
          buyer_phone: rest.buyer_phone,
          buyer_jobtitle: rest.buyer_jobtitle,
          buyer_remark: rest.buyer_remark,
        },
      });
    } else {
      tenementSell = await this.prisma.tenement_Sell.create({
        data: {
          tenement_id: tenement.id,
          // 创建的字段
          buyer_order_date: rest.buyer_order_date,
          buyer_handout_date: rest.buyer_handout_date,
          buyer_name: rest.buyer_name,
          buyer_id_images: sellIdImagesAsString,
          buyer_phone: rest.buyer_phone,
          buyer_jobtitle: rest.buyer_jobtitle,
          buyer_remark: rest.buyer_remark,
        },
      });
    }
  
    return { message: 'Successfully processed the tenement sell', data: { tenement_id: tenement.id } };
  }

  async createTenementDevelop(createTenementDevelopDto: CreateTenementDevelopDto, userId: number) {
    const { tenement_id, tenement_images, ...rest } = createTenementDevelopDto;
    const tenementIdImagesAsString = tenement_images.join(',');
    let tenement;
  
    // 检查 Tenement 是否存在
    if (tenement_id) {
      tenement = await this.prisma.tenement.findUnique({
        where: { id: tenement_id },
      });
  
      // 如果 Tenement 存在，则更新
      if (tenement) {
        tenement = await this.prisma.tenement.update({
          where: { id: tenement_id },
          data: {
            tenement_address: rest.tenement_address,
            tenement_product_type: rest.tenement_product_type,
            tenement_type: rest.tenement_type,
            tenement_face: rest.tenement_face,
            tenement_images: tenementIdImagesAsString,
            owner: userId,
            tenement_status: rest.tenement_status || "未成交",
            is_deleted: false,
          },
        });
      }
    }
  
    // 如果 Tenement 不存在，则创建新的 Tenement
    if (!tenement) {
      tenement = await this.prisma.tenement.create({
        data: {
          tenement_address: rest.tenement_address,
          tenement_product_type: rest.tenement_product_type,
          tenement_type: rest.tenement_type,
          tenement_face: rest.tenement_face,
          tenement_images: tenementIdImagesAsString,
          owner: userId,
          tenement_status: rest.tenement_status || "未成交",
          is_deleted: false,
        },
      });
    }
  
    // 检查 TenementCreate 是否存在
    let tenementCreate = await this.prisma.tenement_Create.findUnique({
      where: { tenement_id: tenement.id },
    });
  
    // 如果 TenementCreate 存在，则更新；否则，创建新的
    if (tenementCreate) {
      tenementCreate = await this.prisma.tenement_Create.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新的字段
          total_rating: rest.total_rating,
          main_building: rest.main_building,
          inside_rating: rest.main_building + rest.affiliated_building,
          affiliated_building: rest.affiliated_building,
          public_building: rest.public_building,
          unregistered_area: rest.unregistered_area,
          management_magnification: rest.management_magnification,
          management_fee: rest.management_fee,
          selling_price: 0, // 根据实际情况调整
          rent_price: 0, // 根据实际情况调整
          deposit_price: rest.deposit_price,
          tenement_floor: rest.tenement_floor,
          tenement_host_name: rest.tenement_host_name,
          tenement_host_telphone: rest.tenement_host_telphone,
          tenement_host_phone: rest.tenement_host_phone,
          tenement_host_line: rest.tenement_host_line,
          tenement_host_remittance_bank: rest.tenement_host_remittance_bank,
          tenement_host_remittance_account: rest.tenement_host_remittance_account,
          tenement_host_address: rest.tenement_host_address,
          tenement_host_birthday: rest.tenement_host_birthday,
          tenement_host_hobby: rest.tenement_host_hobby,
          tenement_host_remark: rest.tenement_host_remark,
        },
      });
    } else {
      tenementCreate = await this.prisma.tenement_Create.create({
        data: {
          tenement_id: tenement.id,
          // 创建的字段
          total_rating: rest.total_rating,
          main_building: rest.main_building,
          inside_rating: rest.main_building + rest.affiliated_building,
          affiliated_building: rest.affiliated_building,
          public_building: rest.public_building,
          unregistered_area: rest.unregistered_area,
          management_magnification: rest.management_magnification,
          management_fee: rest.management_fee,
          selling_price: 0, // 根据实际情况调整
          rent_price: 0, // 根据实际情况调整
          deposit_price: rest.deposit_price,
          tenement_floor: rest.tenement_floor,
          tenement_host_name: rest.tenement_host_name,
          tenement_host_telphone: rest.tenement_host_telphone,
          tenement_host_phone: rest.tenement_host_phone,
          tenement_host_line: rest.tenement_host_line,
          tenement_host_remittance_bank: rest.tenement_host_remittance_bank,
          tenement_host_remittance_account: rest.tenement_host_remittance_account,
          tenement_host_address: rest.tenement_host_address,
          tenement_host_birthday: rest.tenement_host_birthday,
          tenement_host_hobby: rest.tenement_host_hobby,
          tenement_host_remark: rest.tenement_host_remark,
        },
      });
    }
  
    // 检查 TenementDevelop 是否存在
    let tenementDevelop = await this.prisma.tenement_Develop.findUnique({
      where: { tenement_id: tenement.id },
    });
  
    // 如果 TenementDevelop 存在，则更新；否则，创建新的
    if (tenementDevelop) {
      tenementDevelop = await this.prisma.tenement_Develop.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新的字段
          is_deleted: false,
        },
      });
    } else {
      tenementDevelop = await this.prisma.tenement_Develop.create({
        data: {
          tenement_id: tenement.id,
          is_deleted: false,
        },
      });
    }
  
    return { message: 'Successfully processed the tenement development', data: { tenement_id: tenement.id } };
  }
  

  async createTenementMarket(createTenementMarketDto: CreateTenementMarketDto, userId: number) {
    const tenementId = createTenementMarketDto.tenement_id;
    let tenement;

    // 检查是否已有 Tenement 数据
    if (tenementId) {
      tenement = await this.prisma.tenement.findUnique({
        where: { id: tenementId },
      });

      // 如果 Tenement 存在，则更新
      if (tenement) {
        tenement = await this.prisma.tenement.update({
          where: { id: tenementId },
          data: {
            tenement_address: createTenementMarketDto.tenement_address,
            tenement_product_type: createTenementMarketDto.tenement_product_type,
            tenement_type: createTenementMarketDto.tenement_type,
            tenement_face: createTenementMarketDto.tenement_face,
            tenement_images: createTenementMarketDto.tenement_images.join(','),
            tenement_status: createTenementMarketDto.tenement_status || "未成交",
            // 其他可能需要更新的字段...
          },
        });
      }
    }

    // 如果 Tenement 不存在，则创建新的 Tenement
    if (!tenement) {
      tenement = await this.prisma.tenement.create({
        data: {
          tenement_address: createTenementMarketDto.tenement_address,
          tenement_product_type: createTenementMarketDto.tenement_product_type,
          tenement_type: createTenementMarketDto.tenement_type,
          tenement_face: createTenementMarketDto.tenement_face,
          tenement_images: createTenementMarketDto.tenement_images.join(','),
          owner: userId,
          tenement_status: createTenementMarketDto.tenement_status || "未成交",
          is_deleted: false,
          // 其他需要在创建时包含的字段...
        },
      });
    }

    // 检查 Tenement_Market 是否存在
    const existingTenementMarket = await this.prisma.tenement_Market.findUnique({
      where: { tenement_id: tenement.id },
    });

    // 如果存在，更新 Tenement_Market
    if (existingTenementMarket) {
      await this.prisma.tenement_Market.update({
        where: { tenement_id: tenement.id },
        data: {
          // 更新 Tenement_Market 的字段...
        },
      });
    } else {
      // 如果不存在，创建新的 Tenement_Market
      await this.prisma.tenement_Market.create({
        data: {
          tenement_id: tenement.id,
          tenement_host_name: createTenementMarketDto.tenement_host_name,
          tenement_host_telphone: createTenementMarketDto.tenement_host_telphone,
          tenement_host_phone: createTenementMarketDto.tenement_host_phone,
          tenement_host_line: createTenementMarketDto.tenement_host_line,
          tenement_host_remittance_bank: createTenementMarketDto.tenement_host_remittance_bank,
          tenement_host_remittance_account: createTenementMarketDto.tenement_host_remittance_account,
          tenement_host_address: createTenementMarketDto.tenement_host_address,
          tenement_host_birthday: createTenementMarketDto.tenement_host_birthday,
          tenement_host_hobby: createTenementMarketDto.tenement_host_hobby,
          tenement_host_remark: createTenementMarketDto.tenement_host_remark,
          tenement_area_max: createTenementMarketDto.tenement_area_max,
          tenement_area_min: createTenementMarketDto.tenement_area_min,
          burget_rent_max: createTenementMarketDto.burget_rent_max,
          burget_rent_min: createTenementMarketDto.burget_rent_min,
          hopefloor_max: createTenementMarketDto.hopefloor_max,
          hopefloor_min: createTenementMarketDto.hopefloor_min,
          market_state: createTenementMarketDto.market_state,
        },
      });
    }

    return { message: 'Successfully processed the tenement', data: { tenement_id: tenement.id } };
  }

  async deleteTenementRent(tenementId: number): Promise<{ message: string }> {
    await this.prisma.tenement_Rent.updateMany({
      where: {
        tenement_id: tenementId,
        is_deleted: false,
      },
      data: {
        is_deleted: true,
      },
    });

    return { message: 'Tenement rent successfully deleted' };
  }

  async deleteTenementDevelop(
    tenementId: number,
  ): Promise<{ message: string }> {
    await this.prisma.tenement_Develop.updateMany({
      where: {
        tenement_id: tenementId,
        is_deleted: false,
      },
      data: {
        is_deleted: true,
      },
    });

    return { message: 'Tenement develop successfully deleted' };
  }

  async deleteTenementMarket(tenementId: number): Promise<{ message: string }> {
    await this.prisma.tenement_Market.updateMany({
      where: {
        tenement_id: tenementId,
        is_deleted: false,
      },
      data: {
        is_deleted: true,
      },
    });

    return { message: 'Tenement market successfully deleted' };
  }

  async deleteTenementSell(tenementId: number): Promise<{ message: string }> {
    await this.prisma.tenement_Sell.updateMany({
      where: {
        tenement_id: tenementId,
        is_deleted: false, // 只更新未被删除的记录
      },
      data: {
        is_deleted: true,
      },
    });

    return { message: 'Tenement sell successfully deleted' };
  }

  async updateTenementSell(
    updateTenementSellDto: UpdateTenementSellDto,
  ): Promise<{ message: string }> {
    const { tenement_id, ...updateData } = updateTenementSellDto;
    const buyerIdImagesAsString =
      updateTenementSellDto.buyer_id_images.join(',');
    const tenementIdImagesAsString =
      updateTenementSellDto.tenement_images.join(',');

    await this.prisma.tenement.update({
      where: { id: tenement_id },
      data: {
        tenement_address: updateData.tenement_address,
        tenement_product_type: updateData.tenement_product_type,
        tenement_type: updateData.tenement_type,
        tenement_face: updateData.tenement_face,
        tenement_images: tenementIdImagesAsString,
        tenement_status: updateData.tenement_status,
      },
    });

    // 更新 Tenement_Create 记录
    await this.prisma.tenement_Create.update({
      where: { tenement_id: tenement_id },
      data: {
        total_rating: updateData.total_rating,
        main_building: updateData.main_building,
        affiliated_building: updateData.affiliated_building,
        public_building: updateData.public_building,
        unregistered_area: updateData.unregistered_area,
        management_magnification: updateData.management_magnification,
        management_fee: updateData.management_fee,
        selling_price: updateData.selling_price,
        tenement_floor: updateData.tenement_floor,
        tenement_host_name: updateData.tenement_host_name,
        tenement_host_telphone: updateData.tenement_host_telphone,
        tenement_host_phone: updateData.tenement_host_phone,
        tenement_host_line: updateData.tenement_host_line,
        tenement_host_remittance_bank: updateData.tenement_host_remittance_bank,
        tenement_host_remittance_account:
          updateData.tenement_host_remittance_account,
        tenement_host_address: updateData.tenement_host_address,
        tenement_host_birthday: updateData.tenement_host_birthday,
        tenement_host_hobby: updateData.tenement_host_hobby,
        tenement_host_remark: updateData.tenement_host_remark,
      },
    });

    // 更新 Tenement_Sell 记录
    await this.prisma.tenement_Sell.update({
      where: { tenement_id: tenement_id },
      data: {
        buyer_order_date: updateData.buyer_order_date,
        buyer_handout_date: updateData.buyer_handout_date,
        buyer_name: updateData.buyer_name,
        buyer_id_images: buyerIdImagesAsString,
        buyer_phone: updateData.buyer_phone,
        buyer_jobtitle: updateData.buyer_jobtitle,
        buyer_remark: updateData.buyer_remark,
        is_deleted: false,
      },
    });

    return { message: 'Successfully update the media' };
  }

  async updateTenementRent(
    updateTenementRentDto: UpdateTenementRentDto,
  ): Promise<{ message: string }> {
    const { tenement_id, ...updateData } = updateTenementRentDto;
    const tenementIdImagesAsString =
      updateTenementRentDto.tenement_images.join(',');
    const rentIdImagesAsString =
      updateTenementRentDto.renter_id_images.join(',');

    await this.prisma.tenement.update({
      where: { id: tenement_id },
      data: {
        tenement_address: updateData.tenement_address,
        tenement_product_type: updateData.tenement_product_type,
        tenement_type: updateData.tenement_type,
        tenement_face: updateData.tenement_face,
        tenement_images: tenementIdImagesAsString,
        tenement_status: updateData.tenement_status,
        // 可以添加其他 Tenement 字段
      },
    });

    // 更新 Tenement_Create 记录
    await this.prisma.tenement_Create.update({
      where: { tenement_id: tenement_id },
      data: {
        total_rating: updateData.total_rating,
        main_building: updateData.main_building,
        inside_rating:
          updateData.main_building + updateData.affiliated_building,
        affiliated_building: updateData.affiliated_building,
        public_building: updateData.public_building,
        unregistered_area: updateData.unregistered_area,
        management_magnification: updateData.management_magnification,
        management_fee: updateData.management_fee,
        selling_price: updateData.selling_price,
        rent_price: updateData.rent_price,
        deposit_price: updateData.deposit_price,
        tenement_floor: updateData.tenement_floor,
        tenement_host_name: updateData.tenement_host_name,
        tenement_host_telphone: updateData.tenement_host_telphone,
        tenement_host_phone: updateData.tenement_host_phone,
        tenement_host_line: updateData.tenement_host_line,
        tenement_host_remittance_bank: updateData.tenement_host_remittance_bank,
        tenement_host_remittance_account:
          updateData.tenement_host_remittance_account,
        tenement_host_address: updateData.tenement_host_address,
        tenement_host_birthday: updateData.tenement_host_birthday,
        tenement_host_hobby: updateData.tenement_host_hobby,
        tenement_host_remark: updateData.tenement_host_remark,
        // 可以添加其他 Tenement_Create 字段
      },
    });

    // 更新 Tenement_Rent 记录
    await this.prisma.tenement_Rent.update({
      where: { tenement_id: tenement_id },
      data: {
        renter_start_date: updateData.renter_start_date,
        renter_end_date: updateData.renter_end_date,
        renter_name: updateData.renter_name,
        renter_id_images: rentIdImagesAsString,
        renter_phone: updateData.renter_phone,
        renter_jobtitle: updateData.renter_jobtitle,
        renter_guarantor_name: updateData.renter_guarantor_name,
        renter_guarantor_phone: updateData.renter_guarantor_phone,
        renter_remark: updateData.renter_remark,
        is_deleted: false,
        // 可以添加其他 Tenement_Rent 字段
      },
    });

    return { message: 'Tenement rent successfully updated' };
  }

  async updateTenementDevelop(
    tenementId: number,
    updateTenementDevelopDto: UpdateTenementDevelopDto,
  ): Promise<{ message: string }> {
    const { ...updateData } = updateTenementDevelopDto;
    const tenementIdImagesAsString =
      updateTenementDevelopDto.tenement_images.join(',');
    // 更新 Tenement 记录
    await this.prisma.tenement.update({
      where: { id: tenementId },
      data: {
        tenement_address: updateData.tenement_address,
        tenement_product_type: updateData.tenement_product_type,
        tenement_type: updateData.tenement_type,
        tenement_face: updateData.tenement_face,
        tenement_images: tenementIdImagesAsString,
        tenement_status: updateData.tenement_status,
      },
    });

    // 更新 Tenement_Create 记录
    await this.prisma.tenement_Create.update({
      where: { tenement_id: tenementId },
      data: {
        total_rating: updateData.total_rating,
        main_building: updateData.main_building,
        inside_rating:
          updateData.main_building + updateData.affiliated_building,
        affiliated_building: updateData.affiliated_building,
        public_building: updateData.public_building,
        unregistered_area: updateData.unregistered_area,
        management_magnification: updateData.management_magnification,
        management_fee: updateData.management_fee,
        selling_price: updateData.selling_price,
        rent_price: updateData.rent_price,
        deposit_price: updateData.deposit_price,
        tenement_floor: updateData.tenement_floor,
        tenement_host_name: updateData.tenement_host_name,
        tenement_host_telphone: updateData.tenement_host_telphone,
        tenement_host_phone: updateData.tenement_host_phone,
        tenement_host_line: updateData.tenement_host_line,
        tenement_host_remittance_bank: updateData.tenement_host_remittance_bank,
        tenement_host_remittance_account:
          updateData.tenement_host_remittance_account,
        tenement_host_address: updateData.tenement_host_address,
        tenement_host_birthday: updateData.tenement_host_birthday,
        tenement_host_hobby: updateData.tenement_host_hobby,
        tenement_host_remark: updateData.tenement_host_remark,
        
      },
    });
    await this.prisma.tenement_Develop.update({
      where: { tenement_id: tenementId },
      data: {
        is_deleted: false,
      },
    });

    return { message: 'Tenement develop successfully updated' };
  }

  async updateTenementMarket(
    tenementId: number,
    updateTenementMarketDto: UpdateTenementMarketDto,
  ): Promise<{ message: string }> {
    const tenementIdImagesAsString =
      updateTenementMarketDto.tenement_images.join(',');
    await this.prisma.tenement.update({
      where: { id: tenementId },
      data: {
        tenement_address: updateTenementMarketDto.tenement_address,
        tenement_product_type: updateTenementMarketDto.tenement_product_type,
        tenement_type: updateTenementMarketDto.tenement_type,
        tenement_face: updateTenementMarketDto.tenement_face,
        tenement_images: tenementIdImagesAsString,
        tenement_status: updateTenementMarketDto.tenement_status,
      },
    });

    // 更新 Tenement_Market 记录
    await this.prisma.tenement_Market.update({
      where: { tenement_id: tenementId },
      data: {
        tenement_host_name: updateTenementMarketDto.tenement_host_name,
        tenement_host_telphone: updateTenementMarketDto.tenement_host_telphone,
        tenement_host_phone: updateTenementMarketDto.tenement_host_phone,
        tenement_host_line: updateTenementMarketDto.tenement_host_line,
        tenement_host_remittance_bank:
          updateTenementMarketDto.tenement_host_remittance_bank,
        tenement_host_remittance_account:
          updateTenementMarketDto.tenement_host_remittance_account,
        tenement_host_address: updateTenementMarketDto.tenement_host_address,
        tenement_host_birthday: updateTenementMarketDto.tenement_host_birthday,
        tenement_host_hobby: updateTenementMarketDto.tenement_host_hobby,
        tenement_host_remark: updateTenementMarketDto.tenement_host_remark,
        tenement_area_max: updateTenementMarketDto.tenement_area_max,
        tenement_area_min: updateTenementMarketDto.tenement_area_min,
        burget_rent_max: updateTenementMarketDto.burget_rent_max,
        burget_rent_min: updateTenementMarketDto.burget_rent_min,
        hopefloor_max: updateTenementMarketDto.hopefloor_max,
        hopefloor_min: updateTenementMarketDto.hopefloor_min,
        market_state: updateTenementMarketDto.market_state,
        is_deleted: false,
      },
    });

    return { message: 'Tenement market successfully updated' };
  }

  async getFilteredTenements(query,isDelete:boolean): Promise<{ message: string; data: any }> {
    const {
      tenement_address,
      tenement_product_type,
      tenement_status,
      tenement_face,
      tenement_type,
      rent_price_min,
      rent_price_max,
      selling_price_min,
      selling_price_max,
      floor_min,
      floor_max,
    } = query;
  
    const whereClauseTenement: any = {}; // 用于 Tenement 表
    const whereClauseCreate: any = {};   // 用于 Tenement_Create 表
    const whereClauseMarketCreate: any = {};   // 用于 Tenement_Market 表
  
    // Tenement 表的條件
    if (tenement_address) {
      whereClauseTenement.tenement_address = { contains: tenement_address };
    }
    if (tenement_product_type) {
      whereClauseTenement.tenement_product_type = { equals: tenement_product_type };
    }
    if (tenement_status) {
      whereClauseTenement.tenement_status = { equals: tenement_status };
    }
    if (tenement_face) {
      whereClauseTenement.tenement_face = { equals: tenement_face };
    }
    if (tenement_type) {
      whereClauseTenement.tenement_type = { equals: tenement_type };
    }
  
    // 樓層的條件添加到 Tenement 表的條件
    if (floor_min !== undefined || floor_max !== undefined) {
      if (floor_min !== undefined) {
        whereClauseCreate.tenement_floor = { gte: parseInt(floor_min) };
      }
      if (floor_max !== undefined) {
        whereClauseCreate.tenement_floor = { ...whereClauseCreate.tenement_floor, lte: parseInt(floor_max) };
      }
    }
  
    // Tenement_Create 表的條件
    if (selling_price_min !== undefined || selling_price_max !== undefined) {
      if (selling_price_min !== undefined) {
        whereClauseCreate.selling_price = { gte: parseInt(selling_price_min) };
      }
      if (selling_price_max !== undefined) {
        whereClauseCreate.selling_price = { ...whereClauseCreate.selling_price, lte: parseInt(selling_price_max) };
      }
    }

    if (rent_price_min !== undefined || rent_price_max !== undefined) {
      if(rent_price_min !== undefined) {
        whereClauseCreate.rent_price = { gte: parseInt(rent_price_min) };
      }
      if(rent_price_max !== undefined) {
        whereClauseCreate.rent_price = { ...whereClauseCreate.rent_price, lte: parseInt(rent_price_max) };
      }
    }
    if(floor_min !== undefined || floor_max !== undefined) {
      if(floor_min !== undefined) {
        whereClauseCreate.tenement_floor = { gte: parseInt(floor_min) };
      }
      if(floor_max !== undefined) {
        whereClauseCreate.tenement_floor = { ...whereClauseCreate.tenement_floor, lte: parseInt(floor_max) };
      }
    }

    if (rent_price_min !== undefined || rent_price_max !== undefined) {
      whereClauseMarketCreate.AND = whereClauseMarketCreate.AND || []; // 确保 AND 子句存在
    
      if (rent_price_min !== undefined) {
        // 记录的最高租金应该大于等于查询的最低租金
        whereClauseMarketCreate.AND.push({ burget_rent_max: { gte: parseInt(rent_price_min) } });
      }
      if (rent_price_max !== undefined) {
        // 记录的最低租金应该小于等于查询的最高租金
        whereClauseMarketCreate.AND.push({ burget_rent_min: { lte: parseInt(rent_price_max) } });
      }
    }

    if (floor_min !== undefined || floor_max !== undefined) {
      whereClauseMarketCreate.AND = whereClauseMarketCreate.AND || []; // 确保 AND 子句存在
      if (floor_min !== undefined) {
        // 记录的最大楼层应该大于等于查询的最小楼层
        whereClauseMarketCreate.AND.push({ hopefloor_max: { gte: parseInt(floor_min) } });
      }
      if (floor_max !== undefined) {
        // 记录的最小楼层应该小于等于查询的最大楼层
        whereClauseMarketCreate.AND.push({ hopefloor_min: { lte: parseInt(floor_max) } });
      }
    }
        whereClauseMarketCreate.AND.push({ is_deleted: isDelete });


    const tenementMarketResults = await this.prisma.tenement_Market.findMany({
      where: whereClauseMarketCreate, // 使用更新后的条件
    });
    
    const tenementResults = await this.prisma.tenement.findMany({
      where: whereClauseTenement, // Tenement 表的條件
    });
    const tenementCreateResults = await this.prisma.tenement_Create.findMany({
      where: whereClauseCreate, // Tenement 表的條件
    });
// 为 Tenement_Market 和 Tenement_Create 创建映射
const marketMap = tenementMarketResults.reduce((acc, market) => {
  acc[market.tenement_id] = market;
  return acc;
}, {});

const createMap = tenementCreateResults.reduce((acc, create) => {
  acc[create.tenement_id] = create;
  return acc;
}, {});

 // 整合并筛选数据
 const filteredMergedData = tenementResults.reduce((acc, tenement) => {
  const market = marketMap[tenement.id];
  const create = createMap[tenement.id];

  // 根据 tenement_type 确定需要检查的字段
  let includeRecord = false; // 默认不包含记录
  let managementFeeBottom = create?.management_fee;
  let tenementFloor=create?.tenement_floor;

  if (tenement.tenement_type === '行銷追蹤' && market) {
    // 检查 Market 相关字段是否未定义
    includeRecord = market.burget_rent_min !== undefined || market.burget_rent_max !== undefined ||
                     market.hopefloor_min !== undefined || market.hopefloor_max !== undefined;
    // 如果 market_rent_price_min 和 market_rent_price_max 都有值，设置 management_fee_bottom 为 0
    if (market.burget_rent_min !== undefined && market.burget_rent_max !== undefined) {
      managementFeeBottom = 0;
      if (market.hopefloor_min >= floor_min && market.hopefloor_max <= floor_max) {
        // 如果 hopefloor_min 和 hopefloor_max 在范围内，tenement_floor 为 hopefloor_min
        tenementFloor = market.hopefloor_min;
      } else if (market.hopefloor_min >= floor_min) {
        // 如果仅 hopefloor_min 在范围内
        tenementFloor = market.hopefloor_min;
      } else if (market.hopefloor_max <= floor_max) {
        // 如果仅 hopefloor_max 在范围内
        tenementFloor = market.hopefloor_max;
      }
      else{
        tenementFloor = market.hopefloor_min;
      }
    }
  } else if (['出售', '出租', '開發追蹤'].includes(tenement.tenement_type) && create) {
    // 检查 Create 相关字段是否未定义
    includeRecord = create.management_fee !== undefined || create.tenement_floor !== undefined;
  }


  if (includeRecord) {
    // 如果记录符合条件，添加到累积器
    acc.push({
      tenement_id: tenement.id,
      tenement_address: tenement.tenement_address,
      tenement_face: tenement.tenement_face,
      tenement_status: tenement.tenement_status,
      tenement_type: tenement.tenement_type,
      tenement_product_type: tenement.tenement_product_type,
      management_fee_bottom: managementFeeBottom,
      tenement_floor:  tenementFloor,
      management_floor_bottom: tenementFloor,
    });
  }

  return acc;
}, []);

return {
  message: 'Successfully retrieved and merged data',
  data: filteredMergedData,
};
 
}
  
  async getFilteredTenementsForUser(
    query,
    userId: number,
    isDelete:boolean
  ): Promise<{message: string,data:any}> {
    const {
      tenement_address,
      tenement_product_type,
      tenement_status,
      tenement_face,
      tenement_type,
      rent_price_min,
      rent_price_max,
      selling_price_min,
      selling_price_max,
      floor_min,
      floor_max,
    } = query;
  
    const whereClauseTenement: any = {}; // 用于 Tenement 表
    const whereClauseCreate: any = {};   // 用于 Tenement_Create 表
    const whereClauseMarketCreate: any = {};   // 用于 Tenement_Market 表
    if (userId) {
      whereClauseTenement.owner = { equals: userId };
    }
    // Tenement 表的條件
    if (tenement_address) {
      whereClauseTenement.tenement_address = { contains: tenement_address };
    }
    if (tenement_product_type) {
      whereClauseTenement.tenement_product_type = { equals: tenement_product_type };
    }
    if (tenement_status) {
      whereClauseTenement.tenement_status = { equals: tenement_status };
    }
    if (tenement_face) {
      whereClauseTenement.tenement_face = { equals: tenement_face };
    }
    if (tenement_type) {
      whereClauseTenement.tenement_type = { equals: tenement_type };
    }
  
    // 樓層的條件添加到 Tenement 表的條件
    if (floor_min !== undefined || floor_max !== undefined) {
      if (floor_min !== undefined) {
        whereClauseCreate.tenement_floor = { gte: parseInt(floor_min) };
      }
      if (floor_max !== undefined) {
        whereClauseCreate.tenement_floor = { ...whereClauseCreate.tenement_floor, lte: parseInt(floor_max) };
      }
    }
  
    // Tenement_Create 表的條件
    if (selling_price_min !== undefined || selling_price_max !== undefined) {
      if (selling_price_min !== undefined) {
        whereClauseCreate.selling_price = { gte: parseInt(selling_price_min) };
      }
      if (selling_price_max !== undefined) {
        whereClauseCreate.selling_price = { ...whereClauseCreate.selling_price, lte: parseInt(selling_price_max) };
      }
    }

    if (rent_price_min !== undefined || rent_price_max !== undefined) {
      if(rent_price_min !== undefined) {
        whereClauseCreate.rent_price = { gte: parseInt(rent_price_min) };
      }
      if(rent_price_max !== undefined) {
        whereClauseCreate.rent_price = { ...whereClauseCreate.rent_price, lte: parseInt(rent_price_max) };
      }
    }
    if(floor_min !== undefined || floor_max !== undefined) {
      if(floor_min !== undefined) {
        whereClauseCreate.tenement_floor = { gte: parseInt(floor_min) };
      }
      if(floor_max !== undefined) {
        whereClauseCreate.tenement_floor = { ...whereClauseCreate.tenement_floor, lte: parseInt(floor_max) };
      }
    }
  
    // Tenement_Market 表的條件
    if (rent_price_min !== undefined || rent_price_max !== undefined) {
      whereClauseMarketCreate.AND = whereClauseMarketCreate.AND || []; // 确保 AND 子句存在
    
      if (rent_price_min !== undefined) {
        // 记录的最高租金应该大于等于查询的最低租金
        whereClauseMarketCreate.AND.push({ burget_rent_max: { gte: parseInt(rent_price_min) } });
      }
      if (rent_price_max !== undefined) {
        // 记录的最低租金应该小于等于查询的最高租金
        whereClauseMarketCreate.AND.push({ burget_rent_min: { lte: parseInt(rent_price_max) } });
      }
    }

    if (floor_min !== undefined || floor_max !== undefined) {
      whereClauseMarketCreate.AND = whereClauseMarketCreate.AND || []; // 确保 AND 子句存在
      if (floor_min !== undefined) {
        // 记录的最大楼层应该大于等于查询的最小楼层
        whereClauseMarketCreate.AND.push({ hopefloor_max: { gte: parseInt(floor_min) } });
      }
      if (floor_max !== undefined) {
        // 记录的最小楼层应该小于等于查询的最大楼层
        whereClauseMarketCreate.AND.push({ hopefloor_min: { lte: parseInt(floor_max) } });
      }
    }
        whereClauseMarketCreate.AND.push({ is_deleted: isDelete });
    
    const tenementMarketResults = await this.prisma.tenement_Market.findMany({
      where: whereClauseMarketCreate, // 使用更新后的条件
    });
    
    const tenementResults = await this.prisma.tenement.findMany({
      where: whereClauseTenement, // Tenement 表的條件
    });
    const tenementCreateResults = await this.prisma.tenement_Create.findMany({
      where: whereClauseCreate, // Tenement 表的條件
    });
// 为 Tenement_Market 和 Tenement_Create 创建映射
const marketMap = tenementMarketResults.reduce((acc, market) => {
  acc[market.tenement_id] = market;
  return acc;
}, {});

const createMap = tenementCreateResults.reduce((acc, create) => {
  acc[create.tenement_id] = create;
  return acc;
}, {});

 // 整合并筛选数据
 const filteredMergedData = tenementResults.reduce((acc, tenement) => {
  const market = marketMap[tenement.id];
  const create = createMap[tenement.id];

  // 根据 tenement_type 确定需要检查的字段
  let includeRecord = false; // 默认不包含记录
  let managementFeeBottom = create?.management_fee;
  let tenementFloor=create?.tenement_floor;




  if (tenement.tenement_type === '行銷追蹤' && market) {
    // 检查 Market 相关字段是否未定义
    includeRecord = market.burget_rent_min !== undefined || market.burget_rent_max !== undefined ||
                     market.hopefloor_min !== undefined || market.hopefloor_max !== undefined;
    // 如果 market_rent_price_min 和 market_rent_price_max 都有值，设置 management_fee_bottom 为 0
    if (market.burget_rent_min !== undefined && market.burget_rent_max !== undefined) {
      managementFeeBottom = 0;
      if (market.hopefloor_min >= floor_min && market.hopefloor_max <= floor_max) {
        // 如果 hopefloor_min 和 hopefloor_max 在范围内，tenement_floor 为 hopefloor_min
        tenementFloor = market.hopefloor_min;
      } else if (market.hopefloor_min >= floor_min) {
        // 如果仅 hopefloor_min 在范围内
        tenementFloor = market.hopefloor_min;
      } else if (market.hopefloor_max <= floor_max) {
        // 如果仅 hopefloor_max 在范围内
        tenementFloor = market.hopefloor_max;
      }
      else{
        tenementFloor = market.hopefloor_min;
      }
    }
  } else if (['出售', '出租', '開發追蹤'].includes(tenement.tenement_type) && create) {
    // 检查 Create 相关字段是否未定义
    includeRecord = create.management_fee !== undefined || create.tenement_floor !== undefined;
  }


  if (includeRecord) {
    // 如果记录符合条件，添加到累积器
    acc.push({
      tenement_id: tenement.id,
      tenement_address: tenement.tenement_address,
      tenement_face: tenement.tenement_face,
      tenement_status: tenement.tenement_status,
      tenement_type: tenement.tenement_type,
      tenement_product_type: tenement.tenement_product_type,
      management_fee_bottom: managementFeeBottom,
      tenement_floor:  tenementFloor,
      management_floor_bottom: tenementFloor,
    });
  }

  return acc;
}, []);

return {
  message: 'Successfully retrieved and merged data',
  data: filteredMergedData,
};
}
  async getFilteredTenementSells(
    isadmin: boolean,
    userId: number,
    query,
  ): Promise<{ message: string; data: GetTenementSellsFilterDto[] }> {
  
    const {
      tenement_address,
      tenement_product_type,
      tenement_status,
      tenement_face,
      tenement_type,
      selling_price_min,
      selling_price_max,
      inside_rating_max,
      inside_rating_min,
      total_rating_max,
      total_rating_min,
      public_building_max,
      public_building_min,
      management_fee_max,
      management_fee_min,
      floor_min,
      floor_max,
    } = query;
  
    const whereClauseTenementCreate: any = {};
    const whereClauseTenement: any = {};
    // 直接关联到 Tenement_Create 的条件
// 如果只提供了最小值
if (selling_price_min !== undefined && selling_price_max === undefined) {
  whereClauseTenementCreate.selling_price = {
    gte: parseFloat(selling_price_min),
  };
}
// 如果只提供了最大值
if (selling_price_min === undefined && selling_price_max !== undefined) {
  whereClauseTenementCreate.selling_price = {
    lte: parseFloat(selling_price_max),
  };
}

// 如果同时提供了最小值和最大值
if (selling_price_min !== undefined && selling_price_max !== undefined) {
  whereClauseTenementCreate.selling_price = {
    gte: parseFloat(selling_price_min),
    lte: parseFloat(selling_price_max),
  };
}
   // 處理樓層範圍
if (floor_min !== undefined && floor_max === undefined) {
  whereClauseTenementCreate.tenement_floor = {
    gte: parseInt(floor_min),
  };
}
if (floor_min === undefined && floor_max !== undefined) {
  whereClauseTenementCreate.tenement_floor = {
    lte: parseInt(floor_max),
  };
}
if (floor_min !== undefined && floor_max !== undefined) {
  whereClauseTenementCreate.tenement_floor = {
    gte: parseInt(floor_min),
    lte: parseInt(floor_max),
  };
}

// 處理內部評級範圍
if (inside_rating_min !== undefined && inside_rating_max === undefined) {
  whereClauseTenementCreate.inside_rating = {
    gte: parseFloat(inside_rating_min),
  };
}
if (inside_rating_min === undefined && inside_rating_max !== undefined) {
  whereClauseTenementCreate.inside_rating = {
    lte: parseFloat(inside_rating_max),
  };
}
if (inside_rating_min !== undefined && inside_rating_max !== undefined) {
  whereClauseTenementCreate.inside_rating = {
    gte: parseFloat(inside_rating_min),
    lte: parseFloat(inside_rating_max),
  };
}

// 處理總評級範圍
if (total_rating_min !== undefined && total_rating_max === undefined) {
  whereClauseTenementCreate.total_rating = {
    gte: parseFloat(total_rating_min),
  };
}
if (total_rating_min === undefined && total_rating_max !== undefined) {
  whereClauseTenementCreate.total_rating = {
    lte: parseFloat(total_rating_max),
  };
}
if (total_rating_min !== undefined && total_rating_max !== undefined) {
  whereClauseTenementCreate.total_rating = {
    gte: parseFloat(total_rating_min),
    lte: parseFloat(total_rating_max),
  };
}

// 處理公共建設範圍
if (public_building_min !== undefined && public_building_max === undefined) {
  whereClauseTenementCreate.public_building = {
    gte: parseFloat(public_building_min),
  };
}
if (public_building_min === undefined && public_building_max !== undefined) {
  whereClauseTenementCreate.public_building = {
    lte: parseFloat(public_building_max),
  };
}
if (public_building_min !== undefined && public_building_max !== undefined) {
  whereClauseTenementCreate.public_building = {
    gte: parseFloat(public_building_min),
    lte: parseFloat(public_building_max),
  };
}

// 處理管理費範圍
if (management_fee_min !== undefined && management_fee_max === undefined) {
  whereClauseTenementCreate.management_fee = {
    gte: parseFloat(management_fee_min),
  };
}
if (management_fee_min === undefined && management_fee_max !== undefined) {
  whereClauseTenementCreate.management_fee = {
    lte: parseFloat(management_fee_max),
  };
}
if (management_fee_min !== undefined && management_fee_max !== undefined) {
  whereClauseTenementCreate.management_fee = {
    gte: parseFloat(management_fee_min),
    lte: parseFloat(management_fee_max),
  };
}

    // 关联到 Tenement 的条件
    if (tenement_address) {
      whereClauseTenement.tenement_address = { contains: tenement_address };
    }
    if (tenement_product_type) {
      whereClauseTenement.tenement_product_type = { equals: tenement_product_type };
    }
    if (tenement_status) {
      whereClauseTenement.tenement_status = { equals: tenement_status };
    }
    if (tenement_face) {
      whereClauseTenement.tenement_face = { equals: tenement_face };
    }
    if (tenement_type) {
      whereClauseTenement.tenement_type = { equals: tenement_type };
    }
  
    // 如果用户不是管理员，添加用户ID过滤条件
    if (!isadmin) {
      whereClauseTenement.owner = userId;
      whereClauseTenement.is_deleted = false;
    }
  
    try {
      const tenementSells = await this.prisma.tenement_Sell.findMany({
        where: {
          AND: [
            { Tenement_Create: whereClauseTenementCreate },
            { Tenement_Create: { Tenement: whereClauseTenement } }
          ],
        },
        include: {
          Tenement_Create: {
            include: {
              Tenement: true,
            },
          },
        },
      });
      console.log(tenementSells)
      const data = tenementSells.map(sell => ({
        tenement_id: sell.tenement_id,
        tenement_address: sell.Tenement_Create.Tenement.tenement_address,
        tenement_face: sell.Tenement_Create.Tenement.tenement_face,
        tenement_status: sell.Tenement_Create.Tenement.tenement_status,
        tenement_type: sell.Tenement_Create.Tenement.tenement_type,
        tenement_product_type: sell.Tenement_Create.Tenement.tenement_product_type,
        management_fee_bottom: sell.Tenement_Create.management_fee, 
        tenement_floor: sell.Tenement_Create.tenement_floor,
        selling_price: sell.Tenement_Create.selling_price,
        Total_rating: sell.Tenement_Create.total_rating,
        inside_rating: sell.Tenement_Create.inside_rating,
        public_building: sell.Tenement_Create.public_building,
      }));
      console.log(data,132)
      return { message: 'Successfully retrieved tenement sells', data };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  
  }
  
  async getFilteredTenementRents(
    isadmin: boolean,
    userId: number,
    query,
  ): Promise<{ message: string; data: TenementRentQueryDto[] }> {
    
    const {
      tenement_address,
      tenement_product_type,
      tenement_status,
      tenement_face,
      tenement_type,
      rent_price_min,
      rent_price_max,
      inside_rating_min,
      inside_rating_max,
      floor_min,
      floor_max,
      total_rating_min,
      total_rating_max,
      public_building_min,
      public_building_max,
      management_fee_min,
      management_fee_max,
    } = query;
  
    const whereClauseTenementCreate: any = {};
    const whereClauseTenement: any = {};
  
    // 构建Tenement_Create筛选条件
    if (rent_price_min !== undefined && rent_price_max === undefined) {
      whereClauseTenementCreate.rent_price = {
        gte: parseFloat(rent_price_min),
      };
    }
    if (rent_price_min === undefined && rent_price_max !== undefined) {
      whereClauseTenementCreate.rent_price = {
        lte: parseFloat(rent_price_max),
      };
    }
    if (rent_price_min !== undefined && rent_price_max !== undefined) {
      whereClauseTenementCreate.rent_price = {
        gte: parseFloat(rent_price_min),
        lte: parseFloat(rent_price_max),
      };
    }
    if (floor_min !== undefined || floor_max !== undefined) {
      whereClauseTenementCreate.tenement_floor = {};
      if (floor_min !== undefined) {
        whereClauseTenementCreate.tenement_floor.gte = parseInt(floor_min);
      }
      if (floor_max !== undefined) {
        whereClauseTenementCreate.tenement_floor.lte = parseInt(floor_max);
      }
    }


    if (total_rating_min !== undefined || total_rating_max !== undefined) {
      whereClauseTenementCreate.total_rating = {};
      if (total_rating_min !== undefined) {
        whereClauseTenementCreate.total_rating.gte = parseFloat(total_rating_min);
      }
      if (total_rating_max !== undefined) {
        whereClauseTenementCreate.total_rating.lte = parseFloat(total_rating_max);
      }
    }

if (public_building_min !== undefined || public_building_max !== undefined) {
  whereClauseTenementCreate.public_building = {};
  if (public_building_min !== undefined) {
    whereClauseTenementCreate.public_building.gte = parseFloat(public_building_min);
  }
  if (public_building_max !== undefined) {
    whereClauseTenementCreate.public_building.lte = parseFloat(public_building_max);
  }
}

if (inside_rating_min !== undefined || inside_rating_max !== undefined) {
  whereClauseTenementCreate.inside_rating = {};
  if (inside_rating_min !== undefined) {
    whereClauseTenementCreate.inside_rating.gte = parseFloat(inside_rating_min);
  }
  if (inside_rating_max !== undefined) {
    whereClauseTenementCreate.inside_rating.lte = parseFloat(inside_rating_max);
  }
}

if (management_fee_min !== undefined || management_fee_max !== undefined) {
  whereClauseTenementCreate.management_fee = {};
  if (management_fee_min !== undefined) {
    whereClauseTenementCreate.management_fee.gte = parseFloat(management_fee_min);
  }
  if (management_fee_max !== undefined) {
    whereClauseTenementCreate.management_fee.lte = parseFloat(management_fee_max);
}
}

// 构建Tenement筛选条件
if (tenement_address) {
  whereClauseTenement.tenement_address = { contains: tenement_address };
}
if (tenement_product_type) {
  whereClauseTenement.tenement_product_type = { equals: tenement_product_type };
}
if (tenement_status) {
  whereClauseTenement.tenement_status = { equals: tenement_status };
}
if (tenement_face) {
  whereClauseTenement.tenement_face = { equals: tenement_face };
}
if (tenement_type) {
  whereClauseTenement.tenement_type = { equals: tenement_type };
}

// 非管理员条件
if (!isadmin) {
  whereClauseTenement.owner = userId;
  whereClauseTenement.is_deleted = false;
}


try {
  const tenementRents = await this.prisma.tenement_Rent.findMany({
    where: {
      AND: [
        { Tenement_Create: whereClauseTenementCreate },
        { Tenement_Create: { Tenement: whereClauseTenement } },
      ],
    },
    include: {
      Tenement_Create: {
        include: {
          Tenement: true,
        },
      },
    },
  });

  const data = tenementRents.map(rent => ({
    tenement_id: rent.tenement_id,
    tenement_address: rent.Tenement_Create.Tenement.tenement_address,
    tenement_face: rent.Tenement_Create.Tenement.tenement_face,
    tenement_status: rent.Tenement_Create.Tenement.tenement_status,
    tenement_type: rent.Tenement_Create.Tenement.tenement_type,
    tenement_product_type: rent.Tenement_Create.Tenement.tenement_product_type,
    management_fee_bottom: rent.Tenement_Create.management_fee,
    management_floor_bottom: rent.Tenement_Create.tenement_floor,
    tenement_floor: rent.Tenement_Create.tenement_floor,
    rent: rent.Tenement_Create.rent_price,
    Total_rating: rent.Tenement_Create.total_rating,
    inside_rating: rent.Tenement_Create.inside_rating,
    public_building: rent.Tenement_Create.public_building,
  }));
 
  return { message: 'Successfully retrieved tenement rents', data };
} catch (error) {
  throw new Error('Unable to fetch tenement rents due to an error: ' + error.message);
}

}

async rollbackDeleteTenement(tenementId: number, tenementType: string): Promise<{ message: string }> {
  const type = tenementType.toLowerCase();
  switch (type) {
    
    case 'rent':
      await this.prisma.tenement_Rent.updateMany({
        where: {
          tenement_id: tenementId,
          is_true_deleted: false,
        },
        data: {
          is_true_deleted : true,
        },
      });
      break;
    case 'sell':
      await this.prisma.tenement_Sell.updateMany({
        where: {
          tenement_id: tenementId,
          is_true_deleted: false,
        },
        data: {
          is_true_deleted: true,
        },
      });
      break;
    case 'develop':
      await this.prisma.tenement_Develop.updateMany({
        where: {
          tenement_id: tenementId,
          is_true_deleted: false,
        },
        data: {
          is_true_deleted: true,
        },
      });
      break;
    case 'market':
      await this.prisma.tenement_Market.updateMany({
        where: {
          tenement_id: tenementId,
          is_true_deleted: false,
        },
        data: {
          is_true_deleted: true,
        },
      });
      break;
    default:
      throw new BadRequestException('Invalid tenement type');
  }
  return { message: `Tenement ${tenementType} rollback deletion successful` };
}
}