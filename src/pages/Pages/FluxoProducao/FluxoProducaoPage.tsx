import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Spinner,
} from 'reactstrap'
import { setActiveMenu } from 'helpers/system_helpers'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import UiContent from 'Components/Common/UiContent'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import { normalizarProdutoView } from 'pages/Pages/Produtos/hooks/useProdutos'
import {
    EtapaFluxoId,
    FLUXO_PRODUCAO_ETAPAS,
    etapaFluxoLiberada,
    inferirEtapaPorRota,
    montarProgressoEtapasFluxo,
    normalizarEtapaFluxo,
} from './fluxoProducaoConfig'
import { lerContextoFluxo } from './fluxoProducaoContext'
import { ProdutoResumoFluxo, montarItensChecklistFluxo } from './FluxoProducaoChecklist'
import FluxoProducaoEtapaPainel from './FluxoProducaoEtapaPainel'

const FluxoProducaoPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const contexto = useMemo(() => lerContextoFluxo(searchParams), [searchParams])
    const produtoId = contexto.produto
    const projetoId = contexto.projeto
    const composicaoId = contexto.composicao
    const etapaParam = Number(contexto.etapa)
    const etapaSolicitada = inferirEtapaPorRota(
        '/fluxo-producao',
        Number.isNaN(etapaParam) ? null : etapaParam
    )
    const [produtoResumo, setProdutoResumo] = useState<ProdutoResumoFluxo | null>(null)
    const [carregandoProduto, setCarregandoProduto] = useState(false)

    const etapas = useMemo(() => FLUXO_PRODUCAO_ETAPAS, [])

    const progresso = useMemo(
        () => montarProgressoEtapasFluxo({
            produtoId,
            projetoId,
            composicaoId,
        }),
        [produtoId, projetoId, composicaoId]
    )

    const etapaAtiva = useMemo(
        () => normalizarEtapaFluxo(etapaSolicitada, progresso),
        [etapaSolicitada, progresso]
    )

    const selecionarEtapa = (etapa: EtapaFluxoId) => {
        if (!etapaFluxoLiberada(etapa, progresso)) return

        const next = new URLSearchParams(searchParams)
        next.set('etapa', String(etapa))
        setSearchParams(next, { replace: true })
    }

    useEffect(() => {
        setActiveMenu('/fluxo-producao')
    }, [])

    // Corrige URL se o usuário tentar abrir etapa ainda bloqueada
    useEffect(() => {
        if (etapaSolicitada !== etapaAtiva) {
            const next = new URLSearchParams(searchParams)
            next.set('etapa', String(etapaAtiva))
            setSearchParams(next, { replace: true })
        }
    }, [etapaSolicitada, etapaAtiva, searchParams, setSearchParams])

    useEffect(() => {
        let cancelado = false

        const carregarProduto = async () => {
            if (!produtoId) {
                setProdutoResumo(null)
                return
            }

            const idNumerico = Number(produtoId)
            if (Number.isNaN(idNumerico)) {
                setProdutoResumo({ id: produtoId })
                return
            }

            setCarregandoProduto(true)
            try {
                const service = new ProdutosService()
                const view = await service.getViewProdutos({ id: idNumerico })
                if (cancelado) return

                if (view) {
                    const normalizado = normalizarProdutoView(view as Record<string, any>)
                    setProdutoResumo({
                        id: normalizado.id ?? idNumerico,
                        descricao: normalizado.descricao_produto,
                        sku_base: normalizado.sku_base,
                    })
                } else {
                    setProdutoResumo({ id: idNumerico })
                }
            } catch (error) {
                console.error('Erro ao carregar produto do fluxo:', error)
                if (!cancelado) {
                    setProdutoResumo({ id: idNumerico })
                }
            } finally {
                if (!cancelado) setCarregandoProduto(false)
            }
        }

        carregarProduto()
        return () => {
            cancelado = true
        }
    }, [produtoId])

    const etapaAtual = etapas.find((etapa) => etapa.id === etapaAtiva) || etapas[0]
    const mostrarChecklist = Boolean(produtoId) || etapaAtiva === 2 || etapaAtiva === 3
    const proximaEtapaLiberada = etapaAtiva < 3 && etapaFluxoLiberada((etapaAtiva + 1) as EtapaFluxoId, progresso)

    const itensChecklist = useMemo(
        () => montarItensChecklistFluxo({
            produtoId,
            projetoId,
            composicaoId,
            etapaAtiva,
            produto: produtoResumo,
        }),
        [produtoId, projetoId, composicaoId, etapaAtiva, produtoResumo]
    )

    return (
        <React.Fragment>
            <div className="page-content">
                <UiContent />
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link to="/dashboard" className="me-2">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-0">{DominioProducaoLabels.fluxoProducao}</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem>
                                        <Link to="/dashboard"><i className="ri-home-5-fill"></i></Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem active>{DominioProducaoLabels.fluxoProducao}</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>

                    {carregandoProduto && produtoId && (
                        <div className="mb-3 text-muted small d-inline-flex align-items-center gap-2">
                            <Spinner size="sm" /> Carregando produto…
                        </div>
                    )}

                    <Card className="border-0 shadow-sm">
                        <CardBody className="p-3 p-md-4">
                            <FluxoProducaoEtapaPainel
                                etapa={etapaAtual}
                                totalEtapas={etapas.length}
                                contexto={contexto}
                                progresso={progresso}
                                mostrarChecklist={mostrarChecklist}
                                itensChecklist={itensChecklist}
                                proximaEtapaLiberada={proximaEtapaLiberada}
                                onEtapaAnterior={() => selecionarEtapa((etapaAtiva - 1) as EtapaFluxoId)}
                                onProximaEtapa={() => selecionarEtapa((etapaAtiva + 1) as EtapaFluxoId)}
                                onSelecionarEtapa={selecionarEtapa}
                            />
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default FluxoProducaoPage
