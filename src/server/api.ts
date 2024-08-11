import { z } from 'zod'
import { env } from '../@env'

class APIError extends Error {
  constructor(data: ZodApiError) {
    super(data?.message ?? 'Algo deu errado, tente novamente.')
  }
}

interface CreateRoomRequest {
  theme: string
}

const apiError = z.object({ message: z.string() }).optional()
type ZodApiError = z.infer<typeof apiError>

export async function createRoom(data: CreateRoomRequest) {
  try {
    const res = await fetch(`${env.API_URL}/rooms`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const parsedRes = z
      .object({ id: z.string().uuid() })
      .parse(await res.json())

    return parsedRes
  } catch (err: unknown) {
    const isZodError = err instanceof z.ZodError
    if (isZodError) {
      console.log(
        'zod error on createRoom API call:',
        err.flatten().fieldErrors
      )
    }

    const parsedErr = apiError.safeParse(err)

    if (parsedErr.success && !isZodError) {
      throw new APIError(parsedErr.data)
    }
    throw new APIError(undefined)
  }
}

const room = z
  .object({
    id: z.string().uuid(),
    theme: z.string(),
    created_at: z.date(),
  })
  .transform((data) => ({
    id: data.id,
    theme: data.theme,
    createdAt: data.created_at,
  }))
export type Room = z.infer<typeof room>

export async function getRooms(): Promise<Room[]> {
  try {
    const res = await fetch(`${env.API_URL}/rooms`, {
      method: 'GET',
    })

    const parsedRes = z.array(room).parse(await res.json())

    return parsedRes
  } catch (err: unknown) {
    const isZodError = err instanceof z.ZodError
    if (isZodError) {
      console.log('zod error on getRooms API call:', err.flatten().fieldErrors)
    }

    const parsedErr = apiError.safeParse(err)

    if (parsedErr.success && !isZodError) {
      throw new APIError(parsedErr.data)
    }
    throw new APIError(undefined)
  }
}

const message = z
  .object({
    id: z.string().uuid(),
    room_id: z.string().uuid(),
    message: z.string(),
    reaction_count: z.number(),
    answered: z.boolean(),
    created_at: z.coerce.date(),
  })
  .transform((data) => ({
    id: data.id,
    messsage: data.message,
    roomId: data.room_id,
    reactionCount: data.reaction_count,
    answered: data.answered,
    createdAt: data.created_at,
  }))
export type Message = z.infer<typeof message>

export async function getRoomMessages({ roomId }: { roomId: string }) {
  try {
    const res = await fetch(`${env.API_URL}/rooms/${roomId}/messages`)

    const parsedRes = z
      .object({ messages: z.array(message) })
      .parse(await res.json())
    return parsedRes
  } catch (err: unknown) {
    const isZodError = err instanceof z.ZodError
    if (isZodError) {
      console.log(
        'zod error on getRoomMessages API call:',
        err.flatten().fieldErrors
      )
    }

    const parsedErr = apiError.safeParse(err)
    if (parsedErr.success && !isZodError) {
      throw new APIError(parsedErr.data)
    }
    throw new APIError(undefined)
  }
}

interface CreateMessageRequest {
  message: string
  roomId: string
}

export async function createMessage(data: CreateMessageRequest) {
  try {
    const res = await fetch(`${env.API_URL}/rooms/${data.roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message: data.message }),
    })
    const parsedRes = z
      .object({ id: z.string().uuid() })
      .parse(await res.json())
    return parsedRes
  } catch (err: unknown) {
    const isZodError = err instanceof z.ZodError
    if (isZodError) {
      console.log(
        'zod error on createMessage API call:',
        err.flatten().fieldErrors
      )
    }
    const parsedErr = apiError.safeParse(err)
    if (parsedErr.success && !isZodError) {
      throw new APIError(parsedErr.data)
    }
    throw new APIError(undefined)
  }
}

export async function reactToMessage({
  roomId,
  messageId,
}: {
  roomId: string
  messageId: string
}) {
  try {
    const res = await fetch(
      `${env.API_URL}/rooms/${roomId}/messages/${messageId}/react`,
      {
        method: 'PATCH',
      }
    )
    const parsedRes = z
      .object({ reaction_count: z.number() })
      .transform((data) => ({
        reactionCount: data.reaction_count,
      }))
      .parse(await res.json())
    return parsedRes
  } catch (err: unknown) {
    const isZodError = err instanceof z.ZodError
    if (isZodError) {
      console.log(
        'zod error on reactToMessage API call:',
        err.flatten().fieldErrors
      )
    }
    const parsedErr = apiError.safeParse(err)
    if (parsedErr.success && !isZodError) {
      throw new APIError(parsedErr.data)
    }
    throw new APIError(undefined)
  }
}

export async function deleteReactionFromMessage({
  roomId,
  messageId,
}: {
  roomId: string
  messageId: string
}) {
  try {
    const res = await fetch(
      `${env.API_URL}/rooms/${roomId}/messages/${messageId}/react`,
      {
        method: 'DELETE',
      }
    )
    const parsedRes = z
      .object({ reaction_count: z.number() })
      .transform((data) => ({
        reactionCount: data.reaction_count,
      }))
      .parse(await res.json())
    return parsedRes
  } catch (err: unknown) {
    const isZodError = err instanceof z.ZodError
    if (isZodError) {
      console.log(
        'zod error on reactToMessage API call:',
        err.flatten().fieldErrors
      )
    }
    const parsedErr = apiError.safeParse(err)
    if (parsedErr.success && !isZodError) {
      throw new APIError(parsedErr.data)
    }
    throw new APIError(undefined)
  }
}
