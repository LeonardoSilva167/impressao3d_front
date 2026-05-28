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
import {
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

export interface CoresProjetoTableProps {
    cores: CorProjetoModel[]
    onChange: (cores: CorProjetoModel[]) => void
    pesoTotalProjeto: number | string | null | undefined
}

const CoresProjetoTable = ({ cores, onChange, pesoTotalProjeto }: CoresProjetoTableProps) => {
    const { control, register, handleSubmit, reset } = useForm<CorProjetoFormModel>({
        defaultValues: CorProjetoDefaultValues,
    })
    const coresService = new CoresService()

    const [corLookupOptions, setCorLookupOptions] = useState<CorLookupOption[]>([])
    const [corSelecionadaLookup, setCorSelecionadaLookup] = useState<CorLookupOption | undefined>()
    const [corSelectKey, setCorSelectKey] = useState(0)
    const [erroAdicao, setErroAdicao] = useState('')

    const somaCores = calcularSomaPesoCores(cores)
    const pesoTotal = obterValorNumerico(pesoTotalProjeto)
    const coresValidas = validarSomaCoresIgualPesoTotal(cores, pesoTotalProjeto)

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

    const handleSelecionarCor = (option: CorLookupOption | null, onChange: (value: CorLookupOption['value']) => void) => {
        onChange(option ? option.value : null)

        if (option) {
            setCorLookupOptions((prev) => {
                if (prev.find((item) => String(item.value) === String(option.value))) return prev
                return [...prev, option]
            })
        }

        resolverCorSelecionada(option)
    }

    const limparFormularioCor = () => {
        reset(CorProjetoDefaultValues)
        setCorSelecionadaLookup(undefined)
        setCorSelectKey((prev) => prev + 1)
    }

    const adicionarCor = handleSubmit((data) => {
        setErroAdicao('')

        if (!corSelecionadaLookup) {
            setErroAdicao('Selecione uma cor.')
            return
        }

        const corDuplicada = cores.some((cor) => String(cor.id_cor) === String(data.id_cor))
        if (corDuplicada) {
            setErroAdicao('Esta cor já foi adicionada ao projeto.')
            return
        }

        const peso = obterValorNumerico(data.peso_gramas)
        if (peso <= 0) {
            setErroAdicao('Informe um peso maior que zero.')
            return
        }

        onChange([
            ...cores,
            {
                id: `temp-${Date.now()}`,
                id_cor: data.id_cor,
                peso_gramas: data.peso_gramas,
                descricao_cor: corSelecionadaLookup.label,
                hexadecimal_cor: corSelecionadaLookup.hexadecimal || null,
            },
        ])
        limparFormularioCor()
    })

    const removerCor = (index: number) => {
        onChange(cores.filter((_, i) => i !== index))
    }

    useEffect(() => {
        const loadDefaultCores = async () => {
            const service = new CoresService()
            const list = await service.AsyncListCores({})
            if (!list) return
            const options = list.map(mapCorToOption)
            setCorLookupOptions(options)
        }
        loadDefaultCores()
    }, [])

    useEffect(() => {
        if (!corLookupOptions.length || !cores.length) return

        const enriched = cores.map((cor) => {
            if (cor.hexadecimal_cor || !cor.id_cor) return cor
            const found = corLookupOptions.find((item) => String(item.value) === String(cor.id_cor))
            if (!found) return cor
            return {
                ...cor,
                descricao_cor: cor.descricao_cor || found.label,
                hexadecimal_cor: found.hexadecimal || null,
            }
        })

        const changed = enriched.some((cor, index) => (
            cor.hexadecimal_cor !== cores[index].hexadecimal_cor
            || cor.descricao_cor !== cores[index].descricao_cor
        ))

        if (changed) onChange(enriched)
    }, [corLookupOptions, cores, onChange])

    return (
        <React.Fragment>
            <Row className="mt-4">
                <Col md={12}>
                    <h5 className="mb-3">Cores Utilizadas</h5>
                </Col>
            </Row>

            <Row className="align-items-end">
                <Col md={5}>
                    <div className="mb-3">
                        <Label htmlFor="id_cor" className="form-label">Cor</Label>
                        <Controller
                            name="id_cor"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => {
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
                                            onChange={(option) => handleSelecionarCor(option, onChange)}
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
                        {corSelecionadaLookup && (
                            <div className="d-flex align-items-center gap-2 mt-2 p-2 bg-light rounded">
                                {renderAmostraCor(corSelecionadaLookup.hexadecimal, 32)}
                                <span className="fw-medium">{corSelecionadaLookup.label}</span>
                            </div>
                        )}
                    </div>
                </Col>
                <Col md={4}>
                    <div className="mb-3">
                        <Label htmlFor="peso_gramas" className="form-label">Peso (g)</Label>
                        <InputNumber<CorProjetoFormModel>
                            field={'peso_gramas'}
                            register={register}
                            required={required}
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="mb-3">
                        <Button color="primary" type="button" onClick={adicionarCor}>
                            <i className="ri-add-line me-1"></i> Adicionar Cor
                        </Button>
                    </div>
                </Col>
            </Row>

            {erroAdicao && (
                <Alert color="danger" className="py-2">{erroAdicao}</Alert>
            )}

            {pesoTotal > 0 && (
                <Alert color={coresValidas ? 'success' : 'warning'} className="py-2">
                    Soma das cores: <strong>{formatarNumeroDecimal(somaCores)}g</strong>
                    {' · '}
                    Peso total do projeto: <strong>{formatarNumeroDecimal(pesoTotal)}g</strong>
                    {!coresValidas && cores.length > 0 && (
                        <span className="d-block mt-1">O somatório das cores deve ser igual ao peso total do projeto.</span>
                    )}
                </Alert>
            )}

            {cores.length === 0 ? (
                <p className="text-muted">Nenhuma cor cadastrada.</p>
            ) : (
                <div className="table-responsive">
                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>Amostra</th>
                                <th>Cor</th>
                                <th>Peso</th>
                                <th style={{ width: '100px' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cores.map((cor, index) => (
                                <tr key={cor.id != null ? cor.id : index}>
                                    <td className="text-center">
                                        {renderAmostraCor(cor.hexadecimal_cor, 28)}
                                    </td>
                                    <td>{cor.descricao_cor || '—'}</td>
                                    <td>{formatarNumeroDecimal(obterValorNumerico(cor.peso_gramas))}g</td>
                                    <td>
                                        <Button
                                            color="soft-danger"
                                            size="sm"
                                            type="button"
                                            onClick={() => removerCor(index)}
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </React.Fragment>
    )
}

export default CoresProjetoTable
