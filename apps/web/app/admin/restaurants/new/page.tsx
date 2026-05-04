'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// import type 는 컴파일 시 erase 되므로 RestaurantForm.tsx 가 페이지 번들로
// 끌려오지 않는다. 컴포넌트는 아래 dynamic 으로만 로드.
import type { RestaurantFormValues } from '@/components/admin/RestaurantForm';
import { defaultFormValues } from '@/components/admin/RestaurantForm.helpers';
import { useCreateRestaurant } from '@/hooks/mutations/useRestaurantMutations';
import { createMenu } from '@/lib/api/menus';
import { useAuthStore } from '@/lib/stores/authStore';

// 폼은 react-hook-form/zod/카카오 SDK 까지 끌고 와 무거우므로 dynamic import.
// SSR 비활성: 카카오맵 picker 가 window 의존이라 서버에서 무의미.
const RestaurantForm = dynamic(
  () => import('@/components/admin/RestaurantForm').then((m) => m.RestaurantForm),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    ),
  },
);

export default function NewRestaurantPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const createRestaurant = useCreateRestaurant();

  async function handleSubmit(values: RestaurantFormValues) {
    const restaurant = await createRestaurant.mutateAsync({
      name: values.name,
      zone: values.zone,
      address: values.address,
      phone: values.phone || undefined,
      latitude: values.latitude,
      longitude: values.longitude,
      businessHours: buildBusinessHours(values),
      isPartner: values.isPartner,
      partnerships: values.isPartner ? values.partnerships ?? [] : [],
      categoryIds: values.categoryIds,
    });

    for (const menu of values.menus ?? []) {
      await createMenu(restaurant.id, {
        name: menu.name,
        price: menu.price,
        imageUrl: menu.imageUrl || undefined,
        isSignature: menu.isSignature,
      }, token!);
    }

    router.push('/admin/restaurants');
  }

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <div>
        <button
          onClick={() => router.push('/admin/restaurants')}
          className="mb-2 flex items-center gap-1 text-sm text-ink-muted hover:text-ink-body"
        >
          ← 목록으로
        </button>
        <h1 className="text-xl font-semibold font-body text-ink-primary">식당 추가</h1>
      </div>
      <RestaurantForm
        defaultValues={defaultFormValues()}
        onSubmit={handleSubmit}
        isSubmitting={createRestaurant.isPending}
        submitLabel="식당 등록"
      />
    </div>
  );
}

function buildBusinessHours(values: RestaurantFormValues) {
  const result: Record<string, unknown> = {};
  for (const [day, hours] of Object.entries(values.businessHours)) {
    result[day] = hours.closed ? { closed: true } : { open: hours.open, close: hours.close };
  }
  return result;
}
