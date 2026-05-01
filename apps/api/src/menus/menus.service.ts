import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

const MENU_SELECT = {
  id: true,
  restaurantId: true,
  name: true,
  price: true,
  imageUrl: true,
  isSignature: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByRestaurant(restaurantId: string) {
    await this.assertRestaurantExists(restaurantId);

    return this.prisma.menu.findMany({
      where: { restaurantId },
      select: MENU_SELECT,
      orderBy: [{ isSignature: 'desc' }, { price: 'asc' }],
    });
  }

  async create(restaurantId: string, dto: CreateMenuDto) {
    await this.assertRestaurantExists(restaurantId);

    return this.prisma.menu.create({
      data: { ...dto, restaurantId },
      select: MENU_SELECT,
    });
  }

  async update(id: string, dto: UpdateMenuDto) {
    await this.assertMenuExists(id);

    return this.prisma.menu.update({
      where: { id },
      data: dto,
      select: MENU_SELECT,
    });
  }

  async remove(id: string) {
    await this.assertMenuExists(id);
    await this.prisma.menu.delete({ where: { id } });
  }

  private async assertRestaurantExists(restaurantId: string) {
    const exists = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`식당을 찾을 수 없어요 (id: ${restaurantId})`);
    }
  }

  private async assertMenuExists(id: string) {
    const exists = await this.prisma.menu.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`메뉴를 찾을 수 없어요 (id: ${id})`);
    }
  }
}
