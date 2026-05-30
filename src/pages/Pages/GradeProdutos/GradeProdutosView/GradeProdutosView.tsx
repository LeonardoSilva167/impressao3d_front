import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Badge, Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container,
    Label, Row, Spinner, Table
} from 'reactstrap'
import { GradeProdutosView, GradeProdutoGeradoList } from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { GradeProdutosService } from 'services/GradeProdutos/GradeProdutosService'
import { carregarCustosProducaoConfig } from 'hooks/useCustosProducaoConfig'
import {
    formatarCustoGrade,
    formatarPartesCombinacao,
    formatarPesoGrade,
    formatarTempoGrade,
    obterClasseBadgeStatusGrade,
    obterLabelStatusGrade,
    obterNomeProdutoBase,
    resolverProdutosGeradosGrade,
} from '../hooks/useGradeProdutos'

const GradeProdutosViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const gradeService = new GradeProdutosService()

    const [registro, setRegistro] = useState<GradeProdutosView>()
    const [produtosGerados, setProdutosGerados] = useState<GradeProdutoGeradoList[]>([])
    const [loading, setLoading] = useState(true)

    const loadRegistro = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const config = await carregarCustosProducaoConfig()
            const view = await gradeService.getViewGradeProdutos({ id: registroId })
            if (!view) {
                toast.error('Grade não encontrada.')
                return
            }
            setRegistro(view)
            setProdutosGerados(resolverProdutosGeradosGrade(view, config))
        } catch (error) {
            console.error('Erro ao carregar grade:', error)
            toast.error('Erro ao carregar grade.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/grade-produtos')
    }, [])

    useEffect(() => {
        loadRegistro()
    }, [id])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/grade-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar Grade de Produtos</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/grade-produtos">Grade de Produtos</Link></BreadcrumbItem>
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
                                    ) : !registro ? (
                                        <div className="text-center py-5 text-muted">Grade não encontrada.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-end gap-2 mb-4">
                                                <Link
                                                    to={`/grade-produtos/edit/${registro.id}`}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados da Grade</h5>
                                            <Row>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Produto Base</Label>
                                                    <div>{obterNomeProdutoBase(registro)}</div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Quantidade Produtos</Label>
                                                    <div>{registro.quantidade_produtos != null ? registro.quantidade_produtos : produtosGerados.length}</div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Status</Label>
                                                    <div>
                                                        <Badge className={obterClasseBadgeStatusGrade(registro.status)}>
                                                            {obterLabelStatusGrade(registro.status)}
                                                        </Badge>
                                                    </div>
                                                </Col>
                                                <Col md={3} className="mb-3">
                                                    <Label className="form-label fw-semibold">Data Criação</Label>
                                                    <div>{registro.data_criacao || '—'}</div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            {(registro.combinacoes && registro.combinacoes.length > 0) && (
                                                <>
                                                    <h5 className="mb-3">Combinações</h5>
                                                    <div className="table-responsive mb-4">
                                                        <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Descrição</th>
                                                                    <th>Partes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {registro.combinacoes.map((combinacao, index) => (
                                                                    <tr key={combinacao.id != null ? combinacao.id : index}>
                                                                        <td>{combinacao.descricao || '—'}</td>
                                                                        <td>{formatarPartesCombinacao(combinacao.partes || [])}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <hr />
                                                </>
                                            )}
                                            <h5 className="mb-3">Produtos Gerados</h5>

                                            {produtosGerados.length === 0 ? (
                                                <p className="text-muted">Nenhum produto gerado nesta grade.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Nome Produto</th>
                                                                <th>SKU</th>
                                                                <th>Peso Total</th>
                                                                <th>Tempo Total</th>
                                                                <th>Custo Filamento</th>
                                                                <th>Custo Energia</th>
                                                                <th>Custo Desgaste</th>
                                                                <th>Custo Total</th>
                                                                <th>Status</th>
                                                                <th style={{ width: '120px' }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {produtosGerados.map((produto, index) => (
                                                                <tr key={produto.id != null ? produto.id : index}>
                                                                    <td>{produto.nome_produto || '—'}</td>
                                                                    <td>{produto.sku || '—'}</td>
                                                                    <td>{formatarPesoGrade(produto.peso_total)}</td>
                                                                    <td>{formatarTempoGrade(produto.tempo_total)}</td>
                                                                    <td>{formatarCustoGrade(produto.custo_filamento)}</td>
                                                                    <td>{formatarCustoGrade(produto.custo_energia)}</td>
                                                                    <td>{formatarCustoGrade(produto.custo_desgaste)}</td>
                                                                    <td>{formatarCustoGrade(produto.custo_total)}</td>
                                                                    <td>
                                                                        <Badge className="bg-secondary">
                                                                            {produto.status || '—'}
                                                                        </Badge>
                                                                    </td>
                                                                    <td>
                                                                        {produto.id != null && (
                                                                            <Link
                                                                                to={`/grade-produtos/produto/${produto.id}`}
                                                                                className="btn btn-sm btn-soft-primary"
                                                                            >
                                                                                Visualizar
                                                                            </Link>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
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

export default GradeProdutosViewPage
