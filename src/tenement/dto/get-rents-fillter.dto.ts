/* eslint-disable prettier/prettier */


import { ApiPropertyOptional } from '@nestjs/swagger';

export class TenementRentQueryDto {
  @ApiPropertyOptional({ description: 'Address of the tenement' })
  tenement_address?: string;

  @ApiPropertyOptional({ description: 'Style of the tenement', enum: ['辦公室', '店面', '套房', '其他'] })
  tenement_product_type?: string;

  @ApiPropertyOptional({ description: 'Status of the tenement', enum: ['已成交', '未成交', '已退租下架', '過戶完成下架'] })
  tenement_status?: string;

  @ApiPropertyOptional({ description: 'Facing of the tenement' }) // 添加具体朝向选项
  tenement_face?: string;

  @ApiPropertyOptional({ description: 'Minimum floor' })
  floor_min?: number;

  @ApiPropertyOptional({ description: 'Maximum floor' })
  floor_max?: number;

  @ApiPropertyOptional({ description: 'Minimum selling price' })
  rent_price_min?: number;

  @ApiPropertyOptional({ description: 'Maximum selling price' })
  rent_price_max?: number;

  @ApiPropertyOptional({ description: 'Minimum management fee' })
  management_fee_min?: number;

  @ApiPropertyOptional({ description: 'Maximum management fee' })
  management_fee_max?: number;

  @ApiPropertyOptional({ description: 'Minimum inside rating' })
  inside_rating_min?: number;

  @ApiPropertyOptional({ description: 'Maximum inside rating' })
  inside_rating_max?: number;

  @ApiPropertyOptional({ description: 'Minimum public building area' })
  public_building_min?: number;

  @ApiPropertyOptional({ description: 'Maximum public building area' })
  public_building_max?: number;

  @ApiPropertyOptional({ description: 'Minimum total rating' })
  total_rating_min?: number;

  @ApiPropertyOptional({ description: 'Maximum total rating' })
  total_rating_max?: number;

  // 您可以根据需要添加更多属性
}