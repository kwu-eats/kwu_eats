import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReportStatus, ReportType, Zone } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { ApproveReportDto } from './dto/approve-report.dto';
import { QueryAdminReportsDto } from './dto/query-admin-reports.dto';
import { RejectReportDto } from './dto/reject-report.dto';

type Tx = Prisma.TransactionClient;

const REPORT_LIST_INCLUDE = {
  restaurant: { select: { id: true, name: true, zone: true } },
  menu: { select: { id: true, name: true, price: true } },
  reviewedBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ReportInclude;

@Injectable()
export class AdminReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryAdminReportsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.report.count({ where }),
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: REPORT_LIST_INCLUDE,
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        restaurant: {
          include: {
            categories: { include: { category: true } },
          },
        },
        menu: true,
        reviewedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!report) {
      throw new NotFoundException(`제보를 찾을 수 없어요 (id: ${id})`);
    }

    return {
      ...report,
      currentData: this.buildCurrentData(report),
    };
  }

  async approve(id: string, adminId: string, dto: ApproveReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`제보를 찾을 수 없어요 (id: ${id})`);
    }
    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException(
        `이미 처리된 제보에요 (상태: ${report.status})`,
      );
    }

    const dataToApply = (dto.editedData ??
      (report.suggestedData as Prisma.JsonObject));

    return this.prisma.$transaction(async (tx) => {
      if (dto.applyNow) {
        await this.applyReport(tx, report, dataToApply);
      }

      return tx.report.update({
        where: { id },
        data: {
          status: dto.applyNow ? ReportStatus.APPLIED : ReportStatus.APPROVED,
          reviewedById: adminId,
          reviewedAt: new Date(),
        },
        include: REPORT_LIST_INCLUDE,
      });
    });
  }

  async reject(id: string, adminId: string, dto: RejectReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`제보를 찾을 수 없어요 (id: ${id})`);
    }
    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException(
        `이미 처리된 제보에요 (상태: ${report.status})`,
      );
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.REJECTED,
        adminNote: dto.reason,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
      include: REPORT_LIST_INCLUDE,
    });
  }

  async stats() {
    const [total, pending, approved, rejected, applied] =
      await this.prisma.$transaction([
        this.prisma.report.count(),
        this.prisma.report.count({ where: { status: ReportStatus.PENDING } }),
        this.prisma.report.count({ where: { status: ReportStatus.APPROVED } }),
        this.prisma.report.count({ where: { status: ReportStatus.REJECTED } }),
        this.prisma.report.count({ where: { status: ReportStatus.APPLIED } }),
      ]);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [thisWeekReports, thisWeekApproved, thisMonthReports, thisMonthApproved] =
      await this.prisma.$transaction([
        this.prisma.report.count({ where: { createdAt: { gte: weekAgo } } }),
        this.prisma.report.count({
          where: {
            reviewedAt: { gte: weekAgo },
            status: { in: [ReportStatus.APPROVED, ReportStatus.APPLIED] },
          },
        }),
        this.prisma.report.count({ where: { createdAt: { gte: monthAgo } } }),
        this.prisma.report.count({
          where: {
            reviewedAt: { gte: monthAgo },
            status: { in: [ReportStatus.APPROVED, ReportStatus.APPLIED] },
          },
        }),
      ]);

    return {
      total,
      pending,
      approved,
      rejected,
      applied,
      thisWeek: { reports: thisWeekReports, approved: thisWeekApproved },
      thisMonth: { reports: thisMonthReports, approved: thisMonthApproved },
    };
  }

  private buildCurrentData(report: {
    type: ReportType;
    restaurant: {
      name: string;
      phone: string | null;
      address: string;
      businessHours: Prisma.JsonValue;
      latitude: number;
      longitude: number;
      isPartner: boolean;
    } | null;
    menu: {
      name: string;
      price: number;
      imageUrl: string | null;
      isSignature: boolean;
    } | null;
  }): Record<string, unknown> | null {
    switch (report.type) {
      case ReportType.RESTAURANT_INFO:
      case ReportType.CLOSED: {
        if (!report.restaurant) return null;
        return {
          name: report.restaurant.name,
          phone: report.restaurant.phone,
          address: report.restaurant.address,
          businessHours: report.restaurant.businessHours,
          latitude: report.restaurant.latitude,
          longitude: report.restaurant.longitude,
          isPartner: report.restaurant.isPartner,
        };
      }
      case ReportType.MENU_CHANGE: {
        if (!report.menu) return null;
        return {
          name: report.menu.name,
          price: report.menu.price,
          imageUrl: report.menu.imageUrl,
          isSignature: report.menu.isSignature,
        };
      }
      case ReportType.NEW_RESTAURANT:
      default:
        return null;
    }
  }

  private async applyReport(
    tx: Tx,
    report: {
      type: ReportType;
      restaurantId: string | null;
      menuId: string | null;
    },
    data: Record<string, unknown>,
  ) {
    switch (report.type) {
      case ReportType.RESTAURANT_INFO:
        if (!report.restaurantId) {
          throw new BadRequestException('RESTAURANT_INFO 반영은 restaurantId가 필요해요');
        }
        return this.applyRestaurantInfo(tx, report.restaurantId, data);
      case ReportType.MENU_CHANGE:
        if (!report.restaurantId) {
          throw new BadRequestException('MENU_CHANGE 반영은 restaurantId가 필요해요');
        }
        return this.applyMenuChange(tx, report.restaurantId, report.menuId, data);
      case ReportType.NEW_RESTAURANT:
        return this.applyNewRestaurant(tx, data);
      case ReportType.CLOSED:
        if (!report.restaurantId) {
          throw new BadRequestException('CLOSED 반영은 restaurantId가 필요해요');
        }
        return this.applyClosed(tx, report.restaurantId);
      default:
        throw new BadRequestException(`알 수 없는 제보 유형: ${report.type}`);
    }
  }

  private async applyRestaurantInfo(
    tx: Tx,
    restaurantId: string,
    data: Record<string, unknown>,
  ) {
    const updateData: Prisma.RestaurantUpdateInput = {};
    if (typeof data.name === 'string') updateData.name = data.name;
    if (typeof data.phone === 'string' || data.phone === null) {
      updateData.phone = data.phone;
    }
    if (typeof data.address === 'string') updateData.address = data.address;
    if (data.businessHours && typeof data.businessHours === 'object') {
      updateData.businessHours = data.businessHours as Prisma.InputJsonValue;
    }
    if (typeof data.latitude === 'number') updateData.latitude = data.latitude;
    if (typeof data.longitude === 'number') updateData.longitude = data.longitude;
    if (typeof data.isPartner === 'boolean') updateData.isPartner = data.isPartner;
    // partnerInfo 필드는 partnerships 모델로 대체되어 더 이상 식당 본체에 없음.
    // 사용자 제보로 제휴 정보 변경 기능은 별도 워크플로 (관리자 폼) 로 처리.

    return tx.restaurant.update({
      where: { id: restaurantId },
      data: updateData,
    });
  }

  private async applyMenuChange(
    tx: Tx,
    restaurantId: string,
    menuId: string | null,
    data: Record<string, unknown>,
  ) {
    const action = data.action as string;

    if (action === 'UPDATE') {
      if (!menuId) {
        throw new BadRequestException('UPDATE 제보는 menuId가 필요해요');
      }
      const updateData: Prisma.MenuUpdateInput = {};
      if (typeof data.menuName === 'string') updateData.name = data.menuName;
      if (typeof data.newPrice === 'number') updateData.price = data.newPrice;
      return tx.menu.update({ where: { id: menuId }, data: updateData });
    }

    if (action === 'ADD') {
      if (typeof data.menuName !== 'string' || typeof data.newPrice !== 'number') {
        throw new BadRequestException('ADD 제보는 menuName과 newPrice가 필요해요');
      }
      return tx.menu.create({
        data: {
          restaurantId,
          name: data.menuName,
          price: data.newPrice,
        },
      });
    }

    if (action === 'DELETE') {
      if (!menuId) {
        throw new BadRequestException('DELETE 제보는 menuId가 필요해요');
      }
      return tx.menu.delete({ where: { id: menuId } });
    }

    throw new BadRequestException(`알 수 없는 action: ${action}`);
  }

  private async applyNewRestaurant(tx: Tx, data: Record<string, unknown>) {
    if (typeof data.name !== 'string' || typeof data.address !== 'string') {
      throw new BadRequestException(
        'NEW_RESTAURANT 반영은 name과 address가 필요해요',
      );
    }

    const zone = this.parseZone(data.zone);
    const latitude = typeof data.latitude === 'number' ? data.latitude : 37.6192;
    const longitude = typeof data.longitude === 'number' ? data.longitude : 127.0589;
    const businessHours = (data.businessHours && typeof data.businessHours === 'object'
      ? data.businessHours
      : {}) as Prisma.InputJsonValue;

    const restaurant = await tx.restaurant.create({
      data: {
        name: data.name,
        address: data.address,
        zone,
        latitude,
        longitude,
        businessHours,
      },
    });

    if (Array.isArray(data.menus)) {
      const menusData = (data.menus as Array<unknown>)
        .filter(
          (m): m is { name: string; price: number } =>
            typeof m === 'object' &&
            m !== null &&
            typeof (m as { name: unknown }).name === 'string' &&
            typeof (m as { price: unknown }).price === 'number',
        )
        .map((m) => ({
          restaurantId: restaurant.id,
          name: m.name,
          price: m.price,
        }));

      if (menusData.length) {
        await tx.menu.createMany({ data: menusData });
      }
    }

    return restaurant;
  }

  private async applyClosed(tx: Tx, restaurantId: string) {
    return tx.restaurant.delete({ where: { id: restaurantId } });
  }

  private parseZone(value: unknown): Zone {
    if (value === Zone.KWANGWOON_STATION) return Zone.KWANGWOON_STATION;
    if (value === Zone.FRONT_GATE) return Zone.FRONT_GATE;
    if (value === Zone.BACK_GATE) return Zone.BACK_GATE;
    return Zone.FRONT_GATE;
  }
}
