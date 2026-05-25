import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { ajustaMoedaBanco, formatarParaMoedaSemSimbolo, useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Container, Label, Row, Table } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { InputTextArea } from 'Components/ComponentController/Inputs/Text/InputTextArea'
import { InputDate } from 'Components/ComponentController/Inputs/Date/InputDate'
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { CompraItens, ComprasDefaultValues, ComprasModel, isCompraAtiva } from 'interfaces/Compras/ComprasInterface'
import { ComprasService } from 'services/Compras/ComprasService'
import { PlataformasCompraService } from 'services/PlataformasCompra/PlataformasCompraService'
import { ItensService } from 'services/Itens/ItensService'
import { ItensLookup, ItensModel } from 'interfaces/Itens/ItensInterface'

type ItemLookupOption = SelectOptions & {
    tipo_item?: string
    codigo?: string
}

const GRAMATURA_OPTIONS: SelectOptions[] = [
    { value: '500', label: '500g' },
    { value: '1000', label: '1000g' },
    { value: '2000', label: '2000g' },
]

const TIPO_ITEM_FILAMENTO = 'FILAMENTO'

const formatarValorUnitarioReal = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    })
}

const obterValorNumerico = (valor: number | string | null | undefined): number => {
    if (typeof valor === 'string') {
        const parsed = parseFloat(valor.replace(',', '.'))
        return isNaN(parsed) ? 0 : parsed
    }
    const num = Number(valor != null ? valor : 0)
    return isNaN(num) ? 0 : num
}

const calcularSubtotalItens = (itens: CompraItens[]): number => {
    return itens.reduce((acc, item) => acc + obterValorNumerico(item.valor_total), 0)
}

const aplicarValorUnitarioRealItens = (
    itens: CompraItens[],
    frete: number,
    desconto: number,
    taxa: number,
    imposto: number
): CompraItens[] => {
    const subtotal = calcularSubtotalItens(itens)
    const custosAdicionais = frete + taxa + imposto - desconto

    if (subtotal <= 0) {
        return itens
    }

    return itens.map((item) => {
        const valorTotal = obterValorNumerico(item.valor_total)
        const qtdInterna = Number(item.qtd_interna || 0)
        const proporcao = valorTotal / subtotal
        const valorRealTotal = valorTotal + proporcao * custosAdicionais
        const valorUnitarioReal = qtdInterna > 0 ? valorRealTotal / qtdInterna : 0

        return {
            ...item,
            valor_unitario_real: valorUnitarioReal,
        }
    })
}

const formatarQuantidadeLote = (item: CompraItens, quantidade: number | null | undefined): string => {
    if (quantidade == null) return '—'
    if (item.tipo_item === TIPO_ITEM_FILAMENTO) {
        return `${quantidade}g`
    }
    return String(quantidade)
}

