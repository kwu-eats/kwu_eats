import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateNoticeDto } from './dto/create-notice.dto';
import { QueryNoticeDto } from './dto/query-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

const NOTICE_LIST_SELECT = {
  id: true,
  title: true,
  category: true,
  isPinned: true,
  publishedAt: true,
  createdAt: true,
  author: { select: { id: true, name: true } },
} satisfies Prisma.NoticeSelect;

const NOTICE_DETAIL_SELECT = {
  id: true,
  title: true,
  content: true,
  category: true,
  isPinned: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true } },
} satisfies Prisma.NoticeSelect;

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryNoticeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NoticeWhereInput = {};
    if (query.category) where.category = query.category;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.notice.count({ where }),
      this.prisma.notice.findMany({
        where,
        // 고정 글 우선, 그 다음 publishedAt desc
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: limit,
        select: NOTICE_LIST_SELECT,
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
    const notice = await this.prisma.notice.findUnique({
      where: { id },
      select: NOTICE_DETAIL_SELECT,
    });
    if (!notice) {
      throw new NotFoundException(`공지를 찾을 수 없어요 (id: ${id})`);
    }
    return notice;
  }

  async create(adminId: string, dto: CreateNoticeDto) {
    return this.prisma.notice.create({
      data: {
        title: dto.title,
        content: dto.content,
        category: dto.category,
        isPinned: dto.isPinned,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        authorId: adminId,
      },
      select: NOTICE_DETAIL_SELECT,
    });
  }

  async update(id: string, dto: UpdateNoticeDto) {
    await this.findOne(id);

    return this.prisma.notice.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.isPinned !== undefined && { isPinned: dto.isPinned }),
        ...(dto.publishedAt !== undefined && {
          publishedAt: new Date(dto.publishedAt),
        }),
      },
      select: NOTICE_DETAIL_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.notice.delete({ where: { id } });
  }
}
