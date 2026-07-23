import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Alert, Badge, Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container,
    Label, Row, Spinner, Table
} from 'reactstrap'
import { GradeProdutosView } from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { GradeProdutosService } from 'services/GradeProdutos/GradeProdutosService'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import {
    estaNoFluxoGuiado,
    lerContextoFluxo,
} from 'pages/Pages/FluxoProducao/fluxoProducaoContext'
import { montarHrefEtapaFluxo } from 'pages/Pages/FluxoProducao/fluxoProducaoConfig'
import {
    formatarCustoGrade,
    formatarPartesCombinacao,
    formatarPesoGrade,
    formatarTempoGrade,
    obterClasseBadgeStatusProdutoGerado,
    obterCodigoBaseGrade,
    obterLabelStatusProdutoGerado,
    obterPartesUtilizadasGrade,
    obterQuantidadeCombinacoesGrade,
    obterQuantidadeProdutosGerados,
} from '../hooks/useGradeProdutos'

const GradeProdutosViewPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const gradeService = new GradeProdutosService()
    const contextoFluxo = useMemo(() => lerContextoFluxo(searchParams), [searchParams])
    const noFluxoGuiado = estaNoFluxoGuiado(contextoFluxo)

    const [registro, setRegistro] = useState<GradeProdutosView>()
    const [loading, setLoading] = useState(true)

    const loadRegistro = async () => {
        if (!id) {
            setLoading(false)
            return
        }

        const registroId = Number(id)
        if (Number.isNaN(registroId)) {
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const view = await gradeService.getViewGradeProdutos({ id: registroId })
            if (!view || view.id == null) {
                // Fallback: listar/:id às vezes é produto gerado — redireciona para a tela correta
                const produto = await gradeService.getViewProdutoGerado({ id: registroId })
                if (produto?.id != null) {
                    navigate(`/grade-produtos/produto/${produto.id}`, { replace: true })
                    return
                }
                toast.error('Montagem não encontrada.')
                return
            }
            setRegistro(view)
        } catch (error) {
            console.error('Erro ao carregar montagem:', error)
            try {
                const produto = await gradeService.getViewProdutoGerado({ id: registroId })
                if (produto?.id != null) {
                    navigate(`/grade-produtos/produto/${produto.id}`, { replace: true })
                    return
                }
            } catch {
                // ignore fallback error
            }
            toast.error('Erro ao carregar montagem.')
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

    const contextoContinuidade = useMemo(() => ({
        ...contextoFluxo,
        produto: registro?.id_produto_base != null
            ? String(registro.id_produto_base)
            : contextoFluxo.produto,
        fluxo: noFluxoGuiado ? '1' : contextoFluxo.fluxo,
    }), [registro, contextoFluxo, noFluxoGuiado])

    const hrefHubEtapa3 = montarHrefEtapaFluxo(3, contextoContinuidade)
    const hrefVoltar = noFluxoGuiado ? hrefHubEtapa3 : '/grade-produtos'

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to={hrefVoltar}><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar {DominioProducaoLabels.montagem}</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    {noFluxoGuiado ? (
                                        <BreadcrumbItem>
                                            <Link to={hrefHubEtapa3}>Fluxo · Etapa 3</Link>
                                        </BreadcrumbItem>
                                    ) : (
                                        <BreadcrumbItem>
                                            <Link to="/grade-produtos">{DominioProducaoLabels.montagem}</Link>
                                        </BreadcrumbItem>
                                    )}
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
                                        <div className="text-center py-5 text-muted">Montagem não encontrada.</div>
                                    ) : (
                                        <>
                                            {noFluxoGuiado && (
                                                <Alert color="success" className="mb-4">
                                                    <strong>Etapa 3 concluída</strong>
                                                    {' '}· Montagem gerada com sucesso.
                                                    <span className="d-block mt-1 small mb-0">
                                                        Os SKUs finais estão listados abaixo. Você pode voltar ao hub do fluxo quando quiser.
                                                    </span>
                                                </Alert>
                                            )}

                                            <div className="d-flex flex-wrap justify-content-end gap-2 mb-4">
                                                {noFluxoGuiado && (
                                                    <Link to={hrefHubEtapa3} className="btn btn-soft-secondary">
                                                        <i className="ri-guide-line me-1" aria-hidden />
                                                        Voltar ao fluxo
                                                    </Link>
                                                )}
                                                <Link
                                                    to={`/grade-produtos/edit/${registro.id}`}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados da Montagem</h5>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Código Base</Label>
                                                    <div>{obterCodigoBaseGrade(registro)}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Descrição da Montagem</Label>
                                                    <div>{registro.descricao || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Partes Utilizadas</Label>
                                                    <div>{obterPartesUtilizadasGrade(registro)}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Quantidade de Combinações</Label>
                                                    <div>{obterQuantidadeCombinacoesGrade(registro)}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Quantidade de Produtos Gerados</Label>
                                                    <div>{obterQuantidadeProdutosGerados(registro)}</div>
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

                                            {(registro.produtos_gerados || []).length === 0 ? (
                                                <p className="text-muted">Nenhum produto gerado nesta montagem.</p>
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
                                                            {(registro.produtos_gerados || []).map((produto, index) => (
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
                                                                        <Badge className={obterClasseBadgeStatusProdutoGerado(produto.status)}>
                                                                            {obterLabelStatusProdutoGerado(produto.status)}
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
                                                            onClick={() => {
                                                                if (noFluxoGuiado) {
                                                                    navigate(hrefVoltar)
                                                                    return
                                                                }
                                                                voltarParaRotaAnterior()
                                                            }}
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
