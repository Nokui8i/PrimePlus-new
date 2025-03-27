import { z } from 'zod';

const hotspotSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  rotation: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  type: z.enum(['info', 'link', 'media']),
  content: z.string().min(1),
});

export const vrContentSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    type: z.enum(['360-image', '360-video', 'vr-room']),
    isExclusive: z.boolean(),
    price: z.number().optional(),
    environment: z.string().optional(),
    hotspots: z.array(hotspotSchema).optional(),
    tags: z.array(z.string()).optional(),
    scheduledFor: z.string().datetime().optional(),
  }),
  query: z.object({
    type: z.enum(['360-image', '360-video', 'vr-room']).optional(),
    isExclusive: z.boolean().optional(),
    sortBy: z.enum(['recent', 'popular', 'trending']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
  params: z.object({
    id: z.string().optional(),
  }),
}); 