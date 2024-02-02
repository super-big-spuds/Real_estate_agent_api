// src/collection/collection.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateCollectionDto, CollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async getCollectionById(id: number): Promise<{ message: string; data: any }> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id },
        include: {
          Collection_Notice: true, // 包括关联的通知信息
        },
      });

      if (!collection) {
        throw new NotFoundException('Collection not found.');
      }

      const data = this.formatCollectionData(collection);
      return { message: 'Successfully get the media', data };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the collection.',
      );
    }
  }

  async getCollectionByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<{ message: string; data: any }> {
    try {
      const collection = await this.prisma.collection.findFirst({
        where: {
          id,
          owner: userId,
          is_deleted: false,
        },
        include: {
          Collection_Notice: true,
        },
      });

      if (!collection) {
        throw new NotFoundException('Collection not found.');
      }

      const data = this.formatCollectionData(collection);
      return { message: 'Successfully get the media', data };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the collection.',
      );
    }
  }

  private formatCollectionData(
    collection: Prisma.CollectionGetPayload<{
      include: { Collection_Notice: true };
    }>,
  ): any {
    return {
      tenement_address: collection.tenement_no,
      collection_name: collection.collection_name,
      collection_type: collection.collection_type,
      price: collection.price,
      payment: collection.payment,
      collection_remark: collection.collection_remark,
      collection_date: collection.collection_date,
      remittance_bank: collection.remittance_bank,
      remittance_account: collection.remittance_account,
      cus_remittance_bank: collection.cus_remittance_bank,
      cus_remittance_account: collection.cus_remittance_account,
      collection_complete: collection.collection_complete,
      notices: collection.Collection_Notice.map((notice) => ({
        id: notice.id,
        visitDate: notice.visitDate,
        record: notice.record,
        remindDate: notice.remindDate,
        remind: notice.remind,
      })),
    };
  }

  async getAllCollections(): Promise<{
    message: string;
    data: CollectionDto[];
  }> {
    try {
      const collections = await this.prisma.collection.findMany();
      const data = collections.map((collection) => ({
        collection_name: collection.collection_name,
        tenement_address: collection.tenement_no,
        collection_type: collection.collection_type,
        price: collection.price,
        collection_id: collection.id,
      }));
      return { message: 'Successfully get the media', data };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving collections.',
      );
    }
  }

  async getCollectionsByUserId(
    userId: number,
  ): Promise<{ message: string; data: CollectionDto[] }> {
    try {
      const collections = await this.prisma.collection.findMany({
        where: {
          owner: userId,
          is_deleted: false,
        },
      });
      const data = collections.map((collection) => ({
        collection_name: collection.collection_name,
        tenement_address: collection.tenement_no,
        collection_type: collection.collection_type,
        price: collection.price,
        collection_id: collection.id,
      }));
      return { message: 'Successfully get the media', data };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving user-specific collections.',
      );
    }
  }

  async createCollection(collectionData: Prisma.CollectionCreateInput) {
    try {
      const newCollection = await this.prisma.collection.create({
        data: {
          ...collectionData,
          is_deleted: false,
        },
      });
      return newCollection;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the collection.',
      );
    }
  }

  async updateCollection(
    id: number,
    collectionData: UpdateCollectionDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.collection.update({
        where: { id },
        data: collectionData,
      });
      return { message: 'Successfully update the media' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the collection.',
      );
    }
  }

  async deleteCollection(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.collection.update({
        where: { id },
        data: { is_deleted: true },
      });
      return { message: 'Successfully delete the media' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the collection.',
      );
    }
  }
}
