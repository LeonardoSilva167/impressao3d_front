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
import { FluxoProducaoService } from 'services/FluxoProducao/FluxoProducaoService'
import { FluxoProducaoProgresso } from 'interfaces/FluxoProducao/FluxoProducaoInterface'
import {
    EtapaFluxoId,
    FLUXO_PRODUCAO_ETAPAS,
    ProgressoEtapasFluxo,
    etapaFluxoLiberada,
    inferirEtapaPorRota,
    montarProgressoEtapasFluxo,
    normalizarEtapaFluxo,
} from './fluxoProducaoConfig'
import { lerContextoFluxo, montarParamsFluxo } from './fluxoProducaoContext'
import {
    ProdutoResumoFluxo,
    ProjetoResumoFluxo,
    montarItensChecklistFluxo,
} from './FluxoProducaoChecklist'
import FluxoProducaoEtapaPainel from './FluxoProducaoEtapaPainel'

const progressoFromApi = (data: FluxoProducaoProgresso): ProgressoEtapasFluxo => ({
    produtoOk: Boolean(data.subpassos.E1_PRODUTO),
    projetoOk: Boolean(data.subpassos.E2_PROJETO),
    vinculoOk: Boolean(data.subpassos.E2_VINCULO),
    partesOk: Boolean(data.subpassos.E2_PARTES),
    montagemOk: Boolean(data.subpassos.E3_MONTAGEM),
})

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
    const [projetoResumo, setProjetoResumo] = useState<ProjetoResumoFluxo | null>(null)
    const [carregandoProgresso, setCarregandoProgresso] = useState(false)
    const [progressoApi, setProgressoApi] = useState<ProgressoEtapasFluxo | null>(null)
    const [idsResolvidos, setIdsResolvidos] = useState<{
        projeto?: string | null
        composicao?: string | null
        grade?: string | null
    }>({})
    const [contagemPartes, setContagemPartes] = useState<{
        total: number
        configuradas: number
    } | null>(null)

    const etapas = useMemo(() => FLUXO_PRODUCAO_ETAPAS, [])

    const projetoEfetivo = projetoId || idsResolvidos.projeto || null
    const composicaoEfetiva = composicaoId || idsResolvidos.composicao || null
    const gradeEfetiva = idsResolvidos.grade || null

    const progressoFallback = useMemo(
        () => montarProgressoEtapasFluxo({
            produtoId,
            projetoId: projetoEfetivo,
            composicaoId: composicaoEfetiva,
            partesConfiguradas: false,
            montagemCriada: Boolean(gradeEfetiva),
        }),
        [produtoId, projetoEfetivo, composicaoEfetiva, gradeEfetiva]
    )

    const progresso = progressoApi || progressoFallback

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

    // Progresso agregado (Fase 6 / B4): basta produto na query
    useEffect(() => {
        let cancelado = false

        const aplicarProgresso = (data: FluxoProducaoProgresso) => {
            setProgressoApi(progressoFromApi(data))
            setProdutoResumo({
                id: data.produto.id,
                descricao: data.produto.descricao_produto,
                sku_base: data.produto.sku_base,
            })
            setProjetoResumo(data.projeto
                ? {
                    id: data.projeto.id,
                    nome: data.projeto.nome_original_projeto,
                    codigo: data.projeto.codigo_projeto,
                }
                : null)
            setIdsResolvidos({
                projeto: data.projeto_id != null ? String(data.projeto_id) : null,
                composicao: data.composicao_id != null ? String(data.composicao_id) : null,
                grade: data.grade_id != null ? String(data.grade_id) : null,
            })
            setContagemPartes({
                total: data.partes_resumo.length,
                configuradas: data.partes_resumo.filter((parte) => parte.configurada).length,
            })

            const precisaProjeto = !projetoId && data.projeto_id != null
            const precisaComposicao = !composicaoId && data.composicao_id != null

            if (precisaProjeto || precisaComposicao) {
                setSearchParams(
                    montarParamsFluxo(
                        {
                            produto: produtoId,
                            projeto: projetoId,
                            composicao: composicaoId,
                            fluxo: '1',
                            etapa: String(etapaSolicitada),
                        },
                        {
                            projeto: precisaProjeto ? String(data.projeto_id) : projetoId,
                            composicao: precisaComposicao ? String(data.composicao_id) : composicaoId,
                        }
                    ),
                    { replace: true }
                )
            }
        }

        const carregarProgresso = async () => {
            if (!produtoId) {
                setProdutoResumo(null)
                setProjetoResumo(null)
                setProgressoApi(null)
                setIdsResolvidos({})
                setContagemPartes(null)
                return
            }

            const idNumerico = Number(produtoId)
            if (Number.isNaN(idNumerico)) {
                setProdutoResumo({ id: produtoId })
                return
            }

            setCarregandoProgresso(true)
            try {
                const service = new FluxoProducaoService()
                const data = await service.getProgresso({
                    produto: idNumerico,
                    projeto: projetoId,
                    composicao: composicaoId,
                })

                if (cancelado || !data) return
                aplicarProgresso(data)
            } catch (error) {
                console.error('Erro ao carregar progresso do fluxo:', error)
                if (!cancelado) {
                    // Fallback: checklist usa só o que estiver na query
                    setProdutoResumo({ id: idNumerico })
                    setProjetoResumo(null)
                    setProgressoApi(null)
                    setIdsResolvidos({})
                    setContagemPartes(null)
                }
            } finally {
                if (!cancelado) setCarregandoProgresso(false)
            }
        }

        carregarProgresso()
        return () => {
            cancelado = true
        }
    }, [produtoId, projetoId, composicaoId, etapaSolicitada, setSearchParams])

    const etapaAtual = etapas.find((etapa) => etapa.id === etapaAtiva) || etapas[0]
    const mostrarChecklist = Boolean(produtoId) || etapaAtiva === 2 || etapaAtiva === 3
    const proximaEtapaLiberada = etapaAtiva < 3 && etapaFluxoLiberada((etapaAtiva + 1) as EtapaFluxoId, progresso)

    const itensChecklist = useMemo(
        () => montarItensChecklistFluxo({
            produtoId,
            projetoId: projetoEfetivo,
            composicaoId: composicaoEfetiva,
            gradeId: gradeEfetiva,
            partesConfiguradas: progresso.partesOk,
            montagemCriada: progresso.montagemOk,
            totalPartes: contagemPartes?.total,
            partesConfiguradasCount: contagemPartes?.configuradas,
            etapaAtiva,
            produto: produtoResumo,
            projeto: projetoResumo,
        }),
        [
            produtoId,
            projetoEfetivo,
            composicaoEfetiva,
            gradeEfetiva,
            progresso.partesOk,
            progresso.montagemOk,
            contagemPartes,
            etapaAtiva,
            produtoResumo,
            projetoResumo,
        ]
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

                    {carregandoProgresso && produtoId && (
                        <div className="mb-3 text-muted small d-inline-flex align-items-center gap-2">
                            <Spinner size="sm" /> Carregando progresso…
                        </div>
                    )}

                    <Card className="border-0 shadow-sm">
                        <CardBody className="p-3 p-md-4">
                            <FluxoProducaoEtapaPainel
                                etapa={etapaAtual}
                                totalEtapas={etapas.length}
                                contexto={{
                                    ...contexto,
                                    projeto: projetoEfetivo,
                                    composicao: composicaoEfetiva,
                                }}
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
