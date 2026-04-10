import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly service: RestaurantsService) {}

  @Get()
  findAll(
    @Query('maxPrice') maxPrice?: number,
    @Query('minPrice') minPrice?: number,
  ) {
    return this.service.findAll(maxPrice ? +maxPrice : undefined, minPrice ? +minPrice : undefined);
  }

  @Get('recent')
  findRecent() {
    return this.service.findRecent(10);
  }

  @Get('ranking')
  findRanking() {
    return this.service.findRanking(10);
  }

  @Get('seed')
  async seed() {
    await this.service.seed();
    return { message: 'Seeded successfully' };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.service.create(dto);
  }

  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number) {
    return this.service.like(id);
  }
}
