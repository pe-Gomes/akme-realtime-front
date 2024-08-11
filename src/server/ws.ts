import { z } from 'zod'

export const WSMessage = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('message_created'),
    value: z.object({
      ID: z.string().uuid(),
      Message: z.string(),
    }),
  }),
  z.object({
    kind: z.literal('message_reacted'),
    value: z.object({
      ID: z.string().uuid(),
      ReactionCount: z.number(),
    }),
  }),
  z.object({
    kind: z.literal('message_answered'),
    value: z.object({
      ID: z.string().uuid(),
      Answered: z.boolean(),
    }),
  }),
])

export type WSMessage = z.infer<typeof WSMessage>
