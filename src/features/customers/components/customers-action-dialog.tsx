import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { maskCEP, maskCNPJ, maskCPF, maskCurrency, maskIE, maskPhone, maskRG } from '@/lib/masks'
import { createCustomer, updateCustomer } from '../api/customers-api'
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Nome é obrigatório.'),
    type: z.enum(['FISICA', 'JURIDICA']),
    document: z.string().optional(),
    rg: z.string().optional(),
    issuing_organ: z.string().optional(),
    state_inscription: z.string().optional(),
    phone: z.string().optional(),
    alt_phone: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    interest: z.array(z.string()).optional(), // Changed to array for multi-select
    property_type: z.string().optional(),
    value_range: z.string().optional(),
    observations: z.string().optional(),
    status: z.enum(['active', 'inactive']),
})

type CustomerForm = z.infer<typeof formSchema>

interface CustomerActionDialogProps {
    currentRow?: Customer
    open: boolean
    onOpenChange: (open: boolean) => void
    readOnly?: boolean
}

const INTEREST_OPTIONS = [
    { id: 'BUY', label: 'Comprar' },
    { id: 'RENT', label: 'Alugar' },
    { id: 'SELL', label: 'Vender' },
    { id: 'INVEST', label: 'Investir' }, // Added another option example
]

