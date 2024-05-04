import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const categories = await this.prismaService.categories.findMany({
      select: { id: true, name: true, image_url: true, day_shift: true },
    });
    return categories;
  }

  async create(data: CreateCategoryDto) {
    const confilctErrorCode = 'P2002';

    //I decided to carry out the validation this way, as fewer requests are made to the database
    try {
      return await this.prismaService.categories.create({
        data,
      });
    } catch (error) {
      if (error.code === confilctErrorCode) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }
}