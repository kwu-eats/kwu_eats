import type { RestaurantWithRelations } from '@pangchelin/types';

// 타입은 zod 스키마(z.infer) 에서 export. import type 라 런타임 비용 0.
import type { RestaurantFormValues } from './RestaurantForm';

function defaultDayHours() {
  return { closed: false, open: '11:00', close: '21:00' };
}

export function toFormValues(r: RestaurantWithRelations): RestaurantFormValues {
  const bh = (r.businessHours ?? {}) as Record<
    string,
    { open?: string; close?: string; closed?: boolean }
  >;
  return {
    name: r.name,
    zone: r.zone as RestaurantFormValues['zone'],
    address: r.address,
    phone: r.phone ?? '',
    latitude: r.latitude,
    longitude: r.longitude,
    businessHours: {
      mon: { closed: bh.mon?.closed ?? false, open: bh.mon?.open ?? '11:00', close: bh.mon?.close ?? '21:00' },
      tue: { closed: bh.tue?.closed ?? false, open: bh.tue?.open ?? '11:00', close: bh.tue?.close ?? '21:00' },
      wed: { closed: bh.wed?.closed ?? false, open: bh.wed?.open ?? '11:00', close: bh.wed?.close ?? '21:00' },
      thu: { closed: bh.thu?.closed ?? false, open: bh.thu?.open ?? '11:00', close: bh.thu?.close ?? '21:00' },
      fri: { closed: bh.fri?.closed ?? false, open: bh.fri?.open ?? '11:00', close: bh.fri?.close ?? '21:00' },
      sat: { closed: bh.sat?.closed ?? false, open: bh.sat?.open ?? '11:00', close: bh.sat?.close ?? '21:00' },
      sun: { closed: bh.sun?.closed ?? true, open: bh.sun?.open ?? '11:00', close: bh.sun?.close ?? '21:00' },
    },
    isPartner: r.isPartner,
    partnerships:
      r.partnerships?.map((p) => ({
        college: p.college,
        instagramUrl: p.instagramUrl,
      })) ?? [],
    categoryIds:
      r.categories?.map((c) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (c as any).categoryId ?? (c as any).id ?? c;
      }) ?? [],
    menus:
      r.menus?.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        imageUrl: m.imageUrl ?? '',
        isSignature: m.isSignature,
      })) ?? [],
  };
}

export function defaultFormValues(): RestaurantFormValues {
  return {
    name: '',
    zone: 'FRONT_GATE',
    address: '',
    phone: '',
    latitude: 37.6192,
    longitude: 127.0589,
    businessHours: {
      mon: defaultDayHours(),
      tue: defaultDayHours(),
      wed: defaultDayHours(),
      thu: defaultDayHours(),
      fri: defaultDayHours(),
      sat: defaultDayHours(),
      sun: { closed: true, open: '11:00', close: '21:00' },
    },
    isPartner: false,
    partnerships: [],
    categoryIds: [],
    menus: [],
  };
}
