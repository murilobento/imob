import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Search, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { maskCEP, maskCurrency, formatCurrency } from '@/lib/masks'
import { createRealEstate, updateRealEstate, getNextCode } from '../api/real-estate-api'
import { useRealEstate } from './real-estate-provider'
import { type RealEstate } from '../data/schema'
import { getCustomers } from '@/features/customers/api/customers-api'
import { type Customer } from '@/features/customers/data/schema'

const formSchema = z.object({
    id: z.string().optional(), // id is usually handled separately but optional in form
    code: z.string().optional().nullable(),
    title: z.string().min(1, 'Título é obrigatório'),
    type: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'RURAL']),

    street: z.string().optional().nullable(),
    number: z.string().optional().nullable(),
    complement: z.string().optional().nullable(),
    neighborhood: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    zip: z.string().optional().nullable(),

    finality: z.enum(['SALE', 'RENT', 'BOTH']),
    situation: z.enum(['AVAILABLE', 'OCCUPIED', 'UNAVAILABLE']),

    built_area: z.string().optional().nullable(),
    total_area: z.string().optional().nullable(),
    bedrooms: z.string().optional().nullable(),
    suites: z.string().optional().nullable(),
    bathrooms: z.string().optional().nullable(),
    garage_spots: z.string().optional().nullable(),
    is_furnished: z.boolean().default(false).optional(),

    rental_value: z.string().optional().nullable(),
    sale_value: z.string().optional().nullable(),
    condominium_value: z.string().optional().nullable(),
    iptu_value: z.string().optional().nullable(),

    owner_id: z.string().optional().nullable(),
    registry_id: z.string().optional().nullable(),
    registration_id: z.string().optional().nullable(),
    legal_notes: z.string().optional().nullable(),

    photos: z.string().optional().nullable(),
    videos: z.string().optional().nullable(),
    blueprints: z.string().optional().nullable(),

    is_available: z.boolean().default(true).optional(),
})

type RealEstateForm = z.infer<typeof formSchema>

interface Props {
    currentRow?: RealEstate
    open: boolean
    onOpenChange: (open: boolean) => void
    readOnly?: boolean
}

