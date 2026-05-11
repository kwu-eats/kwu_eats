import type { RestaurantWithRelations } from '@pangchelin/types';

// 타입은 zod 스키마(z.infer) 에서 export. import type 라 런타임 비용 0.
import type { RestaurantFormValues } from './RestaurantForm';

function defaultDayHours() {
  return { closed: false, open: '11:00', close: '21:00', breakStart: '', breakEnd: '' };
}

export function toFormValues(r: RestaurantWithRelations): RestaurantFormValues {
  const bh = (r.businessHours ?? {}) as Record<
    string,
    | { open?: string; close?: string; closed?: boolean; breakStart?: string; breakEnd?: string }
    | string
    | undefined
  >;
  const day = (k: string) => {
    const d = bh[k];
    if (!d || typeof d === 'string') return { closed: false, open: '11:00', close: '21:00' };
    return {
      closed: d.closed ?? false,
      open: d.open ?? '11:00',
      close: d.close ?? '21:00',
      breakStart: d.breakStart ?? '',
      breakEnd: d.breakEnd ?? '',
    };
  };
  return {
    name: r.name,
    zone: r.zone as RestaurantFormValues['zone'],
    address: r.address,
    phone: r.phone ?? '',
    latitude: r.latitude,
    longitude: r.longitude,
    businessHours: {
      mon: day('mon'),
      tue: day('tue'),
      wed: day('wed'),
      thu: day('thu'),
      fri: day('fri'),
      sat: day('sat'),
      sun: bh.sun && typeof bh.sun !== 'string' ? day('sun') : { closed: true, open: '11:00', close: '21:00' },
      note: typeof bh.note === 'string' ? bh.note : '',
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
      sun: { closed: true, open: '11:00', close: '21:00', breakStart: '', breakEnd: '' },
      note: '',
    },
    isPartner: false,
    partnerships: [],
    categoryIds: [],
    menus: [],
  };
}
