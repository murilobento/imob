'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { updateUser } from '@/features/users/api/users-api'

const accountFormSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório.'),
    email: z.email({ message: 'Email é obrigatório.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
  })
  .refine(
    (data) => {
      // If password is provided, validate length
      if (data.password && data.password.length < 8) return false
      return true
    },
    { message: 'A senha deve ter pelo menos 8 caracteres.', path: ['password'] }
  )
  .refine(
    (data) => {
      // If password is provided, validation match
      if (data.password !== data.confirmPassword) return false
      return true
    },
    { message: 'As senhas não coincidem.', path: ['confirmPassword'] }
  )

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { user, setUser } = useAuthStore((state) => ({ user: state.auth.user, setUser: state.auth.setUser }))
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  })

  // Update form default values if user data is loaded late
  useEffect(() => {
    if (user) {
      form.setValue('name', user.name)
      form.setValue('email', user.email)
    }
  }, [user, form])

  async function onSubmit(data: AccountFormValues) {
    if (!user) return

    setIsLoading(true)
    try {
      const updatedUser = await updateUser(user.id, {
        name: data.name,
        email: data.email,
        ...(data.password ? { password: data.password } : {}),
      })

      // Update local store
      setUser({ ...user, ...updatedUser })

      toast.success('Conta atualizada com sucesso!')
      form.reset({
        name: data.name,
        email: data.email,
        password: '',
        confirmPassword: '',
      })
    } catch {
      toast.error('Falha ao atualizar conta')
    } finally {
      setIsLoading(false)
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder='Seu nome' {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='seu@email.com' {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Deixe em branco para manter a atual'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Deixe em branco para manter a atual'
                  {...field}
                  disabled={isLoading || !isPasswordTouched}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Salvar alterações
          </Button>
        </div>
      </form>
    </Form>
  )
}
