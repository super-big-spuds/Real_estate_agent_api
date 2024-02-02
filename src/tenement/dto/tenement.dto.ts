// tenement.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenementDto {
  @ApiProperty({ example: '123 Main St', description: 'Tenement address' })
  tenement_address: string;

  @ApiProperty({ example: 'Residential', description: 'Tenement product type' })
  tenement_product_type: string;

  @ApiProperty({ example: 'Apartment', description: 'Tenement type' })
  tenement_type: string;

  @ApiProperty({ example: 'North', description: 'Tenement face' })
  tenement_face: string;

  @ApiProperty({
    example: 'image1.jpg,image2.jpg',
    description: 'Tenement images',
  })
  tenement_images: string;

  @ApiProperty({ example: 'Occupied', description: 'Tenement status' })
  tenement_status: string;

  @ApiProperty({ example: '5 stars', description: 'Total rating' })
  total_rating: string;

  @ApiProperty({ example: 'Yes', description: 'Main building' })
  main_building: string;

  @ApiProperty({ example: 'No', description: 'Affiliated building' })
  affiliated_building: string;

  @ApiProperty({ example: 'Yes', description: 'Public building' })
  public_building: string;

  @ApiProperty({ example: '50 sqm', description: 'Unregistered area' })
  unregistered_area: string;

  @ApiProperty({ example: '1.5', description: 'Management magnification' })
  management_magnification: string;

  @ApiProperty({ example: '100 USD', description: 'Management fee' })
  management_fee: string;

  @ApiProperty({ example: '10th floor', description: 'Tenement floor' })
  tenement_floor: string;

  @ApiProperty({ example: 'John Doe', description: 'Tenement host name' })
  tenement_host_name: string;

  @ApiProperty({
    example: '123-456-7890',
    description: 'Tenement host telephone',
  })
  tenement_host_telphone: string;

  @ApiProperty({ example: '987-654-3210', description: 'Tenement host phone' })
  tenement_host_phone: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Tenement host line',
  })
  tenement_host_line: string;

  @ApiProperty({
    example: 'Bank of America',
    description: 'Tenement host remittance bank',
  })
  tenement_host_remittance_bank: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Tenement host remittance account',
  })
  tenement_host_remittance_account: string;

  @ApiProperty({ example: '456 Elm St', description: 'Tenement host address' })
  tenement_host_address: string;

  @ApiProperty({ example: '1985-01-15', description: 'Tenement host birthday' })
  tenement_host_birthday: string;

  @ApiProperty({
    example: 'Hiking, Reading',
    description: 'Tenement host hobby',
  })
  tenement_host_hobby: string;

  @ApiProperty({
    example: 'Additional remarks about the host',
    description: 'Tenement host remark',
  })
  tenement_host_remark: string;

  @ApiProperty({ example: 1, description: 'Owner ID' })
  owner: number;

  @ApiProperty({ example: true, description: 'Is deleted' })
  is_deleted: boolean;
}

export class UpdateTenementDto {
  @ApiProperty({ example: '123 Main St', description: 'Tenement address' })
  tenement_address?: string;

  @ApiProperty({ example: 'Residential', description: 'Tenement product type' })
  tenement_product_type?: string;

  @ApiProperty({ example: 'Apartment', description: 'Tenement type' })
  tenement_type?: string;

  @ApiProperty({ example: 'North', description: 'Tenement face' })
  tenement_face?: string;

  @ApiProperty({
    example: 'image1.jpg,image2.jpg',
    description: 'Tenement images',
  })
  tenement_images?: string;

  @ApiProperty({ example: 'Occupied', description: 'Tenement status' })
  tenement_status?: string;

  @ApiProperty({ example: '5 stars', description: 'Total rating' })
  total_rating?: string;

  @ApiProperty({ example: 'Yes', description: 'Main building' })
  main_building?: string;

  @ApiProperty({ example: 'No', description: 'Affiliated building' })
  affiliated_building?: string;

  @ApiProperty({ example: 'Yes', description: 'Public building' })
  public_building?: string;

  @ApiProperty({ example: '50 sqm', description: 'Unregistered area' })
  unregistered_area?: string;

  @ApiProperty({ example: '1.5', description: 'Management magnification' })
  management_magnification?: string;

  @ApiProperty({ example: '100 USD', description: 'Management fee' })
  management_fee?: string;

  @ApiProperty({ example: '10th floor', description: 'Tenement floor' })
  tenement_floor?: string;

  @ApiProperty({ example: 'John Doe', description: 'Tenement host name' })
  tenement_host_name?: string;

  @ApiProperty({
    example: '123-456-7890',
    description: 'Tenement host telephone',
  })
  tenement_host_telphone?: string;

  @ApiProperty({ example: '987-654-3210', description: 'Tenement host phone' })
  tenement_host_phone?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Tenement host line',
  })
  tenement_host_line?: string;

  @ApiProperty({
    example: 'Bank of America',
    description: 'Tenement host remittance bank',
  })
  tenement_host_remittance_bank?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Tenement host remittance account',
  })
  tenement_host_remittance_account?: string;

  @ApiProperty({ example: '456 Elm St', description: 'Tenement host address' })
  tenement_host_address?: string;

  @ApiProperty({ example: '1985-01-15', description: 'Tenement host birthday' })
  tenement_host_birthday?: string;

  @ApiProperty({
    example: 'Hiking, Reading',
    description: 'Tenement host hobby',
  })
  tenement_host_hobby?: string;

  @ApiProperty({
    example: 'Additional remarks about the host',
    description: 'Tenement host remark',
  })
  tenement_host_remark?: string;

  @ApiProperty({ example: 1, description: 'Owner ID' })
  owner?: number;

  @ApiProperty({ example: true, description: 'Is deleted' })
  is_deleted?: boolean;
  // 注意：关联的字段（如 Tenement_Market[]）通常不包含在更新 DTO 中
}
