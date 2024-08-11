import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { WSMessage } from '../server/ws'
import { Message } from '../server/api'
import { env } from '../@env'

interface UseWebSocketMessageArgs {
  roomId: string
}

export function useWebSocketMessage({ roomId }: UseWebSocketMessageArgs) {
  const queryClient = useQueryClient()
  useEffect(() => {
    const ws = new WebSocket(`${env.WS_URL}/subscribe/${roomId}`)
    ws.onopen = () => {
      console.log('Connected to WS')
    }

    ws.onclose = () => {
      console.log('Disconnected from WS')
    }

    ws.onmessage = (event) => {
      try {
        const data = WSMessage.parse(JSON.parse(event.data))

        switch (data.kind) {
          case 'message_created':
            queryClient.setQueryData(
              [`room-messages-${roomId}`],
              (state: { messages: Message[] } | undefined) => {
                return {
                  messages: [
                    ...(state?.messages ?? []),
                    {
                      id: data.value.ID,
                      roomId: roomId!,
                      messsage: data.value.Message,
                      reactionCount: 0,
                      answered: false,
                      createdAt: new Date(),
                    } satisfies Message,
                  ],
                }
              }
            )
            break
          case 'message_reacted':
            queryClient.setQueryData(
              [`room-messages-${roomId}`],
              (state: { messages: Message[] } | undefined) => {
                if (!state) return

                return {
                  messages: state.messages.map((msg) => {
                    if (msg.id === data.value.ID) {
                      return {
                        ...msg,
                        reactionCount: data.value.ReactionCount,
                      }
                    }
                    return msg
                  }),
                }
              }
            )
            break
          case 'message_answered':
            queryClient.setQueryData(
              [`room-messages-${roomId}`],
              (state: { messages: Message[] } | undefined) => {
                if (!state) return

                return {
                  messages: state.messages.map((msg) => {
                    if (msg.id === data.value.ID) {
                      return {
                        ...msg,
                        answered: data.value.Answered,
                      }
                    }
                    return msg
                  }),
                }
              }
            )
            break
        }
      } catch (error) {
        console.error('Failed to parse WS message', error)
      }
    }

    return () => {
      ws.close()
    }
  }, [roomId, queryClient])
}
