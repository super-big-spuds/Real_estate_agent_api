/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTenementDevelopDto {
  @ApiProperty({ example: '123 Main St', description: 'Tenement address' })
  tenement_address: string;

  @ApiProperty({ example: 'Residential', description: 'Tenement product type' })
  tenement_product_type: string;

  @ApiProperty({ example: 'Apartment', description: 'Tenement type' })
  tenement_type: string;

  @ApiProperty({ example: 'North', description: 'Tenement face' })
  tenement_face: string;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Tenement images',
  })
  tenement_images: string[];

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 5, description: 'Total rating', type: Number })
  total_rating: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 100, description: 'Main building', type: Number })
  main_building: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 50, description: 'Inside rating', type: Number })
  inside_rating: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 30,
    description: 'Affiliated building',
    type: Number,
  })
  affiliated_building: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 20, description: 'Public building', type: Number })
  public_building: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 10, description: 'Unregistered area', type: Number })
  unregistered_area: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 1.5,
    description: 'Management magnification',
    type: Number,
  })
  management_magnification: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 3000, description: 'Management fee', type: Number })
  management_fee: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 500000, description: 'Selling price', type: Number })
  selling_price: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 20000, description: 'Rent price', type: Number })
  rent_price: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 40000, description: 'Deposit price', type: Number })
  deposit_price: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 7, description: 'Tenement floor', type: Number })
  tenement_floor: number;

  @ApiProperty({ example: 'John Doe', description: 'Tenement host name' })
  tenement_host_name: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Tenement host telephone',
  })
  tenement_host_telphone: string;

  @ApiProperty({ example: '0987654321', description: 'Tenement host phone' })
  tenement_host_phone: string;

  @ApiProperty({ example: 'john_doe', description: 'Tenement host line' })
  tenement_host_line: string;

  @ApiProperty({
    example: 'Bank of America',
    description: 'Tenement host remittance bank',
  })
  tenement_host_remittance_bank: string;

  @ApiProperty({
    example: '9876543210',
    description: 'Tenement host remittance account',
  })
  tenement_host_remittance_account: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Tenement host address',
  })
  tenement_host_address: string;

  @ApiProperty({ example: '1980-01-01', description: 'Tenement host birthday' })
  tenement_host_birthday: string;

  @ApiProperty({ example: 'Reading', description: 'Tenement host hobby' })
  tenement_host_hobby: string;

  @ApiProperty({ example: 'No remarks', description: 'Tenement host remark' })
  tenement_host_remark: string;

  @ApiProperty({ example: 1, description: 'Owner ID', type: Number })
  owner: number;

  @ApiProperty({ example: 'Occupied', description: 'Tenement status' })
  tenement_status: string;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 15, description: 'Tenement ID' })
  tenement_id: number;
}
