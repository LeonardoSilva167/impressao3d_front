import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import {
    formatDateSQLForBR,
    formatarParaMoedaSemSimbolo,
    useNavegacao,
} from 'helpers/functions_helpers'
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Col,
    Container,
    Label,
    Row,
    Spinner,
    Table,
} from 'reactstrap'
import { CompraItens, CompraMovimentacao, ComprasView } from 'interfaces/Compras/ComprasInterface'
import { ComprasService } from 'services/Compras/ComprasService'
import ComprasStatusBadge from '../ComprasStatusBadge/ComprasStatusBadge'

const TIPO_ITEM_FILAMENTO = 'FILAMENTO'

const formatarValorUnitarioReal = (valor: number | string | null | undefined): string => {
    const num = Number(valor ?? 0)
    if (isNaN(num)) return '0,0000'
    return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    })
}

const formatarQuantidadeLote = (item: CompraItens, quantidade: number | string | null | undefined): string => {
    if (quantidade == null || quantidade === '') return '—'
    const qtd = Number(quantidade)
    if (isNaN(qtd)) return String(quantidade)
    if (item.tipo_item === TIPO_ITEM_FILAMENTO || item.item_unidade_medida === 'g') {
        return `${qtd.toLocaleString('pt-BR')}g`
    }
    return qtd.toLocaleString('pt-BR')
}

const obterNomeItem = (item: CompraItens): string => {
    if (item.nome_item) return item.nome_item
    if (item.item_descricao && item.item_codigo) {
        return `${item.item_descricao} (${item.item_codigo})`
    }
    return item.item_descricao || item.item_codigo || '—'
}

const ComprasViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const comprasService = new ComprasService()
    const [compra, setCompra] = useState<ComprasView>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setActiveMenu('/compras')
    }, [])

    useEffect(() => {
        const loadCompra = async () => {
            if (!id) return

            setLoading(true)
            try {
                const view = await comprasService.getViewCompras({ id })
                if (view) setCompra(view)
            } catch (error) {
                console.error('Erro ao carregar compra:', error)
                toast.error('Erro ao carregar compra')
            } finally {
                setLoading(false)
            }
        }

        loadCompra()
    }, [id])

    const itens = compra?.compra_itens?.length
        ? compra.compra_itens
        : (compra?.itens || [])

    const movimentacoes = compra?.movimentacoes || []

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/compras"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3 d-flex align-items-center gap-2">
                                        Visualizar Compra
                                        {compra?.status && <ComprasStatusBadge status={compra.status} />}
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/compras">Compras</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>Visualizar</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : !compra ? (
                                        <div className="text-center py-5 text-muted">Compra não encontrada.</div>
                                    ) : (
                                        <>
                                            <h5 className="mb-3">Dados da Compra</h5>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Plataforma</Label>
                                                    <div>{compra.plataforma_compra_descricao || compra.plataforma_descricao || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Número do Pedido</Label>
                                                    <div>{compra.numero_pedido || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Data da Compra</Label>
                                                    <div>{compra.data_compra ? formatDateSQLForBR(compra.data_compra) : '—'}</div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Frete</Label>
                                                    <div>R$ {formatarParaMoedaSemSimbolo(compra.valor_frete)}</div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Desconto</Label>
                                                    <div>R$ {formatarParaMoedaSemSimbolo(compra.desconto ?? compra.valor_desconto)}</div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Taxa</Label>
                                                    <div>R$ {formatarParaMoedaSemSimbolo(compra.valor_taxa)}</div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Imposto</Label>
                                                    <div>R$ {formatarParaMoedaSemSimbolo(compra.valor_imposto)}</div>
                                                </Col>
                                                <Col md={12} className="mb-3">
                                                    <Label className="form-label fw-semibold">Observação</Label>
                                                    <div>{compra.observacao || '—'}</div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <h5 className="mb-3 mt-4">Itens da Compra</h5>
                                            <div className="table-responsive">
                                                <Table className="table-bordered table-nowrap align-middle mb-0 text-center">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="text-start">Item</th>
                                                            <th>Qtd Compra</th>
                                                            <th>Qtd Interna</th>
                                                            <th>Qtd Original</th>
                                                            <th>Qtd Atual</th>
                                                            <th className="text-end">Valor Unit. Compra</th>
                                                            <th className="text-end">Valor Unit. Real</th>
                                                            <th className="text-end">Valor Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itens.length ? itens.map((item, index) => (
                                                            <tr key={item.id || index}>
                                                                <td className="text-start">{obterNomeItem(item)}</td>
                                                                <td>{item.qtd_compra ?? '—'}</td>
                                                                <td>{formatarQuantidadeLote(item, item.qtd_interna)}</td>
                                                                <td>{formatarQuantidadeLote(item, item.qtd_original ?? item.qtd_interna)}</td>
                                                                <td>{formatarQuantidadeLote(item, item.qtd_atual)}</td>
                                                                <td className="text-end">R$ {formatarParaMoedaSemSimbolo(item.valor_unitario_compra)}</td>
                                                                <td className="text-end">R$ {formatarValorUnitarioReal(item.valor_unitario_real)}</td>
                                                                <td className="text-end">R$ {formatarParaMoedaSemSimbolo(item.valor_total)}</td>
                                                            </tr>
                                                        )) : (
                                                            <tr>
                                                                <td colSpan={8} className="text-muted">Nenhum item encontrado.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="d-flex flex-column align-items-end gap-2">
                                                        <div className="fs-5">
                                                            <strong>Total Final:</strong> R$ {formatarParaMoedaSemSimbolo(compra.valor_total)}
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <h5 className="mb-3 mt-4">Movimentações</h5>
                                            <div className="table-responsive">
                                                <Table className="table-bordered table-nowrap align-middle mb-0 text-center">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Data</th>
                                                            <th className="text-start">Item</th>
                                                            <th>Tipo</th>
                                                            <th>Quantidade</th>
                                                            <th>Saldo Anterior</th>
                                                            <th>Saldo Posterior</th>
                                                            <th className="text-start">Observação</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {movimentacoes.length ? movimentacoes.map((mov: CompraMovimentacao, index) => (
                                                            <tr key={mov.id || index}>
                                                                <td>{mov.data_movimentacao ? formatDateSQLForBR(mov.data_movimentacao.split(' ')[0]) : '—'}</td>
                                                                <td className="text-start">{mov.item_descricao || '—'}</td>
                                                                <td>{mov.tipo_movimentacao || '—'}</td>
                                                                <td>{mov.qtd ?? '—'}</td>
                                                                <td>{mov.saldo_anterior ?? '—'}</td>
                                                                <td>{mov.saldo_posterior ?? '—'}</td>
                                                                <td className="text-start">{mov.observacao || '—'}</td>
                                                            </tr>
                                                        )) : (
                                                            <tr>
                                                                <td colSpan={7} className="text-muted">Nenhuma movimentação encontrada.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>
                                                            Voltar
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ComprasViewPage
