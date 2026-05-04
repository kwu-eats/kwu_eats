import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { isRestaurantOpen } from '../common/utils/business-hours.util';
import { PrismaService } from '../prisma/prisma.service';

import { CreateRestaurantDto, PartnershipInputDto } from './dto/create-restaurant.dto';
import { QueryRestaurantDto } from './dto/query-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

const PARTNERSHIPS_SELECT = {
  partnerships: {
    select: { id: true, college: true, instagramUrl: true },
    orderBy: { college: 'asc' as const },
  },
};

const RESTAURANT_LIST_SELECT = {
  id: true,
  name: true,
  zone: true,
  latitude: true,
  longitude: true,
  address: true,
  phone: true,
  businessHours: true,
  isPartner: true,
  categories: {
    select: {
      category: { select: { id: true, name: true, icon: true } },
    },
  },
  menus: {
    select: { id: true, name: true, price: true, imageUrl: true, isSignature: true },
    orderBy: [
      { isSignature: 'desc' as const },
      { price: 'asc' as const },
    ],
    take: 1,
  },
  ...PARTNERSHIPS_SELECT,
} satisfies Prisma.RestaurantSelect;

const RESTAURANT_DETAIL_SELECT = {
  id: true,
  name: true,
  zone: true,
  latitude: true,
  longitude: true,
  address: true,
  phone: true,
  businessHours: true,
  isPartner: true,
  createdAt: true,
  updatedAt: true,
  categories: {
    select: {
      category: { select: { id: true, name: true, icon: true } },
    },
  },
  menus: {
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      isSignature: true,
    },
    orderBy: [
      { isSignature: 'desc' as const },
      { price: 'asc' as const },
    ],
  },
  ...PARTNERSHIPS_SELECT,
} satisfies Prisma.RestaurantSelect;

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRestaurantDto) {
    const where: Prisma.RestaurantWhereInput = {};

    if (query.zone) where.zone = query.zone;
    if (query.isPartner !== undefined) where.isPartner = query.isPartner;
    if (query.categoryId) {
      where.categories = { some: { categoryId: query.categoryId } };
    }
    if (query.maxPrice !== undefined) {
      where.menus = { some: { price: { lte: query.maxPrice } } };
    }

    const rows = await this.prisma.restaurant.findMany({
      where,
      select: RESTAURANT_LIST_SELECT,
      orderBy: { name: 'asc' },
    });

    const result = rows.map((r) => ({
      id: r.id,
      name: r.name,
      zone: r.zone,
      latitude: r.latitude,
      longitude: r.longitude,
      address: r.address,
      phone: r.phone,
      businessHours: r.businessHours,
      isPartner: r.isPartner,
      partnerships: r.partnerships,
      isOpen: isRestaurantOpen(r.businessHours),
      categories: r.categories.map((rc) => rc.category),
      featuredMenu: r.menus[0] ?? null,
    }));

    if (query.isOpen !== undefined) {
      return result.filter((r) => r.isOpen === query.isOpen);
    }

    return result;
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: RESTAURANT_DETAIL_SELECT,
    });

    if (!restaurant) {
      throw new NotFoundException(`식당을 찾을 수 없어요 (id: ${id})`);
    }

    return {
      ...restaurant,
      isOpen: isRestaurantOpen(restaurant.businessHours),
      categories: restaurant.categories.map((rc) => rc.category),
    };
  }

  async create(dto: CreateRestaurantDto) {
    const { categoryIds, businessHours, partnerships, ...data } = dto;

    if (categoryIds?.length) {
      await this.assertCategoriesExist(categoryIds);
    }

    return this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          ...data,
          businessHours: businessHours as Prisma.InputJsonValue,
        },
        select: RESTAURANT_DETAIL_SELECT,
      });

      if (categoryIds?.length) {
        await tx.restaurantCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            restaurantId: restaurant.id,
            categoryId,
          })),
        });
      }

      if (partnerships?.length) {
        await tx.restaurantPartnership.createMany({
          data: partnerships.map((p) => ({
            restaurantId: restaurant.id,
            college: p.college,
            instagramUrl: p.instagramUrl,
          })),
        });
      }

      // partnerships / categories 동기화 후 최신 상태 재조회
      return tx.restaurant.findUniqueOrThrow({
        where: { id: restaurant.id },
        select: RESTAURANT_DETAIL_SELECT,
      });
    });
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    await this.findOne(id);

    const { categoryIds, businessHours, partnerships, ...data } = dto;

    if (categoryIds?.length) {
      await this.assertCategoriesExist(categoryIds);
    }

    return this.prisma.$transaction(async (tx) => {
      if (categoryIds !== undefined) {
        await tx.restaurantCategory.deleteMany({ where: { restaurantId: id } });

        if (categoryIds.length) {
          await tx.restaurantCategory.createMany({
            data: categoryIds.map((categoryId) => ({ restaurantId: id, categoryId })),
          });
        }
      }

      // partnerships 가 명시적으로 들어왔을 때만 동기화 (undefined → 변경 없음)
      if (partnerships !== undefined) {
        await tx.restaurantPartnership.deleteMany({ where: { restaurantId: id } });

        if (partnerships.length) {
          await tx.restaurantPartnership.createMany({
            data: partnerships.map((p: PartnershipInputDto) => ({
              restaurantId: id,
              college: p.college,
              instagramUrl: p.instagramUrl,
            })),
          });
        }
      }

      await tx.restaurant.update({
        where: { id },
        data: {
          ...data,
          ...(businessHours !== undefined && {
            businessHours: businessHours as Prisma.InputJsonValue,
          }),
        },
      });

      return tx.restaurant.findUniqueOrThrow({
        where: { id },
        select: RESTAURANT_DETAIL_SELECT,
      });
    });
  }

  private async assertCategoriesExist(categoryIds: string[]) {
    const found = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });

    if (found.length !== categoryIds.length) {
      const foundIds = new Set(found.map((c) => c.id));
      const missing = categoryIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `존재하지 않는 카테고리 ID가 있어요: ${missing.join(', ')}`,
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.restaurant.delete({ where: { id } });
  }
}
