import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  getNextOpenAt,
  isRestaurantOpen,
} from '../common/utils/business-hours.util';
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

// maxPrice 필터 시 "한 끼 가격" 으로 카운트하면 안 되는 카테고리.
// 음료/주류/사이드/토핑/추가/사리/소스 류는 본 메뉴가 아니므로 가격 매칭에서 제외.
// 시드 통일 후 canonical 이름만 남아도, 과거 데이터 재시드 전까지는 변형도 함께 가지고 있어야 함.
// 예: "5,000원 이하" 필터 시 음료 2,000원짜리로 식당이 매칭되는 문제 방지.
//
// 카페 메뉴 (COFFEE/TEA/HERBAL TEA/커피/디카페인/라떼·논커피/스무디/에이드/티·차/밀크티) 는
// 카페의 본 메뉴이므로 제외하지 않는다.
const EXCLUDED_PRICE_CATEGORIES: string[] = [
  // 음료 (시드 통일 후 canonical: '음료' / '음료·주류')
  '음료', '음료·주류',
  // 비-카페 음료 변형 (오쎄·커피는기억의끌림 등 카페에서는 본 메뉴지만,
  // 일반 식당에서 곁들이 음료로 잡혀있어도 가격 필터에서 제외)
  'SOFT DRINK', 'JUICE', 'COCKTAIL', 'JUICE·ADE·ALCOHOL',
  // 주류 — 시드에 '주류' 단일로 통일된 항목 + 기존 변형
  '주류', '맥주', '소주', '병맥주', '청하·매화수', '양주 1샷', '양주 보틀',
  '기타 주류', '고량주',
  // 사이드 (canonical: '사이드')
  '사이드', '사이드·추가', '식사·사이드', '사이드·아이스티',
  // 토핑 (canonical: '토핑')
  '토핑', '토핑 (아이스크림·기타)', '토핑 소스',
  // 추가·사리 (canonical: '추가' / '사리')
  '추가', '사리',
  // 시드 미통일 환경(legacy DB) 대비 — 재시드 전까지 안전망
  '음료수', '소스·음료', '마실거리', '주류·음료', 'BEER·주류', '주류·추가',
  '사이드메뉴', 'SIDE', '토핑 추가', '추가토핑',
  '추가 메뉴', '추가메뉴', '추가옵션', '옵션·추가', '세트 추가',
  '사리·추가', '사리/추가', '사리추가',
];

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
  coverImageUrl: true,
  externalMenuUrl: true,
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
      priceOptions: true,
      category: true,
      imageUrl: true,
      isSignature: true,
    },
    // 입력 순서(첫 메뉴 = 대표) 보존. Python import 시 clock_timestamp() 로 row 마다
    // createdAt 미세 차이를 주므로 정렬 가능.
    orderBy: { createdAt: 'asc' as const },
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
  coverImageUrl: true,
  externalMenuUrl: true,
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
      priceOptions: true,
      category: true,
      imageUrl: true,
      isSignature: true,
    },
    // 입력 순서 보존 — MenuList 카테고리 탭과 일관
    orderBy: { createdAt: 'asc' as const },
  },
  ...PARTNERSHIPS_SELECT,
} satisfies Prisma.RestaurantSelect;

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRestaurantDto) {
    const where: Prisma.RestaurantWhereInput = {};

    if (query.zones?.length) where.zone = { in: query.zones };
    if (query.isPartner !== undefined) where.isPartner = query.isPartner;
    if (query.categoryIds?.length) {
      where.categories = {
        some: { categoryId: { in: query.categoryIds } },
      };
    }
    if (query.maxPrice !== undefined) {
      // 음료/주류/사이드/토핑/추가 카테고리는 "한 끼 가격" 으로 인정 안 함.
      // category 가 null (미분류) 인 메뉴는 본 메뉴로 간주 → 포함.
      where.menus = {
        some: {
          price: { lte: query.maxPrice },
          OR: [
            { category: null },
            { category: { notIn: EXCLUDED_PRICE_CATEGORIES } },
          ],
        },
      };
    }

    // 검색어 (q): 식당명 또는 메뉴명 부분일치 (대소문자 무시)
    // Prisma 의 contains + mode insensitive — Postgres ILIKE 와 동일
    const q = query.q?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { menus: { some: { name: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    const rows = await this.prisma.restaurant.findMany({
      where,
      select: RESTAURANT_LIST_SELECT,
      orderBy: { name: 'asc' },
    });

    // 검색어 매칭 시 어느 메뉴 때문에 검색됐는지 보여주기 위해 한 번 더 조회.
    // findAll 의 menus.select 는 take:1 (대표 메뉴) 라 별도 쿼리 필요.
    // 매칭 식당이 적을 거라 N+1 부담은 작지만, 한 방에 받아오기 위해 findMany 로 정리.
    let menuMatches = new Map<string, { id: string; name: string; price: number }[]>();
    if (q && rows.length > 0) {
      const matched = await this.prisma.menu.findMany({
        where: {
          restaurantId: { in: rows.map((r) => r.id) },
          name: { contains: q, mode: 'insensitive' },
        },
        select: { id: true, name: true, price: true, restaurantId: true },
        orderBy: { price: 'asc' },
        take: 200, // 안전장치
      });
      menuMatches = matched.reduce((acc, m) => {
        const list = acc.get(m.restaurantId) ?? [];
        if (list.length < 3) list.push({ id: m.id, name: m.name, price: m.price });
        acc.set(m.restaurantId, list);
        return acc;
      }, new Map<string, { id: string; name: string; price: number }[]>());
    }

    const result = rows.map((r) => {
      const open = isRestaurantOpen(r.businessHours);
      return {
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
        isOpen: open,
        nextOpenAt: open ? null : getNextOpenAt(r.businessHours),
        categories: r.categories.map((rc) => rc.category),
        featuredMenu: r.menus[0] ?? null,
        // 검색 결과 카드에 "이 메뉴 때문에 매칭됐어요" 표시용. q 없으면 빈 배열.
        matchedMenus: menuMatches.get(r.id) ?? [],
      };
    });

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

    const open = isRestaurantOpen(restaurant.businessHours);
    return {
      ...restaurant,
      isOpen: open,
      nextOpenAt: open ? null : getNextOpenAt(restaurant.businessHours),
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
