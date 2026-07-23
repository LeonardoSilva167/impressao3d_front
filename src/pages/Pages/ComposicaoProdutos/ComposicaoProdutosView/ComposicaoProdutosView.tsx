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
    normalizarComposicaoView,
    obterClasseBadgeStatus,
    obterLabelStatus,
    obterPartesResumoComposicao,
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

    const partesResumo = useMemo(
        () => obterPartesResumoComposicao(registro, projeto),
        [registro, projeto]
    )

    const partesPendentes = partesResumo.filter((parte) => !parte.configurada).length
    const todasPartesConfiguradas = partesResumo.length > 0 && partesPendentes === 0

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

        const produto = (registro.id_produto_base ?? registro.id_produto) != null
            ? String(registro.id_produto_base ?? registro.id_produto)
            : contextoFluxo.produto
        const projetoId = registro.id_projeto_impressao != null
            ? String(registro.id_projeto_impressao)
            : contextoFluxo.projeto
        const composicao = String(registro.id)

        const precisaAtualizar = (
            contextoFluxo.composicao !== composicao
            || (produto && contextoFluxo.produto !== produto)
            || (projetoId && contextoFluxo.projeto !== projetoId)
            || contextoFluxo.fluxo !== '1'
        )

        if (!precisaAtualizar) return

        setSearchParams(
            montarParamsFluxo(contextoFluxo, {
                produto: produto || undefined,
                projeto: projetoId || undefined,
                composicao,
                fluxo: '1',
            }),
            { replace: true }
        )
    }, [
        registro?.id,
        registro?.id_produto_base,
        registro?.id_produto,
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
            registro.codigo_projeto || registro.projeto?.codigo_projeto,
            registro.nome_projeto || registro.projeto?.nome_original_projeto,
            registro.descricao_projeto || registro.projeto?.descricao_projeto,
        ].filter(Boolean)
        return partes.length > 0 ? partes.join(' - ') : '—'
    }

    const contextoContinuidade = useMemo(() => ({
        produto: (registro?.id_produto_base ?? registro?.id_produto) != null
            ? String(registro?.id_produto_base ?? registro?.id_produto)
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

    const hrefConfigurarParte = (idParte: string | number | null | undefined) => (
        anexarContextoFluxo(
            `/composicao-produtos/${registro?.id}/parte/${idParte}/configurar`,
            contextoContinuidade,
            { forcarFluxo: true }
        )
    )

    const AcoesContinuidade = ({ className = '' }: { className?: string }) => (
        <div className={`d-flex flex-wrap justify-content-end gap-2 ${className}`.trim()}>
            <Link to={hrefHubEtapa2} className="btn btn-soft-secondary">
                <i className="ri-guide-line me-1" aria-hidden />
                Voltar à etapa 2
            </Link>
            <Link to={hrefEditarVinculo} className="btn btn-soft-primary">
                <i className="ri-edit-line me-1" aria-hidden />
                Editar
            </Link>
            <Link to={hrefHubEtapa3} className="btn btn-success">
                <i className="ri-arrow-right-line me-1" aria-hidden />
                Continuar: montagem
            </Link>
        </div>
    )

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
                                            <AcoesContinuidade className="mb-4" />

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
                                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                                                <h5 className="mb-0">Partes do Projeto</h5>
                                                {partesResumo.length > 0 && (
                                                    <span className="small text-muted">
                                                        {todasPartesConfiguradas
                                                            ? 'Todas as partes configuradas'
                                                            : `${partesPendentes} parte(s) pendente(s)`}
                                                    </span>
                                                )}
                                            </div>

                                            {partesResumo.length === 0 ? (
                                                <p className="text-muted">Nenhuma parte encontrada no projeto.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Parte</th>
                                                                <th>Status configuração</th>
                                                                <th>Itens</th>
                                                                <th>Total de variações</th>
                                                                <th style={{ width: '220px' }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {partesResumo.map((parte) => {
                                                                const idParte = parte.id_projeto_impressao_parte ?? parte.id
                                                                const configurada = Boolean(parte.configurada)
                                                                const totalVariacoes = parte.total_variacoes
                                                                    ?? parte.quantidade_variacoes
                                                                    ?? 0

                                                                return (
                                                                    <tr key={String(idParte)}>
                                                                        <td className="fw-medium">{parte.nome_parte}</td>
                                                                        <td>
                                                                            <Badge color={configurada ? 'success' : 'warning'}>
                                                                                {configurada ? 'Configurada' : 'Pendente'}
                                                                            </Badge>
                                                                        </td>
                                                                        <td>{parte.quantidade_itens ?? 0}</td>
                                                                        <td>
                                                                            {totalVariacoes}
                                                                            {typeof parte.variacoes_com_filamento === 'number' && totalVariacoes > 0 && (
                                                                                <span className="text-muted small ms-1">
                                                                                    ({parte.variacoes_com_filamento}/{totalVariacoes} c/ filamento)
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <Link
                                                                                to={hrefConfigurarParte(idParte)}
                                                                                className={`btn btn-sm ${configurada ? 'btn-soft-primary' : 'btn-primary'}`}
                                                                            >
                                                                                <i className="ri-settings-3-line me-1" aria-hidden />
                                                                                {configurada ? 'Editar configuração' : 'Configurar parte'}
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-3 border-top">
                                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                                                    <div>
                                                        <h6 className="mb-1">
                                                            {todasPartesConfiguradas
                                                                ? 'Pronto para montagem'
                                                                : 'Continuidade do fluxo'}
                                                        </h6>
                                                        <p className="text-muted small mb-0">
                                                            {todasPartesConfiguradas
                                                                ? 'Todas as partes estão configuradas. Avance para a etapa 3 e crie a montagem.'
                                                                : 'Configure as partes pendentes ou avance para a montagem quando estiver pronto.'}
                                                        </p>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <Link to={hrefHubEtapa2} className="btn btn-soft-secondary">
                                                            <i className="ri-guide-line me-1" aria-hidden />
                                                            Voltar à etapa 2
                                                        </Link>
                                                        <Link to={hrefHubEtapa3} className="btn btn-success">
                                                            <i className="ri-arrow-right-line me-1" aria-hidden />
                                                            Continuar: montagem
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

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
