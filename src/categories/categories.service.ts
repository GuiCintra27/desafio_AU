import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { prismaErrorCodes } from 'src/utils/prisma-error-codes';
import { Categories } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<{ id: number }[] & CreateCategoryDto[]> {
    const categories = await this.prismaService.categories.findMany({
      select: { id: true, name: true, image_url: true, day_shift: true },
    });
    return categories;
  }

  async create(data: CreateCategoryDto): Promise<Categories> {
    //I decided to carry out the validation this way, as fewer requests are made to the database
    try {
      return await this.prismaService.categories.create({
        data,
      });
    } catch (error) {
      if (error.code === prismaErrorCodes.conflict) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }

  async update(id: number, data: CreateCategoryDto): Promise<void> {
    try {
      await this.prismaService.categories.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === prismaErrorCodes.notFound) {
        throw new NotFoundException('Category not found');
      }

      if (error.code === prismaErrorCodes.conflict) {
        throw new ConflictException('Category already exists');
      }

      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prismaService.categories.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === prismaErrorCodes.notFound) {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }
}