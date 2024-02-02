/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class TenementQueryDto {
  @ApiProperty({ description: 'Address of the tenement' , required: false})
  tenement_address?: string;

  @ApiProperty({ description: 'Product type of the tenement', required: false })
  tenement_product_type?: string;

  @ApiProperty({ description: 'Status of the tenement', required: false })
  tenement_status?: string;

  @ApiProperty({ description: 'Face of the tenement', required: false })
  tenement_face?: string;

  @ApiProperty({ description: 'Type of the tenement', required: false})
  tenement_type?: string;

  @ApiProperty({ description: 'Minimum selling price of the tenement', required: false })
  selling_price_min?: number;

  @ApiProperty({ description: 'Maximum selling price of the tenement' , required: false})
  selling_price_max?: number;

  @ApiProperty({ description: 'Minimum rent price of the tenement' , required: false})
  rent_price_min?: number;

  @ApiProperty({ description: 'Maximum rent price of the tenement' , required: false})
  rent_price_max?: number;

  @ApiProperty({ description: 'Minimum floor of the tenement', required: false })
  floor_min?: number;

  @ApiProperty({ description: 'Maximum floor of the tenement' , required: false})
  floor_max?: number;
}