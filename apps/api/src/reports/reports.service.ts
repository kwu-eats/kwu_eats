import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReportType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReportDto) {
    this.validateSuggestedData(dto.type, dto.suggestedData);

    if (dto.restaurantId) {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: dto.restaurantId },
        select: { id: true },
      });
      if (!restaurant) {
        throw new NotFoundException(
          `식당을 찾을 수 없어요 (id: ${dto.restaurantId})`,
        );
      }
    } else if (dto.type !== ReportType.NEW_RESTAURANT) {
      throw new BadRequestException(
        'NEW_RESTAURANT 제보 외에는 restaurantId가 필요해요',
      );
    }

    if (dto.menuId) {
      const menu = await this.prisma.menu.findUnique({
        where: { id: dto.menuId },
        select: { id: true },
      });
      if (!menu) {
        throw new NotFoundException(
          `메뉴를 찾을 수 없어요 (id: ${dto.menuId})`,
        );
      }
    }

    const report = await this.prisma.report.create({
      data: {
        type: dto.type,
        restaurantId: dto.restaurantId,
        menuId: dto.menuId,
        reporterName: dto.reporterName,
        reporterContact: dto.reporterContact,
        content: dto.content,
        suggestedData: dto.suggestedData as Prisma.InputJsonValue,
        imageUrls: dto.imageUrls ?? [],
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return report;
  }

  private validateSuggestedData(
    type: ReportType,
    data: Record<string, unknown>,
  ) {
    switch (type) {
      case ReportType.MENU_CHANGE: {
        const validActions = ['UPDATE', 'ADD', 'DELETE'];
        if (!data.action || !validActions.includes(data.action as string)) {
          throw new BadRequestException(
            `MENU_CHANGE 제보는 suggestedData.action(UPDATE|ADD|DELETE)이 필요해요`,
          );
        }
        break;
      }
      case ReportType.NEW_RESTAURANT: {
        if (!data.name || typeof data.name !== 'string') {
          throw new BadRequestException(
            'NEW_RESTAURANT 제보는 suggestedData.name이 필요해요',
          );
        }
        if (!data.address || typeof data.address !== 'string') {
          throw new BadRequestException(
            'NEW_RESTAURANT 제보는 suggestedData.address가 필요해요',
          );
        }
        break;
      }
      default:
        break;
    }
  }
}
