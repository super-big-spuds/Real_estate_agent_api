/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class CreateTenementMarketDto {
  // Tenement 的字段
  @ApiProperty({ example: '123 Main St', description: 'Tenement address' })
  tenement_address: string;

  @ApiProperty({ example: 'Residential', description: 'Tenement product type' })
  tenement_product_type: string;

  @ApiProperty({ example: 'Apartment', description: 'Tenement type' })
  tenement_type: string;

  @ApiProperty({ example: 'North', description: 'Tenement face' })
  tenement_face: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], description: 'Tenement images' })
  tenement_images: string[];

  @ApiProperty({ example: 'Occupied', description: 'Tenement status' })
  tenement_status: string;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 1, description: 'Owner ID' })
  owner: number;

  // Tenement_Market 的字段
  @ApiProperty({ example: 'John Doe', description: 'Tenement host name' })
  tenement_host_name: string;

  @ApiProperty({ example: '123-456-7890', description: 'Tenement host telephone' })
  tenement_host_telphone: string;

  @ApiProperty({ example: '987-654-3210', description: 'Tenement host phone' })
  tenement_host_phone: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Tenement host line' })
  tenement_host_line: string;

  @ApiProperty({ example: 'Bank of America', description: 'Tenement host remittance bank' })
  tenement_host_remittance_bank: string;

  @ApiProperty({ example: '1234567890', description: 'Tenement host remittance account' })
  tenement_host_remittance_account: string;

  @ApiProperty({ example: '456 Elm St', description: 'Tenement host address' })
  tenement_host_address: string;

  @ApiProperty({ example: '1985-01-15', description: 'Tenement host birthday' })
  tenement_host_birthday: string;

  @ApiProperty({ example: 'Hiking, Reading', description: 'Tenement host hobby' })
  tenement_host_hobby: string;

  @ApiProperty({ example: 'Additional remarks about the host', description: 'Tenement host remark' })
  tenement_host_remark: string;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 500, description: 'Tenement area maximum' })
  tenement_area_max: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 100, description: 'Tenement area minimum' })
  tenement_area_min: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 2000, description: 'Budget rent maximum' })
  burget_rent_max: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 1000, description: 'Budget rent minimum' })
  burget_rent_min:number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 15, description: 'Hope floor maximum' })
  hopefloor_max: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({ example:5, description: 'Hope floor minimum' })
  hopefloor_min: number;

  @ApiProperty({ example: 'Active', description: 'Market state' })
  market_state: string;

  @ApiProperty({ example: 'Active', description: 'Market state' ,required:false})
  tenement_id: number;
}
