import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
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
} from 'reactstrap'
import { LookupsProdutos, ProdutosView } from 'interfaces/Produtos/ProdutosInterface'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import { normalizarLookupsProdutos, normalizarProdutoView } from '../hooks/useProdutos'
import VariacoesProdutoTable from '../VariacoesProdutoTable/VariacoesProdutoTable'

const ProdutosViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const produtosService = new ProdutosService()

    const [produto, setProduto] = useState<ProdutosView>()
    const [lookups, setLookups] = useState<LookupsProdutos>()
    const [loading, setLoading] = useState(true)
    const loadProduto = async () => {
        if (!id) return

        const produtoId = Number(id)
        if (Number.isNaN(produtoId)) return

        setLoading(true)
        try {
            const [view, lookupsData] = await Promise.all([
                produtosService.getViewProdutos({ id: produtoId }),
                produtosService.getLookupsProdutos(),
            ])

            if (view) {
                setProduto(normalizarProdutoView(view as Record<string, any>))
            }
            if (lookupsData) {
                setLookups(normalizarLookupsProdutos(lookupsData as Record<string, any>))
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error)
            toast.error('Erro ao carregar produto.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/produtos')
    }, [])

    useEffect(() => {
        loadProduto()
    }, [id])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar Produto Base</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/produtos">Produtos</Link></BreadcrumbItem>
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
                                    ) : !produto ? (
                                        <div className="text-center py-5 text-muted">Produto não encontrado.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-end gap-2 mb-4">
                                                <Link
                                                    to={`/produtos/edit/${produto.id}`}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar Produto
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados do Produto</h5>
                                            <Row>
                                                <Col md={8} className="mb-3">
                                                    <Label className="form-label fw-semibold">Descrição Produto</Label>
                                                    <div>{produto.descricao_produto || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Código Base</Label>
                                                    <div>{produto.codigo_base || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Categoria</Label>
                                                    <div>{(produto.categoria && produto.categoria.descricao) || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Modelo</Label>
                                                    <div>{(produto.modelo && produto.modelo.descricao) || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Linha</Label>
                                                    <div>{(produto.linha && produto.linha.descricao) || '—'}</div>
                                                </Col>
                                                <Col md={12} className="mb-3">
                                                    <Label className="form-label fw-semibold">SKU Base</Label>
                                                    <div>{produto.sku_base || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Quantidade de Variações</Label>
                                                    <div>{produto.quantidade_variacoes != null ? produto.quantidade_variacoes : 0}</div>
                                                </Col>
                                            </Row>

                                            <hr />

                                            {produto.id && produto.sku_base && (
                                                <VariacoesProdutoTable
                                                    produtoId={produto.id}
                                                    skuBase={produto.sku_base}
                                                    variacoes={produto.variacoes || []}
                                                    lookups={lookups}
                                                    onReload={loadProduto}
                                                />
                                            )}

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-soft-success"
                                                            onClick={voltarParaRotaAnterior}
                                                        >
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

export default ProdutosViewPage