export function CustomersActionDialog({
    currentRow,
    open,
    onOpenChange,
    readOnly,
}: CustomerActionDialogProps) {
    const { onSuccess } = useCustomers()
    const [isLoading, setIsLoading] = useState(false)
    const isEdit = !!currentRow

    const form = useForm<CustomerForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: 'FISICA',
            document: '',
            rg: '',
            issuing_organ: '',
            state_inscription: '',
            phone: '',
            alt_phone: '',
            email: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zip: '',
            interest: [],
            property_type: '',
            value_range: '',
            observations: '',
        },
    })

    // Watch type to conditionally render fields or change masks
    const type = form.watch('type')
    const uf = form.watch('state') || ''

    useEffect(() => {
        if (currentRow) {
            const interests = currentRow.interest ? currentRow.interest.split(',') : []
            form.reset({
                ...currentRow,
                interest: interests,
            })
        } else {
            form.reset({
                name: '',
                type: 'FISICA',
                document: '',
                rg: '',
                issuing_organ: '',
                state_inscription: '',
                phone: '',
                alt_phone: '',
                email: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                zip: '',
                interest: [],
                property_type: '',
                value_range: '',
                observations: '',
                status: 'active',
            })
        }
    }, [currentRow, form, open])

    const onSubmit = async (values: CustomerForm) => {
        setIsLoading(true)
        try {
            // Convert array back to string for DB and remove formatting from masked fields
            const dbValues = {
                ...values,
                interest: values.interest?.join(','),
                // Remove formatting from masked fields - keep only numbers
                rg: values.rg?.replace(/\D/g, ''),
                state_inscription: values.state_inscription?.replace(/\D/g, ''),
                value_range: values.value_range?.replace(/\D/g, ''),
            }

            if (isEdit && currentRow?.id) {
                await updateCustomer(currentRow.id, dbValues)
                toast.success('Cliente atualizado com sucesso!')
            } else {
                await createCustomer(dbValues)
                toast.success('Cliente criado com sucesso!')
            }
            onOpenChange(false)
            onSuccess?.()
        } catch {
            toast.error('Erro ao salvar cliente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '')
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const data = await res.json()
                if (!data.erro) {
                    form.setValue('street', data.logradouro)
                    form.setValue('neighborhood', data.bairro)
                    form.setValue('city', data.localidade)
                    form.setValue('state', data.uf)
                    form.setFocus('number')
                }
            } catch {
                // Silently fail CEP lookup
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[85vh] overflow-hidden sm:max-w-4xl'>
                <DialogHeader>
                    <div className='flex items-center gap-4'>
                        <DialogTitle>
                            {readOnly
                                ? 'Dados do Cliente'
                                : isEdit
                                    ? 'Editar Cliente'
                                    : 'Novo Cliente'}
                        </DialogTitle>
                        <div className='flex items-center space-x-2'>
                            <Label htmlFor='status-switch' className='text-sm text-muted-foreground'>
                                Inativo
                            </Label>
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <Switch
                                        id='status-switch'
                                        checked={field.value === 'active'}
                                        onCheckedChange={(checked) =>
                                            field.onChange(checked ? 'active' : 'inactive')
                                        }
                                        disabled={readOnly}
                                    />
                                )}
                            />
                            <Label htmlFor='status-switch' className='text-sm text-muted-foreground'>
                                Ativo
                            </Label>
                        </div>
                    </div>
                    <DialogDescription>
                        {readOnly
                            ? 'Visualize os detalhes do cliente.'
                            : 'Preencha os dados do cliente. Clique em salvar quando terminar.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id='customer-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='h-full'
                    >
                        <ScrollArea className='h-[45vh] pr-4'>
                            <Tabs defaultValue='general' className='w-full'>
                                <TabsList className='mb-4 grid w-full grid-cols-4'>
                                    <TabsTrigger value='general'>
                                        <span className='hidden sm:inline'>Dados Gerais</span>
                                        <span className='sm:hidden'>Gerais</span>
                                    </TabsTrigger>
                                    <TabsTrigger value='address'>Endereço</TabsTrigger>
                                    <TabsTrigger value='prefs'>
                                        <span className='hidden sm:inline'>Preferências</span>
                                        <span className='sm:hidden'>Prefs</span>
                                    </TabsTrigger>
                                    <TabsTrigger value='obs'>
                                        <span className='hidden sm:inline'>Observações</span>
                                        <span className='sm:hidden'>Obs</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* --- DADOS GERAIS --- */}
                                <TabsContent value='general' className='min-h-[400px] space-y-4'>
                                    <div className='flex items-center space-x-2'>
                                        <Label htmlFor='type-switch'>Pessoa Física</Label>
                                        <Switch
                                            id='type-switch'
                                            checked={type === 'JURIDICA'}
                                            onCheckedChange={(checked) => {
                                                form.setValue('type', checked ? 'JURIDICA' : 'FISICA')
                                                form.setValue('document', '') // Clear document on switch
                                                form.setValue('rg', '')
                                                form.setValue('state_inscription', '')
                                            }}
                                            disabled={readOnly}
                                        />
                                        <Label htmlFor='type-switch'>Pessoa Jurídica</Label>
                                    </div>

                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem className='col-span-full'>
                                                    <FormLabel>Nome Completo</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} readOnly={readOnly} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='document'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{type === 'FISICA' ? 'CPF' : 'CNPJ'}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => {
                                                                const masked = type === 'FISICA' ? maskCPF(e.target.value) : maskCNPJ(e.target.value)
                                                                field.onChange(masked)
                                                            }}
                                                            readOnly={readOnly}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {type === 'FISICA' ? (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name='rg'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>RG</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(maskRG(e.target.value))}
                                                                    readOnly={readOnly}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='issuing_organ'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Órgão Emissor</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} readOnly={readOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        ) : (
                                            <FormField
                                                control={form.control}
                                                name='state_inscription'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Inscrição Estadual</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                onChange={(e) => field.onChange(maskIE(e.target.value, uf))}
                                                                readOnly={readOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type='email' readOnly={readOnly} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='phone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Telefone</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                            readOnly={readOnly}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='alt_phone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Telefone Alternativo</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                            readOnly={readOnly}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                                {/* --- ENDEREÇO --- */}
                                <TabsContent value='address' className='min-h-[400px]'>
                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
                                        <div className='col-span-1 md:col-span-3'>
                                            <FormField
                                                control={form.control}
                                                name='zip'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>CEP</FormLabel>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <Input
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        field.onChange(maskCEP(e.target.value))
                                                                        if (e.target.value.length >= 9) {
                                                                            handleCepBlur({
                                                                                target: { value: e.target.value },
                                                                            } as React.FocusEvent<HTMLInputElement>)
                                                                        }
                                                                    }}
                                                                    readOnly={readOnly}
                                                                />
                                                                <Search className='absolute right-3 top-2.5 h-4 w-4 text-muted-foreground' />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-1 md:col-span-7'>
                                            <FormField
                                                control={form.control}
                                                name='street'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Rua</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} readOnly={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-1 md:col-span-2'>
                                            <FormField
                                                control={form.control}
                                                name='number'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Número</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} readOnly={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-1 md:col-span-4'>
                                            <FormField
                                                control={form.control}
                                                name='complement'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Complemento</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} readOnly={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-1 md:col-span-3'>
                                            <FormField
                                                control={form.control}
                                                name='neighborhood'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bairro</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} readOnly={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-1 md:col-span-4'>
                                            <FormField
                                                control={form.control}
                                                name='city'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Cidade</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} readOnly={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-1 md:col-span-1'>
                                            <FormField
                                                control={form.control}
                                                name='state'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>UF</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} maxLength={2} readOnly={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* --- PREFERÊNCIAS --- */}
                                <TabsContent value='prefs' className='min-h-[400px] space-y-4'>

                                    <FormField
                                        control={form.control}
                                        name='interest'
                                        render={() => (
                                            <FormItem>
                                                <div className='mb-4'>
                                                    <FormLabel className='text-base'>Interesses</FormLabel>
                                                    <FormDescription>
                                                        Selecione os interesses do cliente.
                                                    </FormDescription>
                                                </div>
                                                <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
                                                    {INTEREST_OPTIONS.map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name='interest'
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className='flex flex-row items-start space-x-3 space-y-0'
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...(field.value || []), item.id])
                                                                                        : field.onChange(
                                                                                            field.value?.filter((value) => value !== item.id)
                                                                                        )
                                                                                }}
                                                                                disabled={readOnly}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className='font-normal'>
                                                                            {item.label}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                        <FormField
                                            control={form.control}
                                            name='property_type'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Imóvel</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} readOnly={readOnly} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='value_range'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Faixa de Valor</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                                                            readOnly={readOnly}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                                {/* --- OBS --- */}
                                <TabsContent value='obs' className='min-h-[400px]'>
                                    <FormField
                                        control={form.control}
                                        name='observations'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Observações</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        className='min-h-[200px]'
                                                        readOnly={readOnly}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>
                        </ScrollArea>

                        <DialogFooter className='mt-4'>
                            {!readOnly && (
                                <Button type='submit' disabled={isLoading}>
                                    {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Salvar
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