export function RealEstateActionDialog({ currentRow, open, onOpenChange, readOnly }: Props) {
    const { onSuccess } = useRealEstate()
    const [isLoading, setIsLoading] = useState(false)
    const [customers, setCustomers] = useState<Customer[]>([])

    const form = useForm<RealEstateForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            code: '',
            type: 'HOUSE',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zip: '',
            finality: 'SALE',
            situation: 'AVAILABLE',
            built_area: '',
            total_area: '',
            bedrooms: '',
            suites: '',
            bathrooms: '',
            garage_spots: '',
            rental_value: '',
            sale_value: '',
            condominium_value: '',
            iptu_value: '',
            owner_id: '',
            registry_id: '',
            registration_id: '',
            legal_notes: '',
            photos: '',
            videos: '',
            blueprints: '',
            is_available: true,
            is_furnished: false,
        }
    })

    useEffect(() => {
        if (open) {
            getCustomers().then(setCustomers).catch(() => toast.error('Falha ao carregar proprietários'))

            if (currentRow) {
                form.reset({
                    ...currentRow,
                    built_area: currentRow.built_area?.toString(),
                    total_area: currentRow.total_area?.toString(),
                    bedrooms: currentRow.bedrooms?.toString(),
                    suites: currentRow.suites?.toString(),
                    bathrooms: currentRow.bathrooms?.toString(),
                    garage_spots: currentRow.garage_spots?.toString(),
                    rental_value: currentRow.rental_value ? formatCurrency(currentRow.rental_value) : '',
                    sale_value: currentRow.sale_value ? formatCurrency(currentRow.sale_value) : '',
                    condominium_value: currentRow.condominium_value ? formatCurrency(currentRow.condominium_value) : '',
                    iptu_value: currentRow.iptu_value ? formatCurrency(currentRow.iptu_value) : '',
                })
            } else {
                form.reset({
                    title: '',
                    code: '',
                    type: 'HOUSE',
                    street: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    zip: '',
                    finality: 'SALE',
                    situation: 'AVAILABLE',
                    built_area: '',
                    total_area: '',
                    bedrooms: '',
                    suites: '',
                    bathrooms: '',
                    garage_spots: '',
                    rental_value: '',
                    sale_value: '',
                    condominium_value: '',
                    iptu_value: '',
                    owner_id: '',
                    registry_id: '',
                    registration_id: '',
                    legal_notes: '',
                    photos: '',
                    videos: '',
                    blueprints: '',
                    is_available: true,
                    is_furnished: false,
                })
                // Fetch initial code for default type
                getNextCode('HOUSE').then(res => form.setValue('code', res.code))
            }
        }
    }, [open, currentRow, form])

    // Auto-generate code when type changes in creation mode
    useEffect(() => {
        if (!currentRow && open) {
            const subscription = form.watch((value, { name }) => {
                if (name === 'type' && value.type) {
                    getNextCode(value.type).then(res => form.setValue('code', res.code))
                }
            })
            return () => subscription.unsubscribe()
        }
    }, [form, currentRow, open])

    const onSubmit = async (values: RealEstateForm) => {
        setIsLoading(true)
        try {
            const dbValues = {
                ...values,
                built_area: values.built_area ? parseFloat(values.built_area) : null,
                total_area: values.total_area ? parseFloat(values.total_area) : null,
                bedrooms: values.bedrooms ? parseInt(values.bedrooms) : null,
                suites: values.suites ? parseInt(values.suites) : null,
                bathrooms: values.bathrooms ? parseInt(values.bathrooms) : null,
                garage_spots: values.garage_spots ? parseInt(values.garage_spots) : null,
                rental_value: values.rental_value ? parseFloat(values.rental_value.replace(/\D/g, '')) / 100 : null,
                sale_value: values.sale_value ? parseFloat(values.sale_value.replace(/\D/g, '')) / 100 : null,
                condominium_value: values.condominium_value ? parseFloat(values.condominium_value.replace(/\D/g, '')) / 100 : null,
                iptu_value: values.iptu_value ? parseFloat(values.iptu_value.replace(/\D/g, '')) / 100 : null,
                owner_id: values.owner_id || null,
            }

            if (currentRow?.id) {
                await updateRealEstate(currentRow.id, dbValues)
                toast.success('Imóvel atualizado!')
            } else {
                await createRealEstate(dbValues)
                toast.success('Imóvel criado!')
            }
            onOpenChange(false)
            onSuccess?.()
        } catch (_err) {
            toast.error('Erro ao salvar imóvel')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchAddressByCep = async (cepValue: string) => {
        const cep = cepValue.replace(/\D/g, '')
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
                // ignore
            }
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] overflow-hidden sm:max-w-5xl'>
                <DialogHeader>
                    <div className='flex items-center justify-between w-full'>
                        <div className="flex items-center gap-4">
                            <DialogTitle>{currentRow ? 'Editar Imóvel' : 'Novo Imóvel'}</DialogTitle>
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
                                <Switch
                                    id="available"
                                    checked={form.watch('is_available')}
                                    onCheckedChange={v => form.setValue('is_available', v)}
                                    disabled={readOnly}
                                    className="data-[state=checked]:bg-green-500"
                                />
                                <Label htmlFor="available" className="text-sm font-medium cursor-pointer">
                                    {form.watch('is_available') ? 'Disponível' : 'Indisponível'}
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogDescription>
                        Preencha os dados do imóvel abaixo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='h-full'>
                        <ScrollArea className='h-[60vh] pr-4'>
                            <Tabs defaultValue="main" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="main">Dados Principais</TabsTrigger>
                                    <TabsTrigger value="address">Endereço</TabsTrigger>
                                    <TabsTrigger value="docs">Docs & Mídia</TabsTrigger>
                                </TabsList>

                                {/* MAIN DATA (Merged: Identification, Characteristics, Values) */}
                                <TabsContent value="main" className="space-y-6">
                                    {/* Section: Identification */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <FormField control={form.control} name="type" render={({ field }) => (
                                            <FormItem className="md:col-span-3">
                                                <FormLabel>Tipo</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly || !!currentRow}>
                                                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="HOUSE">Casa</SelectItem>
                                                        <SelectItem value="APARTMENT">Apto</SelectItem>
                                                        <SelectItem value="LAND">Terreno</SelectItem>
                                                        <SelectItem value="COMMERCIAL">Coml</SelectItem>
                                                        <SelectItem value="RURAL">Rural</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="code" render={({ field }) => (
                                            <FormItem className="md:col-span-3">
                                                <FormLabel>Código</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={true} className="bg-muted" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="title" render={({ field }) => (
                                            <FormItem className="md:col-span-6">
                                                <FormLabel>Título do Anúncio</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="finality" render={({ field }) => (
                                            <FormItem className="md:col-span-3">
                                                <FormLabel>Finalidade</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="SALE">Venda</SelectItem>
                                                        <SelectItem value="RENT">Locação</SelectItem>
                                                        <SelectItem value="BOTH">Ambos</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="owner_id" render={({ field }) => (
                                            <FormItem className="md:col-span-6">
                                                <FormLabel>Proprietário</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                                disabled={readOnly}
                                                            >
                                                                {field.value
                                                                    ? customers.find(c => c.id === field.value)?.name
                                                                    : "Selecione o proprietário"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Buscar proprietário..." />
                                                            <CommandList>
                                                                <CommandEmpty>Nenhum proprietário encontrado.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {customers.map((c) => (
                                                                        <CommandItem
                                                                            value={c.name}
                                                                            key={c.id}
                                                                            onSelect={() => {
                                                                                form.setValue("owner_id", c.id!)
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    c.id === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {c.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="is_furnished" render={({ field }) => (
                                            <FormItem className="md:col-span-3">
                                                <FormLabel>Mobiliado?</FormLabel>
                                                <FormControl>
                                                    <div className="flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={readOnly} />
                                                        <span className="ml-2 text-muted-foreground text-xs">{field.value ? 'Sim' : 'Não'}</span>
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                    </div>

                                    <div className="border-t my-4" />

                                    {/* Section: Characteristics */}
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                        <FormField control={form.control} name="built_area" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Área Útil (m²)</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} type="number" readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="total_area" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Área Total (m²)</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} type="number" readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="bedrooms" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dormitórios</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} type="number" readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="suites" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suítes</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} type="number" readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="bathrooms" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Banheiros</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} type="number" readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="garage_spots" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vagas</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} type="number" readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>

                                    <div className="border-t my-4" />

                                    {/* Section: Values */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {(form.watch('finality') === 'SALE' || form.watch('finality') === 'BOTH') && (
                                            <FormField control={form.control} name="sale_value" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Valor de Venda</FormLabel>
                                                    <FormControl><Input {...field} value={field.value || ''} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                        {(form.watch('finality') === 'RENT' || form.watch('finality') === 'BOTH') && (
                                            <>
                                                <FormField control={form.control} name="rental_value" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Valor de Locação</FormLabel>
                                                        <FormControl><Input {...field} value={field.value || ''} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="condominium_value" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Valor Condomínio</FormLabel>
                                                        <FormControl><Input {...field} value={field.value || ''} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="iptu_value" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Valor IPTU</FormLabel>
                                                        <FormControl><Input {...field} value={field.value || ''} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                                    </FormItem>
                                                )} />
                                            </>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* ADDRESS */}
                                <TabsContent value="address" className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-3">
                                        <FormField control={form.control} name="zip" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CEP</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            onChange={e => {
                                                                field.onChange(maskCEP(e.target.value))
                                                                if (e.target.value.length >= 9) fetchAddressByCep(e.target.value)
                                                            }}
                                                            readOnly={readOnly}
                                                        />
                                                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-7">
                                        <FormField control={form.control} name="street" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rua</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormField control={form.control} name="number" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-4">
                                        <FormField control={form.control} name="complement" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Complemento</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-4">
                                        <FormField control={form.control} name="neighborhood" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bairro</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-3">
                                        <FormField control={form.control} name="city" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cidade</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>UF</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} maxLength={2} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </TabsContent>

                                {/* DOCS & MEDIA */}
                                <TabsContent value="docs" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* owner_id was moved to main tab */}
                                        <FormField control={form.control} name="registry_id" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Matrícula</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="registration_id" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registro</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="legal_notes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observações Legais</FormLabel>
                                            <FormControl><Textarea {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />

                                    <div className="grid grid-cols-1 gap-4">
                                        <FormField control={form.control} name="photos" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fotos (URLs por enquanto)</FormLabel>
                                                <FormControl><Textarea placeholder='Cole URLs de imagens separadas por vírgula ou JSON' {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="videos" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vídeos (URLs)</FormLabel>
                                                <FormControl><Textarea {...field} value={field.value || ''} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </ScrollArea>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            {!readOnly && (
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
