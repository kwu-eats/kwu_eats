import { getRestaurant } from '@/lib/api/restaurants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BusinessHours } from '@/components/restaurant/BusinessHours';
import { DetailHeader } from '@/components/restaurant/DetailHeader';
import { MenuList } from '@/components/restaurant/MenuList';
import { RestaurantHero } from '@/components/restaurant/RestaurantHero';
import { RestaurantInfo } from '@/components/restaurant/RestaurantInfo';
import { StickyBottomBar } from '@/components/restaurant/StickyBottomBar';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const restaurant = await getRestaurant(params.id);
    return {
      title: `${restaurant.name} — 팡슐랭`,
      description: `${restaurant.address} · 팡슐랭에서 ${restaurant.name} 메뉴와 영업시간을 확인하세요`,
      openGraph: {
        title: restaurant.name,
        description: restaurant.address,
        images: restaurant.menus.find((m) => m.imageUrl)?.imageUrl
          ? [{ url: restaurant.menus.find((m) => m.imageUrl)!.imageUrl! }]
          : [],
      },
    };
  } catch {
    return { title: '식당 정보 — 팡슐랭' };
  }
}

export default async function RestaurantDetailPage({ params }: Props) {
  let restaurant;
  try {
    restaurant = await getRestaurant(params.id);
  } catch {
    notFound();
  }

  const kakaoNavUrl = `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`;
  const kakaoAppUrl = `kakaomap://route?ep=${restaurant.latitude},${restaurant.longitude}&by=FOOT`;

  return (
    <div className="relative min-h-dvh bg-canvas pb-24">
      <DetailHeader name={restaurant.name} />

      <RestaurantHero menus={restaurant.menus} name={restaurant.name} />

      <div className="px-4 py-5 space-y-6">
        <RestaurantInfo restaurant={restaurant} />

        <hr className="border-border" />

        <BusinessHours hours={restaurant.businessHours} />

        <hr className="border-border" />

        <MenuList menus={restaurant.menus} />
      </div>

      <StickyBottomBar
        restaurantId={restaurant.id}
        kakaoNavUrl={kakaoNavUrl}
        kakaoAppUrl={kakaoAppUrl}
      />
    </div>
  );
}
