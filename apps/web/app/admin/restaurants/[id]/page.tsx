'use client';

import type { RestaurantWithRelations } from '@pangchelin/types';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';

import type { RestaurantFormValues } from '@/components/admin/RestaurantForm';
import { toFormValues } from '@/components/admin/RestaurantForm.helpers';
import { useUpdateRestaurant } from '@/hooks/mutations/useRestaurantMutations';
import { useRestaurant } from '@/hooks/queries/useRestaurants';
import { createMenu, deleteMenu, updateMenu } from '@/lib/api/menus';
import { useAuthStore } from '@/lib/stores/authStore';

// 폼은 무거우므로 dynamic import (자세한 설명은 new/page.tsx 참고)
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

export default function EditRestaurantPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const { data: restaurant, isLoading } = useRestaurant(id);
  const updateRestaurant = useUpdateRestaurant(id);

  async function handleSubmit(values: RestaurantFormValues) {
    await updateRestaurant.mutateAsync({
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

    // 메뉴 동기화
    const existing = restaurant!.menus ?? [];
    const existingIds = new Set(existing.map((m) => m.id));
    const submittedMenus = values.menus ?? [];
    const formIds = new Set(submittedMenus.filter((m) => m.id).map((m) => m.id!));

    // 삭제된 메뉴
    for (const m of existing) {
      if (!formIds.has(m.id)) {
        await deleteMenu(m.id, token!);
      }
    }

    // 추가/수정
    for (const m of submittedMenus) {
      if (m.id && existingIds.has(m.id)) {
        await updateMenu(m.id, {
          name: m.name,
          price: m.price,
          imageUrl: m.imageUrl || undefined,
          isSignature: m.isSignature,
        }, token!);
      } else {
        await createMenu(id, {
          name: m.name,
          price: m.price,
          imageUrl: m.imageUrl || undefined,
          isSignature: m.isSignature,
        }, token!);
      }
    }

    router.push('/admin/restaurants');
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (!restaurant) {
    return <div className="p-6 text-center text-sm text-ink-muted">식당을 찾을 수 없어요</div>;
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
        <h1 className="text-xl font-semibold font-body text-ink-primary">
          {restaurant.name} 수정
        </h1>
      </div>
      <RestaurantForm
        defaultValues={toFormValues(restaurant as RestaurantWithRelations)}
        onSubmit={handleSubmit}
        isSubmitting={updateRestaurant.isPending}
        submitLabel="저장"
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
