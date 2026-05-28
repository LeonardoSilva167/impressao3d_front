import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Label, Row, Table } from 'reactstrap'
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { Controller, useForm } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import {
    CorProjetoDefaultValues,
    CorProjetoFormModel,
    CorProjetoModel,
} from 'interfaces/ProjetosImpressao/CorProjetoInterface'
import { CoresService } from 'services/Cores/CoresService'
import { FilamentosService } from 'services/Filamentos/FilamentosService'
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import {
    calcularCustoFilamento,
    calcularCustoTotalFilamentos,
    calcularSomaPesoCores,
    formatarHexadecimalCss,
    formatarNumeroDecimal,
    obterValorNumerico,
    validarSomaCoresIgualPesoTotal,
} from '../hooks/useProjetosImpressao'
import 'Components/ComponentController/Selects/AsyncSelect/AsyncSelecStyle.css'

interface CorLookupOption extends SelectOptions {
    hexadecimal?: string | null
}

interface FilamentoLookupOption extends SelectOptions {
    id_cor?: string | number | null
    preco_medio_grama?: number | string | null
}

const renderAmostraCor = (hexadecimal: string | null | undefined, size = 24) => {
    const corCss = formatarHexadecimalCss(hexadecimal)
    if (!corCss) {
        return (
            <div
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: '50%',
                    background: '#f3f3f3',
                    border: '1px dashed #ccc',
                    flexShrink: 0,
                }}
                title="Cor sem hexadecimal cadastrado"
            />
        )
    }

    return (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: corCss,
                border: '1px solid #ccc',
                flexShrink: 0,
            }}
            title={hexadecimal || ''}
        />
    )
}

const mapCorToOption = (cor: { id?: string | number | null; descricao?: string | null; hexadecimal?: string | null }): CorLookupOption => ({
    value: cor.id,
    label: cor.descricao || '',
    hexadecimal: cor.hexadecimal,
})

const mapFilamentoToOption = (
    filamento: {
        id?: string | number | null
        codigo?: string | null
        resumo?: string | null
        id_cor?: string | number | null
        preco_medio_grama?: number | string | null
    },
    idCorFallback?: string | number | null
): FilamentoLookupOption => ({
    value: filamento.id,
    label: filamento.resumo || filamento.codigo || '',
    id_cor: filamento.id_cor != null ? filamento.id_cor : idCorFallback,
    preco_medio_grama: filamento.preco_medio_grama,
})

const filamentoPertenceCor = (
    filamento: { id_cor?: string | number | null },
    idCor: string | number | null | undefined
): boolean => {
    if (!idCor) return false
    if (filamento.id_cor == null) return true
    return String(filamento.id_cor) === String(idCor)
}

export interface FilamentosProjetoTableProps {
    filamentos: CorProjetoModel[]
    onChange: (filamentos: CorProjetoModel[]) => void
    pesoTotalProjeto: number | string | null | undefined
    readOnly?: boolean
}

