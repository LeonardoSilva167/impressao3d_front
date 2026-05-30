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
import { FilamentosView } from 'interfaces/Filamentos/FilamentosInterface'
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

interface FilamentoLookupOption extends SelectOptions {
    id_cor?: string | number | null
    preco_medio_grama?: number | string | null
    descricao_cor?: string | null
    hexadecimal_cor?: string | null
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

const mapFilamentoListaToOption = (
    filamento: {
        id?: string | number | null
        codigo?: string | null
        resumo?: string | null
    }
): FilamentoLookupOption => ({
    value: filamento.id,
    label: filamento.resumo || filamento.codigo || '',
})

const mapFilamentoDetalheToOption = (
    detalhe: FilamentosView,
    fallback?: FilamentoLookupOption
): FilamentoLookupOption => {
    const cor = detalhe.cor

    return {
        value: detalhe.id != null ? detalhe.id : (fallback ? fallback.value : undefined),
        label: detalhe.resumo || (fallback ? fallback.label : '') || '',
        id_cor: cor && cor.id != null ? cor.id : (fallback ? fallback.id_cor : undefined),
        preco_medio_grama: detalhe.preco_medio_por_grama != null
            ? detalhe.preco_medio_por_grama
            : (detalhe.preco_medio_grama != null
                ? detalhe.preco_medio_grama
                : (fallback ? fallback.preco_medio_grama : undefined)),
        descricao_cor: (cor && cor.descricao) || (fallback ? fallback.descricao_cor : undefined),
        hexadecimal_cor: (cor && cor.hexadecimal) || (fallback ? fallback.hexadecimal_cor : undefined),
    }
}

const isFilamentoIdValido = (id: string | number | null | undefined): boolean =>
    id != null && String(id).trim() !== '' && String(id) !== 'undefined'

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
    const { control, register, handleSubmit, reset } = useForm<CorProjetoFormModel>({
        defaultValues: CorProjetoDefaultValues,
    })
    const filamentosService = new FilamentosService()

    const [filamentoLookupOptions, setFilamentoLookupOptions] = useState<FilamentoLookupOption[]>([])
    const [filamentoSelecionadoLookup, setFilamentoSelecionadoLookup] = useState<FilamentoLookupOption | undefined>()
    const [filamentoSelectKey, setFilamentoSelectKey] = useState(0)
    const [erroAdicao, setErroAdicao] = useState('')

    const somaPesos = calcularSomaPesoCores(filamentos)
    const pesoTotal = obterValorNumerico(pesoTotalProjeto)
    const pesosValidos = validarSomaCoresIgualPesoTotal(filamentos, pesoTotalProjeto)
    const custoTotal = calcularCustoTotalFilamentos(filamentos)

