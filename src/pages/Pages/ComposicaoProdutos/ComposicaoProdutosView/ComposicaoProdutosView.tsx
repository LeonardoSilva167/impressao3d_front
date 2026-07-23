import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Badge, Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner, Table
} from 'reactstrap'
import { ComposicaoProdutosView } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { ProjetosImpressaoView } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import {
    montarPartesResumo,
    normalizarComposicaoView,
    obterClasseBadgeStatus,
    obterLabelStatus,
} from '../hooks/useComposicaoProdutos'
import { montarHrefEtapaFluxo } from 'pages/Pages/FluxoProducao/fluxoProducaoConfig'
import {
    anexarContextoFluxo,
    lerContextoFluxo,
    montarParamsFluxo,
} from 'pages/Pages/FluxoProducao/fluxoProducaoContext'

const ComposicaoProdutosViewPage = () => {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const contextoFluxo = useMemo(() => lerContextoFluxo(searchParams), [searchParams])
    const { voltarParaRotaAnterior } = useNavegacao()
    const composicaoService = new ComposicaoProdutosService()
    const projetosService = new ProjetosImpressaoService()

    const [registro, setRegistro] = useState<ComposicaoProdutosView>()
    const [projeto, setProjeto] = useState<ProjetosImpressaoView>()
    const [loading, setLoading] = useState(true)

    const partesResumo = registro && projeto
        ? montarPartesResumo(
            projeto,
            registro.configuracao_itens || [],
            registro.variacoes_itens || []
        )
        : []

    const loadRegistro = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const view = await composicaoService.getViewComposicaoProdutos({ id: registroId })
            if (!view) {
                toast.error('Vínculo não encontrado.')
                return
            }

            let projetoView: ProjetosImpressaoView | undefined
            if (view.id_projeto_impressao) {
                projetoView = await projetosService.getViewProjetosImpressao({
                    id: Number(view.id_projeto_impressao),
                })
            }

            if (projetoView) setProjeto(projetoView)
            setRegistro(normalizarComposicaoView(view, projetoView))
        } catch (error) {
            console.error('Erro ao carregar composição:', error)
            toast.error('Erro ao carregar vínculo.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/composicao-produtos')
    }, [])

    useEffect(() => {
        loadRegistro()
    }, [id])

    // Garante contexto do fluxo na URL (produto/projeto/composicao/fluxo)
    useEffect(() => {
        if (!registro?.id) return

        const produto = registro.id_produto_base != null
            ? String(registro.id_produto_base)
            : contextoFluxo.produto
        const projeto = registro.id_projeto_impressao != null
            ? String(registro.id_projeto_impressao)
            : contextoFluxo.projeto
        const composicao = String(registro.id)

        const precisaAtualizar = (
            contextoFluxo.composicao !== composicao
            || (produto && contextoFluxo.produto !== produto)
            || (projeto && contextoFluxo.projeto !== projeto)
            || contextoFluxo.fluxo !== '1'
        )

        if (!precisaAtualizar) return

        setSearchParams(
            montarParamsFluxo(contextoFluxo, {
                produto: produto || undefined,
                projeto: projeto || undefined,
                composicao,
                fluxo: '1',
            }),
            { replace: true }
        )
    }, [
        registro?.id,
        registro?.id_produto_base,
        registro?.id_projeto_impressao,
        contextoFluxo.produto,
        contextoFluxo.projeto,
        contextoFluxo.composicao,
        contextoFluxo.fluxo,
        setSearchParams,
    ])

    const obterNomeProjeto = (): string => {
        if (!registro) return '—'
        const partes = [
            registro.codigo_projeto,
            registro.nome_projeto,
            registro.descricao_projeto,
        ].filter(Boolean)
        return partes.length > 0 ? partes.join(' - ') : '—'
    }

    const contextoContinuidade = useMemo(() => ({
        produto: registro?.id_produto_base != null
            ? String(registro.id_produto_base)
            : contextoFluxo.produto,
        projeto: registro?.id_projeto_impressao != null
            ? String(registro.id_projeto_impressao)
            : contextoFluxo.projeto,
        composicao: registro?.id != null
            ? String(registro.id)
            : contextoFluxo.composicao || id || undefined,
        fluxo: '1' as const,
    }), [registro, contextoFluxo, id])

    const hrefHubEtapa2 = montarHrefEtapaFluxo(2, contextoContinuidade)
    const hrefHubEtapa3 = montarHrefEtapaFluxo(3, contextoContinuidade)
    const hrefEditarVinculo = registro?.id
        ? anexarContextoFluxo(`/composicao-produtos/edit/${registro.id}`, contextoContinuidade, { forcarFluxo: true })
        : '/composicao-produtos'

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/composicao-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar {DominioProducaoLabels.vinculo}</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/composicao-produtos">{DominioProducaoLabels.vinculo}</Link></BreadcrumbItem>
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
                                        <div className="text-center py-5 text-muted">Vínculo não encontrado.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex flex-wrap justify-content-end gap-2 mb-4">
                                                <Link
                                                    to={hrefHubEtapa2}
                                                    className="btn btn-soft-secondary"
                                                >
                                                    <i className="ri-guide-line me-1"></i>
                                                    Voltar à etapa 2
                                                </Link>
                                                <Link
                                                    to={hrefEditarVinculo}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar
                                                </Link>
                                                <Link
                                                    to={hrefHubEtapa3}
                                                    className="btn btn-success"
                                                >
                                                    <i className="ri-arrow-right-line me-1"></i>
                                                    Continuar: montagem
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados do Vínculo</h5>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Produto</Label>
                                                    <div>{registro.produto_descricao || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Projeto</Label>
                                                    <div>{obterNomeProjeto()}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Status</Label>
                                                    <div>
                                                        <Badge className={obterClasseBadgeStatus(registro.status)}>
                                                            {obterLabelStatus(registro.status)}
                                                        </Badge>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <h5 className="mb-3">Partes do Projeto</h5>

                                            {partesResumo.length === 0 ? (
                                                <p className="text-muted">Nenhuma parte encontrada no projeto.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Parte</th>
                                                                <th>Config. de impressão</th>
                                                                <th style={{ width: '200px' }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {partesResumo.map((parte) => (
                                                                <tr key={String(parte.id_projeto_impressao_parte)}>
                                                                    <td>{parte.nome_parte}</td>
                                                                    <td>{parte.quantidade_itens ?? 0}</td>
                                                                    <td>
                                                                        <Link
                                                                            to={`/composicao-produtos/${registro.id}/parte/${parte.id_projeto_impressao_parte}/configurar`}
                                                                            className="btn btn-sm btn-primary"
                                                                        >
                                                                            <i className="ri-settings-3-line me-1"></i>
                                                                            Configurar Parte
                                                                        </Link>
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

export default ComposicaoProdutosViewPage
