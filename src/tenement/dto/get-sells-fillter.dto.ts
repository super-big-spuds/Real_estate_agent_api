/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTenementSellsFilterDto {
  @ApiPropertyOptional({
    description: 'Address of the tenement',
    required: false,
  })
  tenement_address?: string;

  @ApiPropertyOptional({
    description: 'Product type of the tenement',
    required: false,
  })
  tenement_product_type?: string;

  @ApiPropertyOptional({
    description: 'Status of the tenement',
    required: false,
  })
  tenement_status?: string;

  @ApiPropertyOptional({ description: 'Face of the tenement', required: false })
  tenement_face?: string;

  @ApiPropertyOptional({ description: 'Type of the tenement', required: false })
  tenement_type?: string;

  @ApiPropertyOptional({
    description: 'Minimum selling price of the tenement',
    required: false,
  })
  selling_price_min?: number;

  @ApiPropertyOptional({
    description: 'Maximum selling price of the tenement',
    required: false,
  })
  selling_price_max?: number;

  @ApiPropertyOptional({
    description: 'Minimum total rating of the tenement',
    required: false,
  })
  total_rating_min?: number;

  @ApiPropertyOptional({
    description: 'Maximum inside rating of the tenement',
    required: false,
  })
  inside_rating_max?: number;

  @ApiPropertyOptional({
    description: 'Minimum public building area of the tenement',
    required: false,
  })
  public_building_min?: number;

  @ApiPropertyOptional({
    description: 'Maximum public building area of the tenement',
    required: false,
  })
  public_building_max?: number;

  @ApiPropertyOptional({
    description: 'Minimum management fee of the tenement',
    required: false,
  })
  management_fee_min?: number;

  @ApiPropertyOptional({
    description: 'Maximum management fee of the tenement',
    required: false,
  })
  management_fee_max?: number;

  @ApiPropertyOptional({
    description: 'Minimum floor of the tenement',
    required: false,
  })
  floor_min?: number;

  @ApiPropertyOptional({
    description: 'Maximum floor of the tenement',
    required: false,
  })
  floor_max?: number;
}
