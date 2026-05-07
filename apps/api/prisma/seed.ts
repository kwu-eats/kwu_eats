import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const defaultBusinessHours = {
  mon: { open: '09:00', close: '22:00' },
  tue: { open: '09:00', close: '22:00' },
  wed: { open: '09:00', close: '22:00' },
  thu: { open: '09:00', close: '22:00' },
  fri: { open: '09:00', close: '22:00' },
  sat: { open: '10:00', close: '21:00' },
  sun: { closed: true },
};

async function main() {
  await prisma.report.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurantCategory.deleteMany();
  await prisma.restaurantPartnership.deleteMany();
  await prisma.category.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.admin.deleteMany();

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@pangchelin.dev';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SEED_ADMIN_PASSWORD 환경변수가 필요해요 (운영 환경에서는 필수)',
      );
    }
    console.warn(
      '⚠️  SEED_ADMIN_PASSWORD 미설정 — 개발용 기본값을 사용합니다',
    );
  }

  const passwordHash = await bcrypt.hash(
    adminPassword ?? 'pangchelin-admin-2026',
    10,
  );

  const admin = await prisma.admin.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: '팡슐랭 관리자',
    },
  });

  const categories = await Promise.all(
    [
      { name: '한식', icon: 'Soup' },
      { name: '중식', icon: 'UtensilsCrossed' },
      { name: '일식', icon: 'Fish' },
      { name: '양식', icon: 'Pizza' },
      { name: '분식', icon: 'ChefHat' },
      { name: '카페', icon: 'Coffee' },
      { name: '주점', icon: 'Beer' },
    ].map(category => prisma.category.create({ data: category })),
  );

  const categoryMap = Object.fromEntries(
    categories.map(category => [category.name, category.id]),
  );

  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: '광운분식집',
        zone: 'KWANGWOON_STATION',
        latitude: 37.6198,
        longitude: 127.0598,
        address: '서울 노원구 월계로 52길 12',
        phone: '02-943-1001',
        businessHours: defaultBusinessHours,
        isPartner: true,
        partnerships: {
          create: [
            {
              college: 'ENGINEERING',
              instagramUrl: 'https://instagram.com/p/seed-kwoonbunsik-eng',
            },
            {
              college: 'AI_CONVERGENCE',
              instagramUrl: 'https://instagram.com/p/seed-kwoonbunsik-ai',
            },
          ],
        },
        categories: {
          create: [{ categoryId: categoryMap.분식 }, { categoryId: categoryMap.한식 }],
        },
        menus: {
          create: [
            { name: '즉석떡볶이', price: 6500, isSignature: true },
            { name: '참치김밥', price: 4500 },
            { name: '라볶이', price: 6000 },
            { name: '순대', price: 5000 },
          ],
        },
      },
    }),
    prisma.restaurant.create({
      data: {
        name: '정문칼국수',
        zone: 'FRONT_GATE',
        latitude: 37.6189,
        longitude: 127.0582,
        address: '서울 노원구 광운로 21',
        phone: '02-943-1002',
        businessHours: defaultBusinessHours,
        categories: {
          create: [{ categoryId: categoryMap.한식 }],
        },
        menus: {
          create: [
            { name: '손칼국수', price: 7000, isSignature: true },
            { name: '만둣국', price: 7500 },
            { name: '김치전', price: 8000 },
          ],
        },
      },
    }),
    prisma.restaurant.create({
      data: {
        name: '후문초밥랩',
        zone: 'BACK_GATE',
        latitude: 37.6178,
        longitude: 127.0595,
        address: '서울 노원구 석계로 8길 3',
        phone: '02-943-1003',
        businessHours: {
          ...defaultBusinessHours,
          sat: { open: '11:00', close: '20:00' },
        },
        categories: {
          create: [{ categoryId: categoryMap.일식 }],
        },
        menus: {
          create: [
            { name: '연어초밥 10pcs', price: 13500, isSignature: true },
            { name: '모둠초밥 12pcs', price: 15000 },
            { name: '우동', price: 7000 },
          ],
        },
      },
    }),
    prisma.restaurant.create({
      data: {
        name: '캠퍼스크림파스타',
        zone: 'FRONT_GATE',
        latitude: 37.6185,
        longitude: 127.0576,
        address: '서울 노원구 광운로 17',
        phone: '02-943-1004',
        businessHours: {
          ...defaultBusinessHours,
          sun: { open: '11:30', close: '20:00' },
        },
        isPartner: true,
        partnerships: {
          create: [
            {
              college: 'BUSINESS',
              instagramUrl: 'https://instagram.com/p/seed-creampasta-biz',
            },
            {
              college: 'HUMANITIES_SOCIAL',
              instagramUrl: 'https://instagram.com/p/seed-creampasta-hum',
            },
            {
              college: 'POLICY_LAW',
              instagramUrl: 'https://instagram.com/p/seed-creampasta-law',
            },
          ],
        },
        categories: {
          create: [{ categoryId: categoryMap.양식 }, { categoryId: categoryMap.카페 }],
        },
        menus: {
          create: [
            { name: '크림파스타', price: 11900, isSignature: true },
            { name: '토마토파스타', price: 10900 },
            { name: '치킨샐러드', price: 8900 },
            { name: '아메리카노', price: 3000 },
          ],
        },
      },
    }),
    prisma.restaurant.create({
      data: {
        name: '석계야식포차',
        zone: 'KWANGWOON_STATION',
        latitude: 37.6194,
        longitude: 127.0604,
        address: '서울 노원구 월계로 56길 4',
        phone: '02-943-1005',
        businessHours: {
          mon: { open: '17:00', close: '02:00' },
          tue: { open: '17:00', close: '02:00' },
          wed: { open: '17:00', close: '02:00' },
          thu: { open: '17:00', close: '02:00' },
          fri: { open: '17:00', close: '03:00' },
          sat: { open: '17:00', close: '03:00' },
          sun: { open: '17:00', close: '01:00' },
        },
        categories: {
          create: [{ categoryId: categoryMap.주점 }, { categoryId: categoryMap.한식 }],
        },
        menus: {
          create: [
            { name: '닭볶음탕', price: 15000, isSignature: true },
            { name: '계란말이', price: 12000 },
            { name: '소주', price: 5000 },
          ],
        },
      },
    }),
  ]);

  const [snackBar, noodleHouse] = restaurants;
  const tteokbokki = await prisma.menu.findFirst({
    where: {
      restaurantId: snackBar.id,
      name: '즉석떡볶이',
    },
  });

  await prisma.report.createMany({
    data: [
      {
        type: 'RESTAURANT_INFO',
        restaurantId: noodleHouse.id,
        reporterName: '광운대학생',
        reporterContact: 'student1@example.com',
        content: '토요일 영업 종료 시간이 21시로 변경된 것 같아요.',
        suggestedData: {
          businessHours: {
            sat: { open: '10:00', close: '21:00' },
          },
        },
        imageUrls: ['https://res.cloudinary.com/demo/image/upload/menu-board-1.jpg'],
        status: 'PENDING',
      },
      {
        type: 'MENU_CHANGE',
        restaurantId: snackBar.id,
        menuId: tteokbokki?.id,
        reporterName: '메뉴제보자',
        reporterContact: 'student2@example.com',
        content: '즉석떡볶이 가격이 7,000원으로 올랐습니다.',
        suggestedData: {
          menuName: '즉석떡볶이',
          oldPrice: 6500,
          newPrice: 7000,
          action: 'UPDATE',
        },
        imageUrls: ['https://res.cloudinary.com/demo/image/upload/menu-board-2.jpg'],
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedById: admin.id,
        adminNote: '가격표 사진 확인 후 승인',
      },
      {
        type: 'NEW_RESTAURANT',
        reporterName: '새가게발견',
        reporterContact: 'student3@example.com',
        content: '후문 근처에 새 카페가 생겼어요.',
        suggestedData: {
          name: '후문로스터리',
          address: '서울 노원구 석계로 8길 11',
          latitude: 37.61955,
          longitude: 127.06345,
          menus: [
            { name: '드립커피', price: 4500 },
            { name: '바닐라라떼', price: 5000 },
          ],
        },
        imageUrls: ['https://res.cloudinary.com/demo/image/upload/store-front-1.jpg'],
        status: 'PENDING',
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
