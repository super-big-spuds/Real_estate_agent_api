/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDto {
  @IsString()
  @ApiProperty({ example: '123 Main St', description: 'Tenement Number' })
  tenement_no: string;

  @IsString()
  @ApiProperty({ example: 'My Collection', description: 'Collection Name' })
  collection_name: string;

  @IsString()
  @ApiProperty({ example: 'Type', description: 'Collection Type' })
  collection_type: string;

  @IsString()
  @ApiProperty({ example: '1000 USD', description: 'Price' })
  price: string;

  @IsString()
  @ApiProperty({ example: 'Payment Method', description: 'Payment' })
  payment: string;

  @IsString()
  @ApiProperty({
    example: 'Remarks about the collection',
    description: 'Collection Remark',
  })
  collection_remark: string;

  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Collection Date' })
  collection_date: string;

  @IsString()
  @ApiProperty({ example: 'Bank of America', description: 'Remittance Bank' })
  remittance_bank: string;

  @IsString()
  @ApiProperty({ example: '1234567890', description: 'Remittance Account' })
  remittance_account: string;

  @IsString()
  @ApiProperty({
    example: '5678901234',
    description: 'Custom Remittance Account',
  })
  cus_remittance_account: string;

  @IsString()
  @ApiProperty({
    example: 'Wells Fargo',
    description: 'Custom Remittance Bank',
  })
  cus_remittance_bank: string;

  @IsString()
  @ApiProperty({
    example: 'Complete',
    description: 'Collection Completion Status',
  })
  collection_complete: string;

  is_deleted: boolean;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123 Main St', description: 'Tenement Number' })
  tenement_no?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'My Collection', description: 'Collection Name' })
  collection_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Type', description: 'Collection Type' })
  collection_type?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1000 USD', description: 'Price' })
  price?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Payment Method', description: 'Payment' })
  payment?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Remarks about the collection',
    description: 'Collection Remark',
  })
  collection_remark?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Collection Date' })
  collection_date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Bank of America', description: 'Remittance Bank' })
  remittance_bank?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1234567890', description: 'Remittance Account' })
  remittance_account?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '5678901234',
    description: 'Custom Remittance Account',
  })
  cus_remittance_account?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Wells Fargo',
    description: 'Custom Remittance Bank',
  })
  cus_remittance_bank?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Complete',
    description: 'Collection Completion Status',
  })
  collection_complete?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1, description: 'Owner ID' })
  owner?: number;
}

export class CollectionDto {
  @IsString()
  @ApiProperty({ example: 'My Collection', description: 'Collection Name' })
  collection_name: string;

  @IsString()
  @ApiProperty({ example: '123 Main St', description: 'Tenement Address' })
  tenement_address: string;

  @IsString()
  @ApiProperty({ example: 'Type', description: 'Collection Type' })
  collection_type: string;

  @IsString()
  @ApiProperty({ example: '1000 USD', description: 'Price' })
  price: string;

  @IsInt()
  @ApiProperty({ example: 1, description: 'Collection ID' })
  collection_id: number;
}
