import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { Button, Card, CardBody, Col, Label, Row, Table } from 'reactstrap'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { LookupsProdutos, ProdutoVariacaoResumo } from 'interfaces/Produtos/ProdutosInterface'
import { ProdutoVariacaoSyncModel } from 'interfaces/Produtos/ProdutoVariacaoInterface'
import { ProdutoVariacoesService } from 'services/ProdutoVariacoes/ProdutoVariacoesService'
import {
    extrairIdsMultiSelect,
    mapLookupToOptions,
    montarPreviewVariacoes,
} from '../hooks/useProdutos'
import VariacaoProdutoStatusBadge from '../VariacaoProdutoStatusBadge/VariacaoProdutoStatusBadge'

const multiSelectStyles = {
    multiValue: (styles: Record<string, unknown>) => ({
        ...styles,
        backgroundColor: '#3762ea',
    }),
    multiValueLabel: (styles: Record<string, unknown>) => ({
        ...styles,
        backgroundColor: '#405189',
        color: 'white',
    }),
    multiValueRemove: (styles: Record<string, unknown>) => ({
        ...styles,
        color: 'white',
        backgroundColor: '#405189',
        ':hover': {
            backgroundColor: '#405189',
            color: 'white',
        },
    }),
}

export interface VariacoesProdutoGeradorProps {
    produtoId: number
    skuBase: string
    variacoes: ProdutoVariacaoResumo[]
    lookups?: LookupsProdutos
    onReload: () => void
    readOnly?: boolean
}

const VariacoesProdutoGerador = ({
    produtoId,
    skuBase,
    variacoes,
    lookups,
    onReload,
    readOnly = false,
}: VariacoesProdutoGeradorProps) => {
    const variacoesService = new ProdutoVariacoesService()

    const coresOptions = useMemo(
        () => mapLookupToOptions(lookups && lookups.cores),
        [lookups]
    )

    const [coresPrimarias, setCoresPrimarias] = useState<SelectOptions[]>([])
    const [coresSecundarias, setCoresSecundarias] = useState<SelectOptions[]>([])
    const [coresTerciarias, setCoresTerciarias] = useState<SelectOptions[]>([])
    const [previewCombinacoes, setPreviewCombinacoes] = useState<ReturnType<typeof montarPreviewVariacoes>>([])
    const [exibirPreview, setExibirPreview] = useState(false)
    const [salvando, setSalvando] = useState(false)

    const gerarCombinacoes = () => {
        const idsPrimarias = extrairIdsMultiSelect(coresPrimarias)
        if (idsPrimarias.length === 0) {
            toast.error('Selecione ao menos uma cor primária.')
            return
        }

        const preview = montarPreviewVariacoes(
            skuBase,
            idsPrimarias,
            extrairIdsMultiSelect(coresSecundarias),
            extrairIdsMultiSelect(coresTerciarias),
            variacoes,
            lookups
        )

        setPreviewCombinacoes(preview)
        setExibirPreview(true)
    }

    const salvarVariacoes = async () => {
        const idsPrimarias = extrairIdsMultiSelect(coresPrimarias)
        if (idsPrimarias.length === 0) {
            toast.error('Selecione ao menos uma cor primária.')
            return
        }

        const payload: ProdutoVariacaoSyncModel = {
            id_produto_base: produtoId,
            cores_primarias: idsPrimarias,
            cores_secundarias: extrairIdsMultiSelect(coresSecundarias),
            cores_terciarias: extrairIdsMultiSelect(coresTerciarias),
        }

        setSalvando(true)
        try {
            const result = await variacoesService.syncVariacoes(payload)
            const criadas = result && result.criadas != null ? result.criadas : 0
            const reativadas = result && result.reativadas != null ? result.reativadas : 0
            const inativadas = result && result.inativadas != null ? result.inativadas : 0

            toast.success(
                `Variações salvas: ${criadas} criada(s), ${reativadas} reativada(s), ${inativadas} inativada(s).`
            )
            setExibirPreview(false)
            setPreviewCombinacoes([])
            onReload()
        } catch (error: unknown) {
            console.error('Erro ao salvar variações:', error)
            const msg = (error && typeof error === 'object' && 'message' in error)
                ? String((error as { message: string }).message)
                : 'Erro ao salvar variações.'
            toast.error(msg)
        } finally {
            setSalvando(false)
        }
    }

    if (readOnly) return null

    return (
        <Card className="mb-4">
            <CardBody>
                <h5 className="mb-3">Gerar Variações por Cores</h5>
                <Row>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label">Cor Primária</Label>
                            <Select
                                isMulti
                                placeholder="Selecione..."
                                options={coresOptions}
                                value={coresPrimarias}
                                onChange={(selected) => setCoresPrimarias(selected ? (selected as SelectOptions[]) : [])}
                                styles={multiSelectStyles}
                                closeMenuOnSelect={false}
                                isClearable
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label">Cor Secundária</Label>
                            <Select
                                isMulti
                                placeholder="Selecione..."
                                options={coresOptions}
                                value={coresSecundarias}
                                onChange={(selected) => setCoresSecundarias(selected ? (selected as SelectOptions[]) : [])}
                                styles={multiSelectStyles}
                                closeMenuOnSelect={false}
                                isClearable
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label">Cor Terciária</Label>
                            <Select
                                isMulti
                                placeholder="Selecione..."
                                options={coresOptions}
                                value={coresTerciarias}
                                onChange={(selected) => setCoresTerciarias(selected ? (selected as SelectOptions[]) : [])}
                                styles={multiSelectStyles}
                                closeMenuOnSelect={false}
                                isClearable
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="d-flex gap-2 justify-content-end">
                        <Button color="info" type="button" onClick={gerarCombinacoes}>
                            <i className="ri-stack-line me-1"></i> Gerar Combinações
                        </Button>
                        {exibirPreview && (
                            <Button
                                color="primary"
                                type="button"
                                onClick={salvarVariacoes}
                                disabled={salvando}
                            >
                                {salvando ? 'Salvando...' : 'Salvar Variações'}
                            </Button>
                        )}
                    </Col>
                </Row>

                {exibirPreview && (
                    <div className="mt-4">
                        <h6 className="mb-3">Pré-visualização das Combinações</h6>
                        {previewCombinacoes.length === 0 ? (
                            <div className="text-muted text-center py-3">
                                Nenhuma combinação gerada.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-start">Cor Primária</th>
                                            <th scope="col" className="text-start">Cor Secundária</th>
                                            <th scope="col" className="text-start">Cor Terciária</th>
                                            <th scope="col" className="text-start">SKU Gerado</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewCombinacoes.map((item, index) => (
                                            <tr key={`${item.sku}-${index}`}>
                                                <td className="text-start">{item.cor_primaria_descricao}</td>
                                                <td className="text-start">{item.cor_secundaria_descricao || '—'}</td>
                                                <td className="text-start">{item.cor_terciaria_descricao || '—'}</td>
                                                <td className="text-start">{item.sku || '—'}</td>
                                                <td>
                                                    <VariacaoProdutoStatusBadge status={item.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}
            </CardBody>
        </Card>
    )
}

export default VariacoesProdutoGerador