    const getListFilamentos = async (inputValue: string): Promise<FilamentoLookupOption[]> => {
        const params: Record<string, unknown> = {}
        if (inputValue) params.palavra_chave = inputValue

        const list = await filamentosService.AsyncListFilamentos(params)
        if (!list || !list.length) return []

        const options = list.map((filamento) => mapFilamentoListaToOption(filamento))

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

    const resolverFilamentoSelecionado = async (option: FilamentoLookupOption | null) => {
        if (!option) {
            setFilamentoSelecionadoLookup(undefined)
            return
        }

        if (!isFilamentoIdValido(option.value)) {
            setFilamentoSelecionadoLookup(option)
            return
        }

        try {
            const detalhe = await filamentosService.getViewFilamentos({ id: option.value })
            if (detalhe) {
                setFilamentoSelecionadoLookup(mapFilamentoDetalheToOption(detalhe, option))
                return
            }
        } catch (error) {
            console.error('Erro ao carregar filamento selecionado:', error)
        }

        setFilamentoSelecionadoLookup(option)
    }

    const handleSelecionarFilamento = (
        option: FilamentoLookupOption | null,
        onChangeField: (value: FilamentoLookupOption['value']) => void
    ) => {
        setErroAdicao('')
        onChangeField(option ? option.value : null)

        if (option) {
            setFilamentoLookupOptions((prev) => {
                if (prev.find((item) => String(item.value) === String(option.value))) return prev
                return [...prev, option]
            })
            resolverFilamentoSelecionado(option)
            return
        }

        resolverFilamentoSelecionado(null)
    }

    const limparFormulario = () => {
        reset(CorProjetoDefaultValues)
        setFilamentoSelecionadoLookup(undefined)
        setFilamentoSelectKey((prev) => prev + 1)
    }

    const adicionarFilamento = handleSubmit((data) => {
        setErroAdicao('')

        const filamentoLookup = filamentoSelecionadoLookup
            || filamentoLookupOptions.find((item) => String(item.value) === String(data.id_filamento))

        if (!filamentoLookup) {
            setErroAdicao('Selecione um filamento.')
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
                id_cor: filamentoLookup.id_cor,
                id_filamento: data.id_filamento,
                peso_gramas: data.peso_gramas,
                descricao_cor: filamentoLookup.descricao_cor || '',
                hexadecimal_cor: filamentoLookup.hexadecimal_cor || null,
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
        const loadDefaultFilamentos = async () => {
            const list = await filamentosService.AsyncListFilamentos({})
            if (!list) return
            setFilamentoLookupOptions(list.map((filamento) => mapFilamentoListaToOption(filamento)))
        }
        loadDefaultFilamentos()
    }, [])

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
                        <Col md={5}>
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
                                                    cacheOptions
                                                    defaultOptions={filamentoLookupOptions}
                                                    placeholder="Digite para buscar..."
                                                    loadOptions={(inputValue) => {
                                                        if (inputValue.length > 2) {
                                                            return getListFilamentos(inputValue)
                                                        }
                                                        return Promise.resolve(filamentoLookupOptions)
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

                    {filamentoSelecionadoLookup && (
                        <Row className="mb-3">
                            <Col md={12}>
                                <div className="d-flex flex-wrap align-items-center gap-4 p-3 bg-light rounded">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-muted">Cor:</span>
                                        {renderAmostraCor(filamentoSelecionadoLookup.hexadecimal_cor, 22)}
                                        <strong>{filamentoSelecionadoLookup.descricao_cor || '—'}</strong>
                                    </div>
                                    {filamentoSelecionadoLookup.hexadecimal_cor && (
                                        <div>
                                            <span className="text-muted me-2">Hex:</span>
                                            <code>{formatarHexadecimalCss(filamentoSelecionadoLookup.hexadecimal_cor)}</code>
                                        </div>
                                    )}
                                    {filamentoSelecionadoLookup.preco_medio_grama != null && (
                                        <div>
                                            <span className="text-muted me-2">Preço médio:</span>
                                            <strong>
                                                R$ {formatarParaMoedaSemSimbolo(filamentoSelecionadoLookup.preco_medio_grama)}/g
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}

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
                                <th>Filamento</th>
                                <th>Cor</th>
                                <th>Peso</th>
                                <th className="text-end">Preço Médio Grama</th>
                                <th className="text-end">Custo Estimado</th>
                                {!readOnly && <th style={{ width: '100px' }}>Ação</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filamentos.map((filamento, index) => (
                                <tr key={filamento.id != null ? filamento.id : index}>
                                    <td>{filamento.descricao_filamento || '—'}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            {renderAmostraCor(filamento.hexadecimal_cor, 20)}
                                            <span>{filamento.descricao_cor || '—'}</span>
                                        </div>
                                    </td>
                                    <td>{formatarNumeroDecimal(obterValorNumerico(filamento.peso_gramas))}g</td>
                                    <td className="text-end">
                                        R$ {formatarParaMoedaSemSimbolo(filamento.preco_medio_grama)}/g
                                    </td>
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
                                    <td colSpan={2} className="text-end fw-semibold">
                                        Peso Total:
                                    </td>
                                    <td className="fw-semibold">
                                        {formatarNumeroDecimal(somaPesos)}g
                                    </td>
                                    <td className="text-end fw-semibold">
                                        Custo Estimado:
                                    </td>
                                    <td className="text-end fw-semibold">
                                        R$ {formatarParaMoedaSemSimbolo(custoTotal)}
                                    </td>
                                    {!readOnly && <td />}
                                </tr>
                            </tfoot>
                        )}
                    </Table>
                    <p className="text-muted small mt-2 mb-0">
                        Esse valor é apenas uma estimativa rápida. Não representa o custo final do produto.
                    </p>
                </div>
            )}
        </React.Fragment>
    )
}

export default FilamentosProjetoTable
