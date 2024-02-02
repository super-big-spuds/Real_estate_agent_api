import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// CreateCollectionNoticeDto
export class CreateCollectionNoticeDto {
  @IsInt()
  @ApiProperty({ example: 1, description: 'Collection ID' })
  readonly collection_id: number;

  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Visit Date' })
  readonly visitDate: string;

  @IsString()
  @ApiProperty({ example: 'Meeting notes', description: 'Record' })
  readonly record: string;

  @IsString()
  @ApiProperty({ example: '2024-01-30', description: 'Remind Date' })
  readonly remindDate: string;

  @IsString()
  @ApiProperty({ example: 'Reminder message', description: 'Remind' })
  readonly remind: string;

  isNew?: boolean;
}
// UpdateCollectionNoticeDto
export class UpdateCollectionNoticeDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Visit Date' })
  readonly visitDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Meeting notes', description: 'Record' })
  readonly record?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-30', description: 'Remind Date' })
  readonly remindDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Reminder message', description: 'Remind' })
  readonly remind?: string;

  isNew?: boolean;
}

export class CreateTenementNoticeDto {
  @IsInt()
  @ApiProperty({ example: 1, description: 'Tenement ID' })
  readonly tenement_id: number;

  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Visit Date' })
  readonly visitDate: string;

  @IsString()
  @ApiProperty({ example: 'Meeting notes', description: 'Record' })
  readonly record: string;

  @IsString()
  @ApiProperty({ example: '2024-01-30', description: 'Remind Date' })
  readonly remindDate: string;

  @IsString()
  @ApiProperty({ example: 'Reminder message', description: 'Remind' })
  readonly remind: string;

  @IsString()
  @ApiProperty({ example: 'Type', description: 'Type' })
  readonly type: string;

  @IsInt()
  @ApiProperty({ example: 1, description: 'Owner ID' })
  readonly owner: number;

  isNew?: boolean;
}

// UpdateTenementNoticeDto
export class UpdateTenementNoticeDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Visit Date' })
  readonly visitDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Meeting notes', description: 'Record' })
  readonly record?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-30', description: 'Remind Date' })
  readonly remindDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Reminder message', description: 'Remind' })
  readonly remind?: string;

  readonly isNew?: boolean;
}

export class NoticeDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1, description: 'Collection ID' })
  readonly collection_id?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1, description: 'Tenement ID' })
  readonly tenement_id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-28', description: 'Visit Date' })
  readonly visitDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Meeting notes', description: 'Record' })
  readonly record?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-01-30', description: 'Remind Date' })
  readonly remindDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Reminder message', description: 'Remind' })
  readonly remind?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Type', description: 'Type' })
  readonly type?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1, description: 'Owner ID' })
  readonly owner?: number;
}
