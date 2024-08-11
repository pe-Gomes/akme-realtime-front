import { Icons } from '../assets/icons'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createRoom } from '../server/api'
import { toast } from 'sonner'

const formSchema = z.object({
  theme: z
    .string()
    .min(2, { message: 'Nome da sala deve ter no mínimo 2 caracteres.' }),
})

export function CreateRoom() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const navigate = useNavigate()
  const mut = useMutation({
    mutationKey: ['create-room'],
    mutationFn: createRoom,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success('Sala criada com sucesso!')
      navigate(`/room/${data.id}`)
    },
  })

  function handleSubmit(data: z.infer<typeof formSchema>) {
    mut.mutate(data)
  }

  return (
    <main className="h-screen flex items-center justify-center px-4">
      <div className="max-w-[450px] flex flex-col items-center gap-6">
        <Icons.logo className="h-10" />
        <p className="leading-relaxed text-center text-zinc-300">
          Crie uma sala pública do Ask.me anything e priorize as perguntas mais
          importantes para a comunidade.
        </p>

        <form
          {...form}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="relative flex gap-2 bg-zinc-900 justify-between items-center rounded-lg p-2 border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1"
        >
          <label className="hidden aria-readonly:hidden">Theme</label>
          <input
            {...form.register('theme')}
            className="flex-1 bg-transparent mx-2 my-2 outline-none placeholder:text-zinc-500 text-zinc-100"
            autoComplete="off"
            type="text"
            name="theme"
            placeholder="Nome da sala"
            inputMode="text"
          />
          <p className="absolute -bottom-6 text-red-300 text-xs">
            {form.formState.errors.theme?.message}
          </p>
          <button
            type="submit"
            className="flex items-center justify-center bg-orange-400 px-3 py-1.5 rounded-lg text-sm text-orange-950 gap-1.5 hover:bg-orange-500 transition-colors"
          >
            Criar sala
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin text-orange-900" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
