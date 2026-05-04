import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // /categories 는 변경 빈도가 매우 낮으므로 5분 메모리 캐시.
  // CacheInterceptor 가 NestJS DI 와 Reflector 충돌이 있어 서비스에서 직접 처리.
  private static readonly LIST_KEY = 'categories:all';
  private static readonly ITEM_KEY = (id: string) => `categories:${id}`;
  private static readonly TTL_MS = 5 * 60 * 1000;

  private async invalidateCache(id?: string) {
    await this.cache.del(CategoriesService.LIST_KEY);
    if (id) {
      await this.cache.del(CategoriesService.ITEM_KEY(id));
    }
  }

  async findAll() {
    const cached = await this.cache.get<Array<{ id: string; name: string; icon: string | null }>>(
      CategoriesService.LIST_KEY,
    );
    if (cached) return cached;

    const list = await this.prisma.category.findMany({
      select: { id: true, name: true, icon: true },
      orderBy: { name: 'asc' },
    });
    await this.cache.set(CategoriesService.LIST_KEY, list, CategoriesService.TTL_MS);
    return list;
  }

  async findOne(id: string) {
    const cached = await this.cache.get<{ id: string; name: string; icon: string | null }>(
      CategoriesService.ITEM_KEY(id),
    );
    if (cached) return cached;

    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, icon: true },
    });
    if (!category) {
      throw new NotFoundException(`카테고리를 찾을 수 없어요 (id: ${id})`);
    }
    await this.cache.set(CategoriesService.ITEM_KEY(id), category, CategoriesService.TTL_MS);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`이미 존재하는 카테고리 이름이에요: ${dto.name}`);
    }
    const created = await this.prisma.category.create({
      data: dto,
      select: { id: true, name: true, icon: true },
    });
    await this.invalidateCache();
    return created;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.category.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`이미 존재하는 카테고리 이름이에요: ${dto.name}`);
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, icon: true },
    });
    await this.invalidateCache(id);
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.category.delete({ where: { id } });
    await this.invalidateCache(id);
  }
}
