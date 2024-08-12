import { useParams } from 'react-router-dom'
import { Icons } from '../assets/icons'
import { ArrowRight, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Messages } from '../components/messages'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMessage } from '../server/api'
import { useMutation } from '@tanstack/react-query'

const formSchema = z.object({
  message: z.string().min(1, { message: 'O campo não pode estar vazio.' }),
})

export function Room() {
  const { roomId } = useParams()
  function handleShareRoom() {
    const url = window.location.href
    if (navigator.share !== undefined && navigator.canShare()) {
      navigator.share({ url })
    } else {
      navigator.clipboard.writeText(url)
    }

    toast.info('Link da sala copiado com sucesso!')
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const mut = useMutation({
    mutationKey: [`room-messages-${roomId}`],
    mutationFn: createMessage,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Mensagem criada com sucesso!')
    },
  })

  function handleSubmit(data: z.infer<typeof formSchema>) {
    mut.mutate({ message: data.message, roomId: roomId! })
  }

  return (
    <section className="mx-auto max-w-sm md:max-w-2xl xl:max-w-4xl flex flex-col gap-6 py-10 px-4">
      <header className="flex items-center gap-3 px-3">
        <a href="/">
          <Icons.logo className="h-5" />
        </a>
        <span className="text-sm text-zinc-500 truncate">
          Código da sala: <span className="text-zinc-300">{roomId}</span>
        </span>

        <button
          onClick={handleShareRoom}
          className="ml-auto flex items-center justify-center bg-zinc-800 px-3 py-1.5 rounded-lg text-sm text-zinc-300 gap-1.5 hover:bg-zinc-700 transition-colors"
        >
          Compartilhar
          <Share2 className="size-4" />
        </button>
      </header>
      <div className="h-px w-full bg-zinc-900" />
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="relative flex gap-2 bg-zinc-900 justify-between items-center rounded-lg p-2 border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1"
      >
        <input
          {...form.register('message')}
          className="flex-1 bg-transparent mx-2 outline-none placeholder:text-zinc-500 text-zinc-100"
          type="text"
          inputMode="text"
          autoComplete="off"
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-orange-400 px-3 py-1.5 rounded-lg text-sm text-orange-950 gap-1.5 hover:bg-orange-500 transition-colors"
        >
          Criar pergunta
          <ArrowRight className="size-4" />
        </button>
        <p className="absolute -bottom-6 text-red-300 text-xs">
          {form.formState.errors.message?.message?.toString()}
        </p>
      </form>

      <Messages />
    </section>
  )
}
