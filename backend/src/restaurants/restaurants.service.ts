import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Category } from './category.entity';
import { Menu } from './menu.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async findAll(maxPrice?: number, minPrice?: number, categories?: string[]): Promise<Restaurant[]> {
    const qb = this.restaurantRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.categories', 'category')
      .leftJoinAndSelect('r.menus', 'menu');

    if (maxPrice !== undefined || minPrice !== undefined) {
      qb.andWhere((qb2) => {
        const sub = qb2
          .subQuery()
          .select('1')
          .from(Menu, 'm')
          .where('m.restaurantId = r.id')
          .andWhere('m.isRepresentative = true');
        if (maxPrice !== undefined) sub.andWhere('m.price <= :maxPrice', { maxPrice });
        if (minPrice !== undefined) sub.andWhere('m.price >= :minPrice', { minPrice });
        return 'EXISTS ' + sub.getQuery();
      });
      if (maxPrice !== undefined) qb.setParameter('maxPrice', maxPrice);
      if (minPrice !== undefined) qb.setParameter('minPrice', minPrice);
    }

    if (categories && categories.length > 0) {
      qb.andWhere('category.name IN (:...categories)', { categories });
    }

    qb.orderBy('r.createdAt', 'DESC');
    return qb.getMany();
  }

  async findRecent(limit = 10): Promise<Restaurant[]> {
    return this.restaurantRepo.find({
      relations: ['categories', 'menus'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findRanking(limit = 10): Promise<Restaurant[]> {
    return this.restaurantRepo.find({
      relations: ['categories', 'menus'],
      order: { likeCount: 'DESC', viewCount: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: ['categories', 'menus'],
    });
    if (!restaurant) throw new NotFoundException(`Restaurant #${id} not found`);
    restaurant.viewCount++;
    return this.restaurantRepo.save(restaurant);
  }

  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const { categories: categoryNames, menus: menuDtos, ...rest } = dto;

    const categories = categoryNames?.length
      ? await this.findOrCreateCategories(categoryNames)
      : [];

    const menus = (menuDtos ?? []).map((m) => this.menuRepo.create(m));

    const restaurant = this.restaurantRepo.create({ ...rest, categories, menus });
    return this.restaurantRepo.save(restaurant);
  }

  async like(id: number): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    restaurant.likeCount++;
    return this.restaurantRepo.save(restaurant);
  }

  private async findOrCreateCategories(names: string[]): Promise<Category[]> {
    const existing = await this.categoryRepo.findBy({ name: In(names) });
    const existingNames = existing.map((c) => c.name);
    const newCategories = names
      .filter((name) => !existingNames.includes(name))
      .map((name) => this.categoryRepo.create({ name }));

    if (newCategories.length > 0) {
      await this.categoryRepo.save(newCategories);
    }
    return [...existing, ...newCategories];
  }

  async seed(): Promise<void> {
    const count = await this.restaurantRepo.count();
    if (count > 0) return;

    const sampleData: CreateRestaurantDto[] = [
      { name: '을지로 국밥집', address: '서울특별시 중구 을지로 100', district: '중구', latitude: 37.5665, longitude: 126.9780, categories: ['한식'], menus: [{ name: '순대국밥', price: 6000, isRepresentative: true }, { name: '내장국밥', price: 6500 }] },
      { name: '광화문 김밥천국', address: '서울특별시 종로구 세종대로 100', district: '종로구', latitude: 37.5759, longitude: 126.9769, categories: ['분식'], menus: [{ name: '참치김밥', price: 4500, isRepresentative: true }, { name: '라볶이', price: 5000 }, { name: '순대', price: 4000 }] },
      { name: '시청앞 설렁탕', address: '서울특별시 중구 태평로 200', district: '중구', latitude: 37.5640, longitude: 126.9770, categories: ['한식'], menus: [{ name: '설렁탕', price: 7000, isRepresentative: true }, { name: '도가니탕', price: 8000 }] },
      { name: '명동 만두집', address: '서울특별시 중구 명동길 50', district: '중구', latitude: 37.5631, longitude: 126.9839, categories: ['분식'], menus: [{ name: '왕만두', price: 5000, isRepresentative: true }, { name: '군만두', price: 4500 }] },
      { name: '종로 순대골목', address: '서울특별시 종로구 종로 150', district: '종로구', latitude: 37.5701, longitude: 126.9908, categories: ['한식'], menus: [{ name: '순대볶음', price: 5500, isRepresentative: true }, { name: '모둠순대', price: 6000 }] },
      { name: '은평 삼겹살 맛집', address: '서울특별시 은평구 진관2로 29-8', district: '은평구', latitude: 37.6360, longitude: 126.9200, categories: ['한식'], menus: [{ name: '삼겹살 1인분', price: 6500, isRepresentative: true }, { name: '목살 1인분', price: 7000 }] },
      { name: '남도식당', address: '서울특별시 남도구 단방로47번길 8-5', district: '인천남도구', latitude: 37.4538, longitude: 126.7316, categories: ['한식'], menus: [{ name: '한정식', price: 7000, isRepresentative: true }] },
      { name: '미타리', address: '서울특별시 중랑구 신내로 66 2층', district: '중랑구', latitude: 37.6070, longitude: 127.0960, categories: ['한식'], menus: [{ name: '점심특선', price: 6800, isRepresentative: true }] },
      { name: '더학식', address: '경기도 경인로 445 8호관 1층', district: '경기', latitude: 37.5283, longitude: 126.7378, categories: ['한식'], menus: [{ name: '학식정식', price: 5500, isRepresentative: true }, { name: '비빔밥', price: 5000 }] },
      { name: '용산 부대찌개', address: '서울특별시 용산구 한강대로 100', district: '용산구', latitude: 37.5297, longitude: 126.9648, categories: ['한식'], menus: [{ name: '부대찌개', price: 6000, isRepresentative: true }, { name: '부대전골', price: 7000 }] },
      { name: '마포 칼국수', address: '서울특별시 마포구 합정동 200', district: '마포구', latitude: 37.5493, longitude: 126.9135, categories: ['한식'], menus: [{ name: '들깨칼국수', price: 5000, isRepresentative: true }, { name: '바지락칼국수', price: 5500 }] },
      { name: '신촌 떡볶이', address: '서울특별시 서대문구 신촌로 100', district: '서대문구', latitude: 37.5559, longitude: 126.9369, categories: ['분식'], menus: [{ name: '즉석떡볶이', price: 4000, isRepresentative: true }, { name: '치즈떡볶이', price: 4500 }, { name: '튀김', price: 3000 }] },
    ];

    for (const data of sampleData) {
      await this.create(data);
    }
  }
}
