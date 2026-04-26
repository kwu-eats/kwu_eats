'use client';

import { useRouter } from 'next/navigation';

import { RestaurantForm, defaultFormValues } from '@/components/admin/RestaurantForm';
import { useCreateRestaurant } from '@/hooks/mutations/useRestaurantMutations';
import { createMenu } from '@/lib/api/menus';
import { useAuthStore } from '@/lib/stores/authStore';
import type { RestaurantFormValues } from '@/components/admin/RestaurantForm';

export default function NewRestaurantPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const createRestaurant = useCreateRestaurant();

  async function handleSubmit(values: RestaurantFormValues) {
    let partnerInfo: Record<string, unknown> | undefined;
    if (values.isPartner && values.partnerInfo) {
      try { partnerInfo = JSON.parse(values.partnerInfo); } catch { partnerInfo = {}; }
    }

    const restaurant = await createRestaurant.mutateAsync({
      name: values.name,
      zone: values.zone,
      address: values.address,
      phone: values.phone || undefined,
      latitude: values.latitude,
      longitude: values.longitude,
      businessHours: buildBusinessHours(values),
      isPartner: values.isPartner,
      partnerInfo,
      categoryIds: values.categoryIds,
    });

    for (const menu of values.menus) {
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
