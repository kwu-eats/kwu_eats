'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Script from 'next/script';
import { Plus, Trash2, ImagePlus, Star, Search } from 'lucide-react';

import { useCategories } from '@/hooks/queries/useCategories';
import { adminUploadImage } from '@/lib/api/upload';
import { useAuthStore } from '@/lib/stores/authStore';
import { clientEnv } from '@/env';
import type { RestaurantWithRelations } from '@pangchelin/types';

const DAYS = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
  { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
] as const;

const ZONE_OPTIONS = [
  { value: 'FRONT_GATE', label: '정문' },
  { value: 'BACK_GATE', label: '후문' },
  { value: 'KWANGWOON_STATION', label: '광운대역' },
];

const dayHoursSchema = z.object({
  closed: z.boolean().default(false),
  open: z.string().optional(),
  close: z.string().optional(),
});

const menuRowSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '메뉴명을 입력해주세요'),
  price: z.coerce.number().min(0, '가격을 입력해주세요'),
  imageUrl: z.string().optional(),
  isSignature: z.boolean().default(false),
});

export const restaurantSchema = z.object({
  name: z.string().min(1, '식당명을 입력해주세요'),
  zone: z.enum(['KWANGWOON_STATION', 'FRONT_GATE', 'BACK_GATE']),
  address: z.string().min(1, '주소를 입력해주세요'),
  phone: z.string().optional(),
  latitude: z.number({ invalid_type_error: '지도에서 위치를 선택해주세요' }),
  longitude: z.number({ invalid_type_error: '지도에서 위치를 선택해주세요' }),
  businessHours: z.object({
    mon: dayHoursSchema, tue: dayHoursSchema, wed: dayHoursSchema,
    thu: dayHoursSchema, fri: dayHoursSchema, sat: dayHoursSchema, sun: dayHoursSchema,
  }),
  isPartner: z.boolean().default(false),
  partnerInfo: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
  menus: z.array(menuRowSchema).default([]),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;

function defaultDayHours() {
  return { closed: false, open: '11:00', close: '21:00' };
}

export function toFormValues(r: RestaurantWithRelations): RestaurantFormValues {
  const bh = (r.businessHours ?? {}) as Record<string, { open?: string; close?: string; closed?: boolean }>;
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
      sun: { closed: bh.sun?.closed ?? true,  open: bh.sun?.open ?? '11:00', close: bh.sun?.close ?? '21:00' },
    },
    isPartner: r.isPartner,
    partnerInfo: r.partnerInfo ? JSON.stringify(r.partnerInfo, null, 2) : '',
    categoryIds: r.categories?.map((c) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (c as any).categoryId ?? (c as any).id ?? c;
    }) ?? [],
    menus: r.menus?.map((m) => ({
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
      mon: defaultDayHours(), tue: defaultDayHours(), wed: defaultDayHours(),
      thu: defaultDayHours(), fri: defaultDayHours(),
      sat: defaultDayHours(),
      sun: { closed: true, open: '11:00', close: '21:00' },
    },
    isPartner: false,
    partnerInfo: '',
    categoryIds: [],
    menus: [],
  };
}

interface Props {
  defaultValues: RestaurantFormValues;
  onSubmit: (values: RestaurantFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const inputClass = 'h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm text-ink-body placeholder:text-ink-muted focus:border-primary-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-ink-primary mb-1';
const sectionClass = 'rounded-lg border border-border bg-surface p-5 space-y-4';

export function RestaurantForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: Props) {
  const token = useAuthStore((s) => s.token);
  const { data: categories } = useCategories();

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues,
  });

  const { fields: menuFields, append: appendMenu, remove: removeMenu } = useFieldArray({
    control,
    name: 'menus',
  });

  const isPartner = watch('isPartner');
  const lat = watch('latitude');
  const lng = watch('longitude');

  // 카카오 장소 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<kakao.maps.services.PlaceSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  function handlePlaceSearch() {
    if (!searchQuery.trim() || !mapLoaded) return;
    window.kakao.maps.load(() => {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(searchQuery, (results, status) => {
        if (status === 'OK') {
          setSearchResults(results);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(true);
        }
      }, { size: 8 });
    });
  }

  function handleSelectPlace(place: kakao.maps.services.PlaceSearchResult) {
    setValue('name', place.place_name, { shouldValidate: true });
    setValue('address', place.road_address_name || place.address_name, { shouldValidate: true });
    setValue('phone', place.phone, { shouldValidate: true });
    setValue('latitude', parseFloat(place.y), { shouldValidate: true });
    setValue('longitude', parseFloat(place.x), { shouldValidate: true });
    setShowResults(false);
    setSearchQuery('');
  }

  // KakaoMap picker
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(
    typeof window !== 'undefined' && !!window.kakao?.maps,
  );

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;
    window.kakao.maps.load(() => {
      if (!mapContainerRef.current || mapRef.current) return;
      const center = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapContainerRef.current, { center, level: 4 });
      mapRef.current = map;

      const marker = new window.kakao.maps.Marker({ position: center, map });
      markerRef.current = marker;

      window.kakao.maps.event.addListener(map, 'click', (e: kakao.maps.event.MouseEvent) => {
        const pos = e.latLng;
        marker.setPosition(pos);
        setValue('latitude', pos.getLat(), { shouldValidate: true });
        setValue('longitude', pos.getLng(), { shouldValidate: true });
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // 외부에서 lat/lng 변경 시 마커 이동
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const pos = new window.kakao.maps.LatLng(lat, lng);
    markerRef.current.setPosition(pos);
    mapRef.current.panTo(pos);
  }, [lat, lng]);

  async function handleMenuImageUpload(index: number, file: File) {
    if (!token) return;
    const res = await adminUploadImage(file, token);
    setValue(`menus.${index}.imageUrl`, res.url);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 카카오 장소 검색 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-semibold text-ink-primary">카카오맵 검색으로 자동 입력</h2>
        <p className="text-xs text-ink-muted">식당명으로 검색하면 주소, 전화번호, 위치가 자동으로 채워져요</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePlaceSearch())}
            placeholder="예) 푸른스시, 광운분식집"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handlePlaceSearch}
            className="flex shrink-0 items-center gap-1.5 h-10 rounded-xl bg-primary-500 px-4 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
          >
            <Search size={15} />
            검색
          </button>
        </div>
        {showResults && (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-ink-muted">검색 결과가 없어요</p>
            ) : (
              <ul>
                {searchResults.map((place) => (
                  <li key={place.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0"
                    >
                      <p className="text-sm font-medium text-ink-primary">{place.place_name}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {place.road_address_name || place.address_name}
                        {place.phone && <span className="ml-2">{place.phone}</span>}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setShowResults(false)}
              className="w-full px-4 py-2 text-xs text-ink-muted hover:bg-muted transition-colors border-t border-border"
            >
              닫기
            </button>
          </div>
        )}
      </div>

      {/* 기본 정보 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-semibold text-ink-primary">기본 정보</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>식당명 *</label>
            <input {...register('name')} placeholder="예) 광운분식집" className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>구역 *</label>
            <select {...register('zone')} className={inputClass}>
              {ZONE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>주소 *</label>
            <input {...register('address')} placeholder="예) 서울 노원구 광운로 20" className={inputClass} />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
          </div>
          <div>
            <label className={labelClass}>전화번호</label>
            <input {...register('phone')} placeholder="예) 02-123-4567" className={inputClass} />
          </div>
        </div>
      </div>

      {/* 위치 선택 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-semibold text-ink-primary">위치 선택</h2>
        <p className="text-xs text-ink-muted">지도를 클릭해서 위치를 지정하세요</p>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${clientEnv.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
          strategy="afterInteractive"
          onLoad={() => setMapLoaded(true)}
        />
        <div ref={mapContainerRef} className="h-56 w-full rounded-xl border border-border overflow-hidden" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>위도</label>
            <input
              type="number"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>경도</label>
            <input
              type="number"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
        </div>
        {errors.latitude && <p className="text-xs text-red-500">{errors.latitude.message}</p>}
      </div>

      {/* 카테고리 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-semibold text-ink-primary">카테고리</h2>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat) => {
                const checked = field.value.includes(cat.id);
                return (
                  <label key={cat.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    checked
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-border bg-muted text-ink-body'
                  }`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, cat.id]);
                        } else {
                          field.onChange(field.value.filter((id) => id !== cat.id));
                        }
                      }}
                    />
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                  </label>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* 영업시간 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-semibold text-ink-primary">영업시간</h2>
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => {
            const closed = watch(`businessHours.${key}.closed`);
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-6 shrink-0 text-sm font-medium text-ink-body">{label}</span>
                <Controller
                  control={control}
                  name={`businessHours.${key}.closed`}
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-border accent-primary-500"
                      />
                      <span className="text-xs text-ink-muted">휴무</span>
                    </label>
                  )}
                />
                {!closed && (
                  <>
                    <input
                      type="time"
                      {...register(`businessHours.${key}.open`)}
                      className="h-8 rounded-lg border border-border bg-muted px-2 text-sm text-ink-body focus:border-primary-500 focus:outline-none"
                    />
                    <span className="text-ink-muted">~</span>
                    <input
                      type="time"
                      {...register(`businessHours.${key}.close`)}
                      className="h-8 rounded-lg border border-border bg-muted px-2 text-sm text-ink-body focus:border-primary-500 focus:outline-none"
                    />
                  </>
                )}
                {closed && <span className="text-sm text-ink-muted">휴무일</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 제휴 */}
      <div className={sectionClass}>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            {...register('isPartner')}
            className="h-4 w-4 rounded border-border accent-primary-500"
          />
          <span className="text-sm font-medium text-ink-primary">제휴 식당</span>
        </label>
        {isPartner && (
          <div>
            <label className={labelClass}>제휴 상세 정보 (JSON)</label>
            <textarea
              {...register('partnerInfo')}
              rows={4}
              placeholder={'{\n  "discount": "학생 10% 할인"\n}'}
              className="w-full rounded-xl border border-border bg-muted p-3 text-sm text-ink-body placeholder:text-ink-muted focus:border-primary-500 focus:outline-none resize-none font-mono"
            />
          </div>
        )}
      </div>

      {/* 메뉴 */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-primary">메뉴</h2>
          <button
            type="button"
            onClick={() => appendMenu({ name: '', price: 0, imageUrl: '', isSignature: false })}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-ink-body hover:bg-muted transition-colors"
          >
            <Plus size={13} />
            메뉴 추가
          </button>
        </div>
        <div className="space-y-3">
          {menuFields.map((field, index) => (
            <div key={field.id} className="rounded-xl border border-border bg-muted p-3 space-y-2">
              <div className="flex items-start gap-2">
                {/* 이미지 업로드 */}
                <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface overflow-hidden hover:bg-muted transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMenuImageUpload(index, file);
                    }}
                  />
                  {watch(`menus.${index}.imageUrl`)
                    ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={watch(`menus.${index}.imageUrl`)}
                        alt="메뉴 이미지"
                        className="h-full w-full object-cover"
                      />
                    )
                    : <ImagePlus size={20} className="text-ink-muted" />
                  }
                </label>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      {...register(`menus.${index}.name`)}
                      placeholder="메뉴명"
                      className="h-9 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-ink-body placeholder:text-ink-muted focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      {...register(`menus.${index}.price`, { valueAsNumber: true })}
                      placeholder="가격"
                      className="h-9 w-24 rounded-lg border border-border bg-surface px-3 text-sm text-ink-body placeholder:text-ink-muted focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-1.5">
                      <Controller
                        control={control}
                        name={`menus.${index}.isSignature`}
                        render={({ field: f }) => (
                          <input
                            type="checkbox"
                            checked={f.value}
                            onChange={f.onChange}
                            className="h-4 w-4 rounded border-border accent-primary-500"
                          />
                        )}
                      />
                      <Star size={13} className="text-accent-500" />
                      <span className="text-xs text-ink-muted">대표 메뉴</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMenu(index)}
                      className="rounded-lg p-1 text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              {errors.menus?.[index]?.name && (
                <p className="text-xs text-red-500">{errors.menus[index]?.name?.message}</p>
              )}
              {errors.menus?.[index]?.price && (
                <p className="text-xs text-red-500">{errors.menus[index]?.price?.message}</p>
              )}
            </div>
          ))}
          {menuFields.length === 0 && (
            <p className="text-center text-sm text-ink-muted py-4">메뉴를 추가해주세요</p>
          )}
        </div>
      </div>

      {/* 제출 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl bg-primary-500 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? '저장 중...' : submitLabel}
      </button>
    </form>
  );
}
