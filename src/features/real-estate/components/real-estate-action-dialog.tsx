import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { maskCEP, maskCurrency } from '@/lib/masks'
import { createRealEstate, updateRealEstate } from '../api/real-estate-api'
import { useRealEstate } from './real-estate-provider'
import { type RealEstate } from '../data/schema'
import { getCustomers } from '@/features/customers/api/customers-api'
import { type Customer } from '@/features/customers/data/schema'

const formSchema = z.object({
    id: z.string().optional(),
    code: z.string().optional(),
    title: z.string().min(1, 'Título é obrigatório'),
    type: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'RURAL']),

    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),

    finality: z.enum(['SALE', 'RENT', 'BOTH']),
    situation: z.enum(['AVAILABLE', 'OCCUPIED', 'UNAVAILABLE']),

    built_area: z.string().optional(),
    total_area: z.string().optional(),
    bedrooms: z.string().optional(),
    suites: z.string().optional(),
    bathrooms: z.string().optional(),
    garage_spots: z.string().optional(),
    is_furnished: z.boolean().default(false).optional(),

    rental_value: z.string().optional(),
    sale_value: z.string().optional(),
    condominium_value: z.string().optional(),
    iptu_value: z.string().optional(),

    owner_id: z.string().optional(),
    registry_id: z.string().optional(),
    registration_id: z.string().optional(),
    legal_notes: z.string().optional(),

    photos: z.string().optional(),
    videos: z.string().optional(),
    blueprints: z.string().optional(),

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
                    rental_value: currentRow.rental_value ? maskCurrency(currentRow.rental_value.toString()) : '',
                    sale_value: currentRow.sale_value ? maskCurrency(currentRow.sale_value.toString()) : '',
                    condominium_value: currentRow.condominium_value ? maskCurrency(currentRow.condominium_value.toString()) : '',
                    iptu_value: currentRow.iptu_value ? maskCurrency(currentRow.iptu_value.toString()) : '',
                })
            } else {
                form.reset({
                    title: '',
                    type: 'HOUSE',
                    finality: 'SALE',
                    situation: 'AVAILABLE',
                    is_available: true,
                    is_furnished: false,
                })
            }
        }
    }, [open, currentRow, form])

    const onSubmit = async (values: RealEstateForm) => {
        setIsLoading(true)
        try {
            const dbValues = {
                ...values,
                built_area: values.built_area ? parseFloat(values.built_area) : undefined,
                total_area: values.total_area ? parseFloat(values.total_area) : undefined,
                bedrooms: values.bedrooms ? parseInt(values.bedrooms) : undefined,
                suites: values.suites ? parseInt(values.suites) : undefined,
                bathrooms: values.bathrooms ? parseInt(values.bathrooms) : undefined,
                garage_spots: values.garage_spots ? parseInt(values.garage_spots) : undefined,
                rental_value: values.rental_value ? parseFloat(values.rental_value.replace(/\D/g, '')) / 100 : undefined,
                sale_value: values.sale_value ? parseFloat(values.sale_value.replace(/\D/g, '')) / 100 : undefined,
                condominium_value: values.condominium_value ? parseFloat(values.condominium_value.replace(/\D/g, '')) / 100 : undefined,
                iptu_value: values.iptu_value ? parseFloat(values.iptu_value.replace(/\D/g, '')) / 100 : undefined,
                owner_id: values.owner_id || undefined,
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
        } catch (err) {
            toast.error('Erro ao salvar imóvel')
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
                // ignore
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] overflow-hidden sm:max-w-5xl'>
                <DialogHeader>
                    <div className='flex items-center justify-between'>
                        <DialogTitle>{currentRow ? 'Editar Imóvel' : 'Novo Imóvel'}</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="available">Disponível</Label>
                            <Switch
                                id="available"
                                checked={form.watch('is_available')}
                                onCheckedChange={v => form.setValue('is_available', v)}
                                disabled={readOnly}
                            />
                        </div>
                    </div>
                    <DialogDescription>
                        Preencha os dados do imóvel abaixo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='h-full'>
                        <ScrollArea className='h-[60vh] pr-4'>
                            <Tabs defaultValue="identification" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="identification">Identificação</TabsTrigger>
                                    <TabsTrigger value="address">Endereço</TabsTrigger>
                                    <TabsTrigger value="characteristics">Características</TabsTrigger>
                                    <TabsTrigger value="values">Valores</TabsTrigger>
                                    <TabsTrigger value="docs">Docs & Mídia</TabsTrigger>
                                </TabsList>

                                {/* IDENTIFICATION */}
                                <TabsContent value="identification" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="title" render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Título do Anúncio</FormLabel>
                                            <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="code" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código (Ref)</FormLabel>
                                            <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Imóvel</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="HOUSE">Casa</SelectItem>
                                                    <SelectItem value="APARTMENT">Apartamento</SelectItem>
                                                    <SelectItem value="LAND">Terreno</SelectItem>
                                                    <SelectItem value="COMMERCIAL">Comercial</SelectItem>
                                                    <SelectItem value="RURAL">Rural</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="finality" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Finalidade</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="SALE">Venda</SelectItem>
                                                    <SelectItem value="RENT">Locação</SelectItem>
                                                    <SelectItem value="BOTH">Venda e Locação</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="situation" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Situação</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="AVAILABLE">Disponível</SelectItem>
                                                    <SelectItem value="OCCUPIED">Ocupado</SelectItem>
                                                    <SelectItem value="UNAVAILABLE">Indisponível</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
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
                                                            onChange={e => {
                                                                field.onChange(maskCEP(e.target.value))
                                                                if (e.target.value.length >= 9) handleCepBlur({ target: { value: e.target.value } } as any)
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
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormField control={form.control} name="number" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-4">
                                        <FormField control={form.control} name="complement" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Complemento</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-4">
                                        <FormField control={form.control} name="neighborhood" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bairro</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-3">
                                        <FormField control={form.control} name="city" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cidade</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>UF</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} maxLength={2} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </TabsContent>

                                {/* CHARACTERISTICS */}
                                <TabsContent value="characteristics" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <FormField control={form.control} name="built_area" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Área Útil (m²)</FormLabel>
                                            <FormControl><Input {...field} type="number" readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="total_area" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Área Total (m²)</FormLabel>
                                            <FormControl><Input {...field} type="number" readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="bedrooms" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dormitórios</FormLabel>
                                            <FormControl><Input {...field} type="number" readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="suites" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suítes</FormLabel>
                                            <FormControl><Input {...field} type="number" readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="bathrooms" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Banheiros</FormLabel>
                                            <FormControl><Input {...field} type="number" readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="garage_spots" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vagas</FormLabel>
                                            <FormControl><Input {...field} type="number" readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="col-span-2 flex items-center gap-2 pt-6">
                                        <Label>Mobiliado?</Label>
                                        <FormField control={form.control} name="is_furnished" render={({ field }) => (
                                            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={readOnly} />
                                        )} />
                                    </div>
                                </TabsContent>

                                {/* VALUES */}
                                <TabsContent value="values" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="sale_value" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor de Venda</FormLabel>
                                            <FormControl><Input {...field} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="rental_value" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor de Locação</FormLabel>
                                            <FormControl><Input {...field} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="condominium_value" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor Condomínio</FormLabel>
                                            <FormControl><Input {...field} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="iptu_value" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor IPTU</FormLabel>
                                            <FormControl><Input {...field} onChange={e => field.onChange(maskCurrency(e.target.value))} readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                </TabsContent>

                                {/* DOCS & MEDIA */}
                                <TabsContent value="docs" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="owner_id" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Proprietário</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {customers.map(c => (
                                                            <SelectItem key={c.id} value={c.id!}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="registry_id" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Matrícula</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="registration_id" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registro</FormLabel>
                                                <FormControl><Input {...field} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="legal_notes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observações Legais</FormLabel>
                                            <FormControl><Textarea {...field} readOnly={readOnly} /></FormControl>
                                        </FormItem>
                                    )} />

                                    <div className="grid grid-cols-1 gap-4">
                                        <FormField control={form.control} name="photos" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fotos (URLs por enquanto)</FormLabel>
                                                <FormControl><Textarea placeholder='Cole URLs de imagens separadas por vírgula ou JSON' {...field} readOnly={readOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="videos" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vídeos (URLs)</FormLabel>
                                                <FormControl><Textarea {...field} readOnly={readOnly} /></FormControl>
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
        </Dialog>
    )
}
