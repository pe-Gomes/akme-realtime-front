import { ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useMutation } from '@tanstack/react-query'
import {
  deleteReactionFromMessage,
  reactToMessage,
  type Message,
} from '../server/api'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export function Message({
  id,
  message,
  ammountOfReactions,
  answered = false,
}: {
  id: string
  message: string
  ammountOfReactions: number
  answered?: boolean
}) {
  const { roomId } = useParams()
  const [hasReacted, setHasReacted] = useState(false)

  const mutReaction = useMutation({
    mutationKey: [`room-messages-${roomId}`],
    mutationFn: reactToMessage,
    onError: () => {
      toast.error('Falha ao reagir.')
    },
    onSuccess: () => {
      // Disablet due to WerbSocket implementation for real-time updates
      // queryClient.invalidateQueries({
      //   queryKey: [`room-messages-${roomId}`],
      // })
    },
  })

  const mutDeleteReaction = useMutation({
    mutationKey: [`room-messages-${roomId}`],
    mutationFn: deleteReactionFromMessage,
    onError: () => {
      toast.error('Falha ao reagir.')
    },
    onSuccess: () => {
      // Leaving blank due to WebSocket implementation
      // queryClient.invalidateQueries({
      //   queryKey: [`room-messages-${roomId}`],
      // })
    },
  })

  function handleReaction() {
    if (hasReacted) {
      mutDeleteReaction.mutate({ roomId: roomId!, messageId: id })
    } else {
      mutReaction.mutate({ roomId: roomId!, messageId: id })
    }

    setHasReacted((prev) => !prev)
  }

  return (
    <li
      className={cn(
        'ml-4 leading-relaxed text-zinc-100',
        answered && 'opacity-50 pointer-events-none'
      )}
    >
      {message}
      <button
        onClick={handleReaction}
        className={cn(
          'mt-3 flex items-center gap-2 text-sm font-medium ',
          hasReacted
            ? 'text-orange-400 hover:text-orange-500'
            : 'text-zinc-400 hover:text-zinc-300'
        )}
      >
        <ArrowUp className="size-3" /> Curtir pergunta ({ammountOfReactions})
      </button>
    </li>
  )
}
