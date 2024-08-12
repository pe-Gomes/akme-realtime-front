import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getRoomMessages } from '../server/api'
import { Message } from './message'
import { useWebSocketMessage } from '../hooks/use-ws-message'

export function Messages() {
  const { roomId } = useParams()
  if (!roomId) {
    throw new Error('roomId is required in this component')
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: [`room-messages-${roomId}`],
    queryFn: () => getRoomMessages({ roomId: roomId! }),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  useWebSocketMessage({ roomId })

  if (isLoading) return <div className="p-8">Carregando...</div>
  if (isError) return <div className="p-8">Erro ao carregar as mensagens</div>

  const sortedMessages = data?.messages.sort((a, b) => {
    return b.reactionCount - a.reactionCount
  })

  return (
    <ol className="list-decimal list-outside pl-4 px-3 space-y-8">
      {sortedMessages?.map((message) => (
        <Message
          key={`message-${message.id}`}
          id={message.id}
          message={message.messsage}
          ammountOfReactions={message.reactionCount}
          answered={message.answered}
        />
      ))}

      {data?.messages.length === 0 && (
        <p className="text-zinc-300 mt-4">Ainda não existem mensagens.</p>
      )}
    </ol>
  )
}