const ComprasForm = () => {
    const { state } = useLocation()
    const [record] = useState<ComprasModel>(state ? state.source : ComprasDefaultValues)
    const { register, handleSubmit, control, setValue, getValues, watch, reset, formState: { errors } } = useForm<ComprasModel>({
        defaultValues: {
            ...ComprasDefaultValues,
            ...record,
            valor_frete: record.valor_frete != null ? formatarParaMoedaSemSimbolo(record.valor_frete) : "0,00",
            desconto: record.desconto != null ? formatarParaMoedaSemSimbolo(record.desconto) : "0,00",
            valor_taxa: record.valor_taxa != null ? formatarParaMoedaSemSimbolo(record.valor_taxa) : "0,00",
            valor_imposto: record.valor_imposto != null ? formatarParaMoedaSemSimbolo(record.valor_imposto) : "0,00",
        }
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const comprasService = new ComprasService()
    const plataformasCompraService = new PlataformasCompraService()
    const itensService = new ItensService()

    const [plataformas, setPlataformas] = useState<SelectOptions[]>([])
    const [itemLookupOptions, setItemLookupOptions] = useState<ItemLookupOption[]>([])
    const [itemSelecionadoLookup, setItemSelecionadoLookup] = useState<ItemLookupOption | undefined>()
    const [compraItens, setCompraItens] = useState<CompraItens[]>([])
    const [remoteErrors, setRemoteErrors] = useState<string>("")
    const [subtotalItens, setSubtotalItens] = useState(0)
    const [totalFinal, setTotalFinal] = useState(0)
    const [itemSelectKey, setItemSelectKey] = useState(0)
    const [compraCancelada, setCompraCancelada] = useState(false)

    const freteWatch = watch('valor_frete')
    const descontoWatch = watch('desconto')
    const taxaWatch = watch('valor_taxa')
    const impostoWatch = watch('valor_imposto')
    const itemWatch = watch('id_item')
    const qtdCompraWatch = watch('qtd_compra')
    const gramaturaWatch = watch('gramatura')

    const isFilamento = itemSelecionadoLookup && itemSelecionadoLookup.tipo_item === TIPO_ITEM_FILAMENTO

    const compraItensComValorReal = useMemo(() => {
        const frete = ajustaMoedaBanco(freteWatch || "0,00")
        const desconto = ajustaMoedaBanco(descontoWatch || "0,00")
        const taxa = ajustaMoedaBanco(taxaWatch || "0,00")
        const imposto = ajustaMoedaBanco(impostoWatch || "0,00")

        return aplicarValorUnitarioRealItens(compraItens, frete, desconto, taxa, imposto)
    }, [compraItens, freteWatch, descontoWatch, taxaWatch, impostoWatch])

    const formatarLabelItem = (item: ItensLookup): string => {
        let texto = item.descricao || item.codigo || `Item ${item.id}`
        if (item.codigo && item.descricao) {
            texto = `${item.descricao} (${item.codigo})`
        }
        if (item.tipo_item) {
            return `${item.tipo_item} - ${texto}`
        }
        return texto
    }

    const mapItemToOption = (item: ItensLookup): ItemLookupOption => ({
        value: item.id,
        label: formatarLabelItem(item),
        tipo_item: item.tipo_item,
        codigo: item.codigo,
    })

    const getLookups = async (): Promise<void> => {
        try {
            const plataformasRes = await plataformasCompraService.AsyncListPlataformasCompra({})

            if (plataformasRes) {
                setPlataformas(plataformasRes.map((el: any) => ({ value: el.id, label: el.descricao })))
            }
        } catch (error) {
            console.error("Erro ao carregar lookups:", error)
        }
    }

    const getListItens = async (inputValue: string): Promise<SelectOptions[]> => {
        const itens = await itensService.lookupItens({ search: inputValue })
        if (!itens || !itens.length) return []

        const options = itens.map(mapItemToOption)

        setItemLookupOptions((prev) => {
            const merged = [...prev]
            options.forEach((option) => {
                if (!merged.find((item) => String(item.value) === String(option.value))) {
                    merged.push(option)
                }
            })
            return merged
        })

        return options

    }

    const loadRecord = async (): Promise<void> => {
        if (!record.id) return

        try {
            const view = await comprasService.getViewCompras({ id: record.id })
            if (!view) return

            if (!isCompraAtiva(view.status ?? view.badge_status)) {
                setCompraCancelada(true)
                toast.warning('Esta compra está cancelada e não pode ser editada.')
                navigate(`/compras/view/${record.id}`)
                return
            }

            reset({
                id: view.id != null ? view.id.toString() : null,
                id_plataforma_compra: view.id_plataforma_compra != null ? view.id_plataforma_compra.toString() : null,
                data_compra: view.data_compra || null,
                numero_pedido: view.numero_pedido || null,
                valor_frete: formatarParaMoedaSemSimbolo(view.valor_frete),
                desconto: formatarParaMoedaSemSimbolo(view.desconto),
                valor_taxa: formatarParaMoedaSemSimbolo(view.valor_taxa),
                valor_imposto: formatarParaMoedaSemSimbolo(view.valor_imposto),
                observacao: view.observacao || null,
            })

            if (view.compra_itens && view.compra_itens.length) {
                setCompraItens(view.compra_itens.map((item) => {
                    const qtdCompra = Number(item.qtd_compra || 0)
                    const qtdInterna = Number(item.qtd_interna || 0)
                    let tipo_item = item.tipo_item || null
                    let gramatura = item.gramatura != null ? item.gramatura : null

                    if (!tipo_item && qtdCompra > 0 && qtdInterna % qtdCompra === 0) {
                        const ratio = qtdInterna / qtdCompra
                        if (ratio === 500 || ratio === 1000) {
                            tipo_item = TIPO_ITEM_FILAMENTO
                            gramatura = ratio
                        }
                    }

                    return {
                        ...item,
                        nome_item: item.nome_item || item.item_descricao || null,
                        tipo_item,
                        gramatura,
                        qtd_original: item.qtd_original != null ? item.qtd_original : qtdInterna,
                        qtd_atual: item.qtd_atual != null ? item.qtd_atual : qtdInterna,
                        valor_unitario_compra: item.valor_unitario_compra != null ? item.valor_unitario_compra : 0,
                        valor_total: item.valor_total != null ? item.valor_total : 0,
                        valor_unitario_real: item.valor_unitario_real != null ? item.valor_unitario_real : 0,
                    }
                }))
            }
        } catch (error) {
            console.error("Erro ao carregar compra:", error)
        }
    }

    const calcularTotais = (): void => {
        const subtotal = calcularSubtotalItens(compraItens)

        const frete = ajustaMoedaBanco(freteWatch || "0,00")
        const desconto = ajustaMoedaBanco(descontoWatch || "0,00")
        const taxa = ajustaMoedaBanco(taxaWatch || "0,00")
        const imposto = ajustaMoedaBanco(impostoWatch || "0,00")
        const total = (subtotal + frete + taxa + imposto) - desconto

        setSubtotalItens(subtotal)
        setTotalFinal(total)
    }

    const resetItemForm = (): void => {
        setValue("id_item", null)
        setValue("qtd_compra", null)
        setValue("qtd_interna", null)
        setValue("gramatura", null)
        setValue("valor_unitario_compra", "0,00")
        setItemSelecionadoLookup(undefined)
        setItemSelectKey((prev) => prev + 1)
    }

    const adicionarItem = (): void => {
        setRemoteErrors("")

        const qtdCompra = Number(getValues("qtd_compra"))
        const valorUnitarioCompra = ajustaMoedaBanco(getValues("valor_unitario_compra") || "0,00")
        const gramatura = Number(getValues("gramatura"))

        if (!itemSelecionadoLookup) {
            setRemoteErrors("Selecione um item.")
            return
        }
        if (!qtdCompra || qtdCompra <= 0) {
            setRemoteErrors("Quantidade de compra deve ser maior que zero.")
            return
        }

        let totalInterno: number

        if (isFilamento) {
            if (!gramatura || gramatura <= 0) {
                setRemoteErrors("Gramatura é obrigatória para filamentos.")
                return
            }
            totalInterno = qtdCompra * gramatura
        } else {
            const qtdInternaInput = Number(getValues("qtd_interna"))
            if (!qtdInternaInput || qtdInternaInput <= 0) {
                setRemoteErrors("Quantidade interna deve ser maior que zero.")
                return
            }
            totalInterno = qtdCompra * qtdInternaInput
        }

        if (!valorUnitarioCompra || valorUnitarioCompra <= 0) {
            setRemoteErrors("Valor unitário de compra deve ser maior que zero.")
            return
        }

        const valorTotal = qtdCompra * valorUnitarioCompra

        const novoItem: CompraItens = {
            id_item: Number(itemSelecionadoLookup.value),
            nome_item: itemSelecionadoLookup.label,
            tipo_item: itemSelecionadoLookup.tipo_item || null,
            gramatura: isFilamento ? gramatura : null,
            qtd_compra: qtdCompra,
            qtd_interna: totalInterno,
            qtd_original: totalInterno,
            qtd_atual: totalInterno,
            valor_unitario_compra: valorUnitarioCompra,
            valor_total: valorTotal,
            valor_unitario_real: 0,
        }

        setCompraItens((prev) => [...prev, novoItem])
        resetItemForm()
    }

    const removerItem = (index: number): void => {
        setCompraItens((prev) => prev.filter((_, i) => i !== index))
    }

    const onSubmit: SubmitHandler<ComprasModel> = async (data: any) => {
        try {
            setRemoteErrors("")

            if (compraCancelada) {
                setRemoteErrors("Compras canceladas não podem ser editadas.")
                return
            }

            if (compraItens.length === 0) {
                setRemoteErrors("Adicione ao menos um item à compra.")
                return
            }

            data.valor_frete = ajustaMoedaBanco(data.valor_frete || "0,00")
            data.desconto = ajustaMoedaBanco(data.desconto || "0,00")
            data.valor_taxa = ajustaMoedaBanco(data.valor_taxa || "0,00")
            data.valor_imposto = ajustaMoedaBanco(data.valor_imposto || "0,00")
            data.valor_total = totalFinal
            data.compra_itens = compraItensComValorReal.map((item) => ({
                id: item.id != null ? item.id : null,
                id_compra_item: item.id_compra_item != null ? item.id_compra_item : null,
                id_item: item.id_item,
                qtd_compra: item.qtd_compra,
                qtd_interna: item.qtd_interna,
                qtd_original: item.qtd_original != null ? item.qtd_original : item.qtd_interna,
                qtd_atual: item.qtd_atual != null ? item.qtd_atual : item.qtd_interna,
                valor_unitario_compra: typeof item.valor_unitario_compra === 'string'
                    ? ajustaMoedaBanco(item.valor_unitario_compra)
                    : item.valor_unitario_compra,
                valor_total: typeof item.valor_total === 'string'
                    ? ajustaMoedaBanco(item.valor_total)
                    : item.valor_total,
                valor_unitario_real: typeof item.valor_unitario_real === 'string'
                    ? parseFloat(item.valor_unitario_real.replace(',', '.'))
                    : item.valor_unitario_real,
            }))

            if (record.id) {
                await comprasService.editCompras(data)
            } else {
                const id = await comprasService.createCompras(data)
                setValue('id', id)
            }
            navigate(`/compras`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        getLookups()
        loadRecord()
    }, [])

    useEffect(() => {
        setActiveMenu('/compras')
    }, [])

    useEffect(() => {
        calcularTotais()
    }, [compraItens, freteWatch, descontoWatch, taxaWatch, impostoWatch])

    useEffect(() => {
        if (!itemWatch) {
            setItemSelecionadoLookup(undefined)
            setValue("gramatura", null)
            setValue("qtd_interna", null)
            return
        }

        const found = itemLookupOptions.find((item) => String(item.value) === String(itemWatch))
        if (found) {
            setItemSelecionadoLookup(found)
        }
    }, [itemWatch, itemLookupOptions, setValue])

    useEffect(() => {
        if (!isFilamento) {
            setValue("gramatura", null)
            return
        }

        setValue("qtd_interna", null)

        const qtdCompra = Number(qtdCompraWatch)
        const gramatura = Number(gramaturaWatch)

        if (qtdCompra > 0 && gramatura > 0) {
            setValue("qtd_interna", String(qtdCompra * gramatura))
        }
    }, [isFilamento, qtdCompraWatch, gramaturaWatch, setValue])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/compras"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Compra
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/compras">Compras</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Compra
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <h5 className="mb-3">Dados da Compra</h5>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Plataforma de Compra</Label>
                                                    <SelectListControlled<ComprasModel>
                                                        control={control}
                                                        field="id_plataforma_compra"
                                                        options={plataformas}
                                                        errors={errors.id_plataforma_compra}
                                                        required={required}
                                                        placeholder="Selecione..."
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Número do Pedido</Label>
                                                    <InputTextControlled<ComprasModel>
                                                        field={"numero_pedido"}
                                                        control={control}
                                                        maxLength={{ value: 100, message: "Máximo 100 caracteres" }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Data da Compra</Label>
                                                    <InputDate<ComprasModel>
                                                        field={"data_compra"}
                                                        required={required}
                                                        register={register}
                                                        errors={errors.data_compra}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Valor Frete</Label>
                                                    <InputTextControlled<ComprasModel>
                                                        field={"valor_frete"}
                                                        control={control}
                                                        mask="real"
                                                        type="tel"
                                                        placeholder="0,00"
                                                        onlyPositive={true}
                                                        required={required}
                                                        errors={errors.valor_frete}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Valor Desconto</Label>
                                                    <InputTextControlled<ComprasModel>
                                                        field={"desconto"}
                                                        control={control}
                                                        mask="real"
                                                        type="tel"
                                                        placeholder="0,00"
                                                        onlyPositive={true}
                                                        required={required}
                                                        errors={errors.desconto}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Valor Taxa</Label>
                                                    <InputTextControlled<ComprasModel>
                                                        field={"valor_taxa"}
                                                        control={control}
                                                        mask="real"
                                                        type="tel"
                                                        placeholder="0,00"
                                                        onlyPositive={true}
                                                        required={required}
                                                        errors={errors.valor_taxa}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Valor Imposto</Label>
                                                    <InputTextControlled<ComprasModel>
                                                        field={"valor_imposto"}
                                                        control={control}
                                                        mask="real"
                                                        type="tel"
                                                        placeholder="0,00"
                                                        onlyPositive={true}
                                                        required={required}
                                                        errors={errors.valor_imposto}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Observação</Label>
                                                    <InputTextArea<ComprasModel>
                                                        field={"observacao"}
                                                        register={register}
                                                        rows={3}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr />
                                        <h5 className="mb-3 mt-4">Itens da Compra</h5>
                                        <Row>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Item</Label>
                                                    <AsyncSelectListControlled<ComprasModel>
                                                        key={`item-select-${itemSelectKey}`}
                                                        callback={getListItens}
                                                        field="id_item"
                                                        control={control}
                                                        placeholder="Digite para buscar..."
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Quantidade Compra</Label>
                                                    <InputNumber<ComprasModel>
                                                        field="qtd_compra"
                                                        register={register}
                                                        onlyPositive={true}
                                                        errors={errors.qtd_compra}
                                                    />
                                                </div>
                                            </Col>
                                            {isFilamento ? (
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Quantidade Interna</Label>
                                                        <SelectListControlled<ComprasModel>
                                                            control={control}
                                                            field="gramatura"
                                                            options={GRAMATURA_OPTIONS}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                            ) : (
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Quantidade Interna</Label>
                                                        <InputNumber<ComprasModel>
                                                            field="qtd_interna"
                                                            register={register}
                                                            onlyPositive={true}
                                                            errors={errors.qtd_interna}
                                                        />
                                                    </div>
                                                </Col>
                                            )}
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Valor Unitário Compra</Label>
                                                    <InputTextControlled<ComprasModel>
                                                        field={"valor_unitario_compra"}
                                                        control={control}
                                                        mask="real"
                                                        type="tel"
                                                        placeholder="0,00"
                                                        onlyPositive={true}
                                                        errors={errors.valor_unitario_compra}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={1} className="d-flex align-items-center">
                                                <Button type="button" className="btn btn-primary mt-2" onClick={adicionarItem}>
                                                    <i className="ri-add-circle-line align-middle me-1"></i>
                                                </Button>
                                            </Col>
                                        </Row>

                                        <Row className="mt-3">
                                            <Col md={12}>
                                                <div className="table-responsive">
                                                    <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                                                        <thead>
                                                            <tr className="table-active">
                                                                <th scope="col" style={{ width: "50px" }}>#</th>
                                                                <th scope="col" className="text-start">Item</th>
                                                                <th scope="col">Qtd Compra</th>
                                                                <th scope="col">Gramatura</th>
                                                                <th scope="col">Qtd Interna</th>
                                                                <th scope="col">Qtd Original</th>
                                                                <th scope="col">Qtd Atual</th>
                                                                <th scope="col" className="text-end">Valor Unitário Compra</th>
                                                                <th scope="col" className="text-end">Valor Unitário Real</th>
                                                                <th scope="col" className="text-end">Valor Total</th>
                                                                <th scope="col"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {compraItensComValorReal.map((item, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row">{index + 1}</th>
                                                                    <td className="text-start">{item.nome_item}</td>
                                                                    <td>{item.qtd_compra}</td>
                                                                    <td>
                                                                        {item.tipo_item === TIPO_ITEM_FILAMENTO && item.gramatura
                                                                            ? `${item.gramatura}g`
                                                                            : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {item.tipo_item === TIPO_ITEM_FILAMENTO && item.qtd_interna
                                                                            ? `${item.qtd_interna}g`
                                                                            : (item.qtd_interna != null ? item.qtd_interna : '-')}
                                                                    </td>
                                                                    <td>{formatarQuantidadeLote(item, item.qtd_original != null ? item.qtd_original : item.qtd_interna)}</td>
                                                                    <td>{formatarQuantidadeLote(item, item.qtd_atual != null ? item.qtd_atual : item.qtd_interna)}</td>
                                                                    <td className="text-end">
                                                                        R$ {formatarParaMoedaSemSimbolo(item.valor_unitario_compra)}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        R$ {formatarValorUnitarioReal(Number(item.valor_unitario_real))}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        R$ {formatarParaMoedaSemSimbolo(item.valor_total)}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removerItem(index)}>
                                                                            <i className="las la-trash-alt"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </Row>

                                        {remoteErrors && (
                                            <Row className="mt-3">
                                                <Col md={12}>
                                                    <div className="text-danger fw-bold">{remoteErrors}</div>
                                                </Col>
                                            </Row>
                                        )}

                                        <hr />
                                        <Row className="mt-4">
                                            <Col md={12}>
                                                <div className="d-flex flex-column align-items-end gap-2">
                                                    <div><strong>Subtotal Itens:</strong> R$ {formatarParaMoedaSemSimbolo(subtotalItens)}</div>
                                                    <div><strong>Frete:</strong> R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(freteWatch || "0,00"))}</div>
                                                    <div><strong>Desconto:</strong> R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(descontoWatch || "0,00"))}</div>
                                                    <div><strong>Taxa:</strong> R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(taxaWatch || "0,00"))}</div>
                                                    <div><strong>Imposto:</strong> R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(impostoWatch || "0,00"))}</div>
                                                    <div className="fs-5"><strong>Total Final:</strong> R$ {formatarParaMoedaSemSimbolo(totalFinal)}</div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr />
                                        <Row className="mt-5">
                                            <Col md={12}>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="submit" className="btn btn-primary">Salvar</button>
                                                    <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ComprasForm
