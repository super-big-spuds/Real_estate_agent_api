/* eslint-disable prettier/prettier */
export interface WhereClause {
  tenement_address?: { contains: string };
  tenement_product_type?: { equals: string };
  tenement_status?: { equals: string };
  tenement_face?: { equals: string };
  tenement_type?: { equals: string };
  selling_price?: { gte: number; lte: number };
  rent_price?: { gte: number; lte: number };
  tenement_floor?: { gte: number; lte: number };
  owner?: { equals: number };
}
