import { z } from 'zod';

export const restaurantInfoSchema = z.object({
  type: z.literal('RESTAURANT_INFO'),
  restaurantId: z.string().min(1, '식당을 선택해주세요'),
  suggestedData: z
    .object({
      phone: z.string().optional(),
      address: z.string().optional(),
      businessHoursNote: z.string().optional(),
      otherNote: z.string().optional(),
    })
    .refine(
      (d) => d.phone || d.address || d.businessHoursNote || d.otherNote,
      { message: '수정할 항목을 하나 이상 입력해주세요' },
    ),
});

export const menuChangeSchema = z.object({
  type: z.literal('MENU_CHANGE'),
  restaurantId: z.string().min(1, '식당을 선택해주세요'),
  menuId: z.string().optional(),
  suggestedData: z.object({
    menuName: z.string().min(1, '메뉴 이름을 입력해주세요'),
    action: z.enum(['UPDATE', 'ADD', 'DELETE']),
    oldPrice: z.coerce.number().int().nonnegative().optional(),
    newPrice: z.coerce.number().int().nonnegative().optional(),
  }),
});

export const newRestaurantSchema = z.object({
  type: z.literal('NEW_RESTAURANT'),
  suggestedData: z.object({
    name: z.string().min(1, '식당 이름을 입력해주세요'),
    address: z.string().min(1, '주소를 입력해주세요'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    menus: z
      .array(
        z.object({
          name: z.string().min(1),
          price: z.coerce.number().int().nonnegative(),
        }),
      )
      .optional(),
  }),
});

export const closedSchema = z.object({
  type: z.literal('CLOSED'),
  restaurantId: z.string().min(1, '식당을 선택해주세요'),
  suggestedData: z.object({
    reason: z.string().optional(),
  }),
});

export const reportFormSchema = z.discriminatedUnion('type', [
  restaurantInfoSchema,
  menuChangeSchema,
  newRestaurantSchema,
  closedSchema,
]);

export const reporterSchema = z.object({
  reporterName: z.string().max(20, '20자 이하로 입력해주세요').optional(),
  reporterContact: z.string().max(50).optional(),
  content: z.string().min(5, '제보 내용을 5자 이상 입력해주세요').max(500),
  imageUrls: z.array(z.string().url()).max(3),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
export type ReporterValues = z.infer<typeof reporterSchema>;

export type FullReportData = ReportFormValues & ReporterValues;