const FilamentosProjetoTable = ({
    filamentos,
    onChange,
    pesoTotalProjeto,
    readOnly = false,
}: FilamentosProjetoTableProps) => {
    const { control, register, handleSubmit, reset, watch } = useForm<CorProjetoFormModel>({
        defaultValues: CorProjetoDefaultValues,
    })
    const coresService = new CoresService()
    const filamentosService = new FilamentosService()

    const [corLookupOptions, setCorLookupOptions] = useState<CorLookupOption[]>([])
    const [filamentoLookupOptions, setFilamentoLookupOptions] = useState<FilamentoLookupOption[]>([])
    const [corSelecionadaLookup, setCorSelecionadaLookup] = useState<CorLookupOption | undefined>()
    const [filamentoSelecionadoLookup, setFilamentoSelecionadoLookup] = useState<FilamentoLookupOption | undefined>()
    const [corSelectKey, setCorSelectKey] = useState(0)
    const [filamentoSelectKey, setFilamentoSelectKey] = useState(0)
    const [erroAdicao, setErroAdicao] = useState('')

    const idCorWatch = watch('id_cor')

    const somaPesos = calcularSomaPesoCores(filamentos)
    const pesoTotal = obterValorNumerico(pesoTotalProjeto)
    const pesosValidos = validarSomaCoresIgualPesoTotal(filamentos, pesoTotalProjeto)
    const custoTotal = calcularCustoTotalFilamentos(filamentos)

    const getListCores = async (inputValue: string): Promise<CorLookupOption[]> => {
        const params = inputValue ? { palavra_chave: inputValue } : {}
        const list = await coresService.AsyncListCores(params)
        if (!list || !list.length) return []

        const options = list.map(mapCorToOption)
        setCorLookupOptions((prev) => {
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

    const getListFilamentos = async (inputValue: string): Promise<FilamentoLookupOption[]> => {
        if (!idCorWatch) return []

        const params: Record<string, unknown> = { id_cor: idCorWatch }
        if (inputValue) params.palavra_chave = inputValue

        const list = await filamentosService.AsyncListFilamentos(params)
        if (!list || !list.length) return []

        const options = list
            .filter((filamento) => filamentoPertenceCor(filamento, idCorWatch))
            .map((filamento) => mapFilamentoToOption(filamento, idCorWatch))

        setFilamentoLookupOptions((prev) => {
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

    const resolverCorSelecionada = async (option: CorLookupOption | null) => {
        if (!option) {
            setCorSelecionadaLookup(undefined)
            return
        }

        if (option.hexadecimal) {
            setCorSelecionadaLookup(option)
            return
        }

        try {
            const view = await coresService.getViewCores({ id: option.value })
            if (view) {
                setCorSelecionadaLookup(mapCorToOption(view))
                return
            }
        } catch (error) {
            console.error('Erro ao carregar cor selecionada:', error)
        }

        setCorSelecionadaLookup(option)
    }

    const resolverFilamentoSelecionado = async (option: FilamentoLookupOption | null) => {
        if (!option) {
            setFilamentoSelecionadoLookup(undefined)
            return
        }

        if (option.preco_medio_grama != null) {
            setFilamentoSelecionadoLookup(option)
            return
        }

        try {
            const view = await filamentosService.getViewFilamentos({ id: option.value })
            if (view) {
                setFilamentoSelecionadoLookup(mapFilamentoToOption(view, idCorWatch))
                return
            }
        } catch (error) {
            console.error('Erro ao carregar filamento selecionado:', error)
        }

        setFilamentoSelecionadoLookup(mapFilamentoToOption(option, idCorWatch))
    }

    const handleSelecionarCor = (option: CorLookupOption | null, onChangeField: (value: CorLookupOption['value']) => void) => {
        onChangeField(option ? option.value : null)
        setFilamentoSelecionadoLookup(undefined)
        reset({ ...CorProjetoDefaultValues, id_cor: option ? option.value : null })
        setFilamentoSelectKey((prev) => prev + 1)

        if (option) {
            setCorLookupOptions((prev) => {
                if (prev.find((item) => String(item.value) === String(option.value))) return prev
                return [...prev, option]
            })
        }

        resolverCorSelecionada(option)
    }

    const handleSelecionarFilamento = (
        option: FilamentoLookupOption | null,
        onChangeField: (value: FilamentoLookupOption['value']) => void
    ) => {
        if (option && idCorWatch && !filamentoPertenceCor(option, idCorWatch)) {
            setErroAdicao('O filamento selecionado não pertence à cor escolhida.')
            onChangeField(null)
            setFilamentoSelecionadoLookup(undefined)
            return
        }

        setErroAdicao('')
        onChangeField(option ? option.value : null)

        if (option) {
            const enriched = mapFilamentoToOption(option, idCorWatch)
            setFilamentoLookupOptions((prev) => {
                if (prev.find((item) => String(item.value) === String(enriched.value))) return prev
                return [...prev, enriched]
            })
            resolverFilamentoSelecionado(enriched)
            return
        }

        resolverFilamentoSelecionado(null)
    }

    const limparFormulario = () => {
        reset(CorProjetoDefaultValues)
        setCorSelecionadaLookup(undefined)
        setFilamentoSelecionadoLookup(undefined)
        setCorSelectKey((prev) => prev + 1)
        setFilamentoSelectKey((prev) => prev + 1)
    }

    const adicionarFilamento = handleSubmit((data) => {
        setErroAdicao('')

        if (!corSelecionadaLookup) {
            setErroAdicao('Selecione uma cor.')
            return
        }

        const filamentoLookup = filamentoSelecionadoLookup
            || filamentoLookupOptions.find((item) => String(item.value) === String(data.id_filamento))

        if (!filamentoLookup) {
            setErroAdicao('Selecione um filamento da cor escolhida.')
            return
        }

        if (!filamentoPertenceCor(filamentoLookup, data.id_cor)) {
            setErroAdicao('O filamento selecionado não pertence à cor escolhida.')
            return
        }

        const filamentoDuplicado = filamentos.some(
            (item) => String(item.id_filamento) === String(data.id_filamento)
        )
        if (filamentoDuplicado) {
            setErroAdicao('Este filamento já foi adicionado ao projeto.')
            return
        }

        const peso = obterValorNumerico(data.peso_gramas)
        if (peso <= 0) {
            setErroAdicao('Informe um peso maior que zero.')
            return
        }

        const precoMedio = obterValorNumerico(filamentoLookup.preco_medio_grama)
        const custo = calcularCustoFilamento(peso, precoMedio)

        onChange([
            ...filamentos,
            {
                id: `temp-${Date.now()}`,
                id_cor: data.id_cor,
                id_filamento: data.id_filamento,
                peso_gramas: data.peso_gramas,
                descricao_cor: corSelecionadaLookup.label,
                hexadecimal_cor: corSelecionadaLookup.hexadecimal || null,
                descricao_filamento: filamentoLookup.label,
                preco_medio_grama: precoMedio,
                custo_estimado: custo,
            },
        ])
        limparFormulario()
    })

    const removerFilamento = (index: number) => {
        onChange(filamentos.filter((_, i) => i !== index))
    }

    useEffect(() => {
        const loadDefaultCores = async () => {
            const list = await coresService.AsyncListCores({})
            if (!list) return
            setCorLookupOptions(list.map(mapCorToOption))
        }
        loadDefaultCores()
    }, [])

    useEffect(() => {
        if (!idCorWatch) {
            setFilamentoLookupOptions([])
            return
        }

        const loadFilamentosPorCor = async () => {
            const list = await filamentosService.AsyncListFilamentos({ id_cor: idCorWatch })
            if (!list) {
                setFilamentoLookupOptions([])
                return
            }
            setFilamentoLookupOptions(
                list
                    .filter((filamento) => filamentoPertenceCor(filamento, idCorWatch))
                    .map((filamento) => mapFilamentoToOption(filamento, idCorWatch))
            )
        }
        loadFilamentosPorCor()
    }, [idCorWatch])

    return (
        <React.Fragment>
            <Row className="mt-4">
                <Col md={12}>
                    <h5 className="mb-3">Filamentos Utilizados</h5>
                </Col>
            </Row>

            {!readOnly && (
                <>
                    <Row className="align-items-end">
                        <Col md={4}>
                            <div className="mb-3">
                                <Label htmlFor="id_cor" className="form-label">Cor</Label>
                                <Controller
                                    name="id_cor"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange: onChangeField, value }, fieldState: { error } }) => {
                                        const selectedOption = (() => {
                                            if (!value) return null
                                            const fromLookup = corLookupOptions.find((item) => String(item.value) === String(value))
                                            if (fromLookup) return fromLookup
                                            if (corSelecionadaLookup && String(corSelecionadaLookup.value) === String(value)) {
                                                return corSelecionadaLookup
                                            }
                                            return null
                                        })()

                                        return (
                                            <>
                                                <AsyncSelect<CorLookupOption>
                                                    key={`cor-select-${corSelectKey}`}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    isClearable
                                                    cacheOptions
                                                    defaultOptions={corLookupOptions}
                                                    placeholder="Digite para buscar..."
                                                    loadOptions={(inputValue) => {
                                                        if (inputValue.length > 2) {
                                                            return getListCores(inputValue)
                                                        }
                                                        return Promise.resolve(corLookupOptions)
                                                    }}
                                                    getOptionLabel={(option: CorLookupOption): string => option.label || ''}
                                                    getOptionValue={(option) => String(option.value)}
                                                    value={selectedOption}
                                                    onChange={(option) => handleSelecionarCor(option, onChangeField)}
                                                    formatOptionLabel={(option) => (
                                                        <div className="d-flex align-items-center gap-2">
                                                            {renderAmostraCor(option.hexadecimal, 18)}
                                                            <span>{option.label}</span>
                                                        </div>
                                                    )}
                                                />
                                                {error && <div className="text-danger">{error.message}</div>}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <Label htmlFor="id_filamento" className="form-label">Filamento</Label>
                                <Controller
                                    name="id_filamento"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange: onChangeField, value }, fieldState: { error } }) => {
                                        const selectedOption = (() => {
                                            if (!value) return null
                                            const fromLookup = filamentoLookupOptions.find(
                                                (item) => String(item.value) === String(value)
                                            )
                                            if (fromLookup) return fromLookup
                                            if (
                                                filamentoSelecionadoLookup
                                                && String(filamentoSelecionadoLookup.value) === String(value)
                                            ) {
                                                return filamentoSelecionadoLookup
                                            }
                                            return null
                                        })()

                                        return (
                                            <>
                                                <AsyncSelect<FilamentoLookupOption>
                                                    key={`filamento-select-${filamentoSelectKey}`}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    isClearable
                                                    isDisabled={!idCorWatch}
                                                    cacheOptions
                                                    defaultOptions={filamentoLookupOptions}
                                                    placeholder={idCorWatch ? 'Selecione o filamento...' : 'Selecione uma cor primeiro'}
                                                    loadOptions={(inputValue) => {
                                                        if (!idCorWatch) return Promise.resolve([])
                                                        return getListFilamentos(inputValue)
                                                    }}
                                                    getOptionLabel={(option: FilamentoLookupOption): string => option.label || ''}
                                                    getOptionValue={(option) => String(option.value)}
                                                    value={selectedOption}
                                                    onChange={(option) => handleSelecionarFilamento(option, onChangeField)}
                                                />
                                                {error && <div className="text-danger">{error.message}</div>}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="mb-3">
                                <Label htmlFor="peso_gramas" className="form-label">Peso (g)</Label>
                                <InputNumber<CorProjetoFormModel>
                                    field={'peso_gramas'}
                                    register={register}
                                    required={required}
                                />
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="mb-3">
                                <Button color="primary" type="button" onClick={adicionarFilamento}>
                                    <i className="ri-add-line me-1"></i> Adicionar
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {erroAdicao && (
                        <Alert color="danger" className="py-2">{erroAdicao}</Alert>
                    )}
                </>
            )}

            {pesoTotal > 0 && !readOnly && (
                <Alert color={pesosValidos ? 'success' : 'warning'} className="py-2">
                    Soma dos filamentos: <strong>{formatarNumeroDecimal(somaPesos)}g</strong>
                    {' · '}
                    Peso total do projeto: <strong>{formatarNumeroDecimal(pesoTotal)}g</strong>
                    {!pesosValidos && filamentos.length > 0 && (
                        <span className="d-block mt-1">
                            O somatório dos filamentos deve ser igual ao peso total do projeto.
                        </span>
                    )}
                </Alert>
            )}

            {filamentos.length === 0 ? (
                <p className="text-muted">Nenhum filamento cadastrado.</p>
            ) : (
                <div className="table-responsive">
                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>Amostra</th>
                                <th>Cor</th>
                                <th>Filamento</th>
                                <th>Peso</th>
                                <th className="text-end">Custo Estimado</th>
                                {!readOnly && <th style={{ width: '100px' }}>Ação</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filamentos.map((filamento, index) => (
                                <tr key={filamento.id != null ? filamento.id : index}>
                                    <td className="text-center">
                                        {renderAmostraCor(filamento.hexadecimal_cor, 28)}
                                    </td>
                                    <td>{filamento.descricao_cor || '—'}</td>
                                    <td>{filamento.descricao_filamento || '—'}</td>
                                    <td>{formatarNumeroDecimal(obterValorNumerico(filamento.peso_gramas))}g</td>
                                    <td className="text-end">
                                        R$ {formatarParaMoedaSemSimbolo(filamento.custo_estimado)}
                                    </td>
                                    {!readOnly && (
                                        <td>
                                            <Button
                                                color="soft-danger"
                                                size="sm"
                                                type="button"
                                                onClick={() => removerFilamento(index)}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        {filamentos.length > 0 && (
                            <tfoot className="table-light">
                                <tr>
                                    <td colSpan={readOnly ? 4 : 4} className="text-end fw-semibold">
                                        Custo Total do Projeto:
                                    </td>
                                    <td className="text-end fw-semibold">
                                        R$ {formatarParaMoedaSemSimbolo(custoTotal)}
                                    </td>
                                    {!readOnly && <td />}
                                </tr>
                            </tfoot>
                        )}
                    </Table>
                </div>
            )}
        </React.Fragment>
    )
}

export default FilamentosProjetoTable
