import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import AsyncSelect from 'react-select/async'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ComposicaoVariacaoItemModel } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { FilamentosView } from 'interfaces/Filamentos/FilamentosInterface'
import { FilamentosService } from 'services/Filamentos/FilamentosService'
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { formatarNumeroDecimal } from 'pages/Pages/ProjetosImpressao/hooks/useProjetosImpressao'
import 'Components/ComponentController/Selects/AsyncSelect/AsyncSelecStyle.css'

interface FilamentoLookupOption extends SelectOptions {
    preco_medio_grama?: number | string | null
    cor_filamento?: string | null
}

const mapFilamentoListaToOption = (filamento: {
    id?: string | number | null
    codigo?: string | null
    resumo?: string | null
}): FilamentoLookupOption => ({
    value: filamento.id,
    label: filamento.resumo || filamento.codigo || '',
})

const mapFilamentoDetalheToOption = (
    detalhe: FilamentosView,
    fallback?: FilamentoLookupOption
): FilamentoLookupOption => ({
    value: detalhe.id != null ? detalhe.id : (fallback ? fallback.value : undefined),
    label: detalhe.resumo || (fallback ? fallback.label : '') || '',
    preco_medio_grama: detalhe.preco_medio_por_grama != null
        ? detalhe.preco_medio_por_grama
        : (detalhe.preco_medio_grama != null
            ? detalhe.preco_medio_grama
            : (fallback ? fallback.preco_medio_grama : undefined)),
    cor_filamento: (detalhe.cor && detalhe.cor.descricao) || (fallback ? fallback.cor_filamento : undefined),
})

export interface ComposicaoVariacoesItemTableProps {
    variacoes: ComposicaoVariacaoItemModel[]
    onFilamentoChange: (chave: string, filamento: FilamentoLookupOption | null) => void
    readOnly?: boolean
}

const ComposicaoVariacoesItemTable = ({
    variacoes,
    onFilamentoChange,
    readOnly = false,
}: ComposicaoVariacoesItemTableProps) => {
    const filamentosService = new FilamentosService()
    const [filamentoLookupOptions, setFilamentoLookupOptions] = useState<FilamentoLookupOption[]>([])
    const [filamentoDetalhes, setFilamentoDetalhes] = useState<Record<string, FilamentoLookupOption>>({})

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

    const resolverFilamentoDetalhe = async (option: FilamentoLookupOption) => {
        if (option.value == null) return option

        const cacheKey = String(option.value)
        if (filamentoDetalhes[cacheKey]) return filamentoDetalhes[cacheKey]

        try {
            const detalhe = await filamentosService.getViewFilamentos({ id: option.value })
            if (detalhe) {
                const mapped = mapFilamentoDetalheToOption(detalhe, option)
                setFilamentoDetalhes((prev) => ({ ...prev, [cacheKey]: mapped }))
                return mapped
            }
        } catch (error) {
            console.error('Erro ao carregar filamento:', error)
        }

        return option
    }

    const handleSelecionarFilamento = async (
        chave: string,
        option: FilamentoLookupOption | null
    ) => {
        if (!option) {
            onFilamentoChange(chave, null)
            return
        }

        setFilamentoLookupOptions((prev) => {
            if (prev.find((item) => String(item.value) === String(option.value))) return prev
            return [...prev, option]
        })

        const detalhe = await resolverFilamentoDetalhe(option)
        onFilamentoChange(chave, detalhe)
    }

    const obterOptionFilamento = (linha: ComposicaoVariacaoItemModel): FilamentoLookupOption | null => {
        if (!linha.id_filamento) return null

        const cacheKey = String(linha.id_filamento)
        if (filamentoDetalhes[cacheKey]) return filamentoDetalhes[cacheKey]

        const fromLookup = filamentoLookupOptions.find(
            (opt) => String(opt.value) === String(linha.id_filamento)
        )
        if (fromLookup) return fromLookup

        if (linha.descricao_filamento) {
            return {
                value: linha.id_filamento,
                label: linha.descricao_filamento,
                preco_medio_grama: linha.preco_medio_grama,
                cor_filamento: linha.cor_filamento,
            }
        }

        return null
    }

    useEffect(() => {
        const loadDefaultFilamentos = async () => {
            const list = await filamentosService.AsyncListFilamentos({})
            if (!list) return
            setFilamentoLookupOptions(list.map((filamento) => mapFilamentoListaToOption(filamento)))
        }
        loadDefaultFilamentos()
    }, [])

    if (variacoes.length === 0) {
        return <p className="text-muted mb-0">Gere as variações para configurar filamentos.</p>
    }

    return (
        <div className="table-responsive">
            <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Parte</th>
                        <th>Item</th>
                        <th>Cor</th>
                        <th>Descrição</th>
                        <th style={{ minWidth: '220px' }}>Filamento</th>
                        <th>Cor Filamento</th>
                        <th className="text-end">Preço Médio</th>
                        <th className="text-end">Peso</th>
                        <th className="text-end">Custo</th>
                    </tr>
                </thead>
                <tbody>
                    {variacoes.map((linha) => (
                        <tr key={linha.chave || `${linha.id_projeto_impressao_parte_item}-${linha.id_cor}`}>
                            <td>{linha.nome_parte || '—'}</td>
                            <td>{linha.nome_item || '—'}</td>
                            <td>{linha.cor_descricao || '—'}</td>
                            <td>{linha.descricao || '—'}</td>
                            <td>
                                {readOnly ? (
                                    linha.descricao_filamento || '—'
                                ) : (
                                    <AsyncSelect<FilamentoLookupOption>
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                        cacheOptions
                                        defaultOptions={filamentoLookupOptions}
                                        placeholder="Buscar resumo, código ou cor..."
                                        loadOptions={(inputValue) => {
                                            if (inputValue.length > 2) {
                                                return getListFilamentos(inputValue)
                                            }
                                            return Promise.resolve(filamentoLookupOptions)
                                        }}
                                        getOptionLabel={(option) => option.label || ''}
                                        getOptionValue={(option) => String(option.value)}
                                        value={obterOptionFilamento(linha)}
                                        onChange={(option) => handleSelecionarFilamento(
                                            linha.chave || '',
                                            option
                                        )}
                                    />
                                )}
                            </td>
                            <td>{linha.cor_filamento || '—'}</td>
                            <td className="text-end">
                                {linha.preco_medio_grama != null
                                    ? `R$ ${formatarParaMoedaSemSimbolo(linha.preco_medio_grama)}`
                                    : '—'}
                            </td>
                            <td className="text-end">
                                {formatarNumeroDecimal(Number(linha.peso) || 0)}g
                            </td>
                            <td className="text-end">
                                R$ {formatarParaMoedaSemSimbolo(linha.custo || 0)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default ComposicaoVariacoesItemTable
