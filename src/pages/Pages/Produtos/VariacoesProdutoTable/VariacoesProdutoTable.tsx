import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, ButtonGroup, Card, CardBody, Col, Label, Row, Table } from 'reactstrap'
import CustomModal from 'Components/ComponentController/Modal/CustomModal'
import { LookupsProdutos, ProdutoVariacaoResumo } from 'interfaces/Produtos/ProdutosInterface'
import { ProdutoVariacoesService } from 'services/ProdutoVariacoes/ProdutoVariacoesService'
import { FiltroStatusVariacao, filtrarVariacoesPorStatus } from '../hooks/useProdutos'
import VariacoesProdutoGerador from '../VariacoesProdutoGerador/VariacoesProdutoGerador'
import VariacaoProdutoStatusBadge from '../VariacaoProdutoStatusBadge/VariacaoProdutoStatusBadge'

export interface VariacoesProdutoTableProps {
    produtoId: number
    skuBase: string
    variacoes: ProdutoVariacaoResumo[]
    lookups?: LookupsProdutos
    onReload: () => void
    readOnly?: boolean
}

const VariacoesProdutoTable = ({
    produtoId,
    skuBase,
    variacoes,
    lookups,
    onReload,
    readOnly = false,
}: VariacoesProdutoTableProps) => {
    const variacoesService = new ProdutoVariacoesService()

    const [filtroStatus, setFiltroStatus] = useState<FiltroStatusVariacao>('ATIVAS')
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [excluindo, setExcluindo] = useState(false)

    const variacoesFiltradas = useMemo(
        () => filtrarVariacoesPorStatus(variacoes, filtroStatus),
        [variacoes, filtroStatus]
    )

    const confirmarExclusao = (id: number) => {
        setDeleteId(id)
        setDeleteModalOpen(true)
    }

    const executarExclusao = async () => {
        if (!deleteId) return
        setExcluindo(true)
        try {
            await variacoesService.deleteVariacao(deleteId)
            toast.success('Variação excluída com sucesso.')
            onReload()
        } catch (error) {
            console.error('Erro ao excluir variação:', error)
            toast.error('Erro ao excluir variação.')
        } finally {
            setExcluindo(false)
            setDeleteModalOpen(false)
            setDeleteId(null)
        }
    }

    return (
        <React.Fragment>
            <VariacoesProdutoGerador
                produtoId={produtoId}
                skuBase={skuBase}
                variacoes={variacoes}
                lookups={lookups}
                onReload={onReload}
                readOnly={readOnly}
            />

            <Card>
                <CardBody>
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <h5 className="mb-0">Variações do Produto</h5>
                        <div className="d-flex align-items-center gap-2">
                            <Label className="form-label mb-0 me-1">Filtro:</Label>
                            <ButtonGroup size="sm">
                                <Button
                                    color={filtroStatus === 'ATIVAS' ? 'primary' : 'light'}
                                    onClick={() => setFiltroStatus('ATIVAS')}
                                >
                                    Ativas
                                </Button>
                                <Button
                                    color={filtroStatus === 'INATIVADAS' ? 'primary' : 'light'}
                                    onClick={() => setFiltroStatus('INATIVADAS')}
                                >
                                    Inativadas
                                </Button>
                                <Button
                                    color={filtroStatus === 'TODAS' ? 'primary' : 'light'}
                                    onClick={() => setFiltroStatus('TODAS')}
                                >
                                    Todas
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>

                    {variacoesFiltradas.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            Nenhuma variação encontrada para o filtro selecionado.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-start">SKU</th>
                                        <th scope="col" className="text-start">Cor Primária</th>
                                        <th scope="col" className="text-start">Cor Secundária</th>
                                        <th scope="col" className="text-start">Cor Terciária</th>
                                        <th scope="col">Status</th>
                                        {!readOnly && <th scope="col" style={{ width: '100px' }}>Ação</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {variacoesFiltradas.map((variacao) => (
                                        <tr key={variacao.id}>
                                            <td className="text-start">{variacao.sku || '—'}</td>
                                            <td className="text-start">
                                                {(variacao.cor_primaria && variacao.cor_primaria.descricao) || '—'}
                                            </td>
                                            <td className="text-start">
                                                {(variacao.cor_secundaria && variacao.cor_secundaria.descricao) || '—'}
                                            </td>
                                            <td className="text-start">
                                                {(variacao.cor_terciaria && variacao.cor_terciaria.descricao) || '—'}
                                            </td>
                                            <td>
                                                <VariacaoProdutoStatusBadge status={variacao.status} />
                                            </td>
                                            {!readOnly && (
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        color="soft-danger"
                                                        onClick={() => variacao.id && confirmarExclusao(variacao.id)}
                                                        title="Excluir"
                                                        disabled={excluindo}
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </CardBody>
            </Card>

            <CustomModal
                isOpen={deleteModalOpen}
                toggle={() => setDeleteModalOpen(!deleteModalOpen)}
                title="Confirmação de Exclusão"
                delete={true}
                body="Deseja excluir esta variação? A exclusão é lógica e o registro deixará de aparecer nas listagens."
                onConfirmDelete={executarExclusao}
            />
        </React.Fragment>
    )
}

export default VariacoesProdutoTable
