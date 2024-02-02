/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class GetTenementsFilterDto {
  @IsOptional()
  @IsString()
  tenement_address?: string;

  @IsOptional()
  @IsString()
  tenement_product_type?: string;

  @IsOptional()
  @IsString()
  tenement_status?: string;

  @IsOptional()
  @IsString()
  tenement_face?: string;

  @IsOptional()
  @IsString()
  tenement_type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rent_price_min?: number;

  @IsOptional()
  @IsNumber()
  @Max(99999999)
  rent_price_max?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  selling_price_min?: number;

  @IsOptional()
  @IsNumber()
  @Max(99999999)
  selling_price_max?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  floor_min?: number;

  @IsOptional()
  @IsNumber()
  @Max(999)
  floor_max?: number;
}
