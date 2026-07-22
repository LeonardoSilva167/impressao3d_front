import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
    Alert,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Col,
    Container,
    Row,
} from 'reactstrap'
import { setActiveMenu } from 'helpers/system_helpers'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import UiContent from 'Components/Common/UiContent'
import {
    EtapaFluxoId,
    FLUXO_PRODUCAO_ETAPAS,
    inferirEtapaPorRota,
    montarHrefAcaoFluxo,
} from './fluxoProducaoConfig'

const FluxoProducaoPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const produtoId = searchParams.get('produto')
    const etapaParam = Number(searchParams.get('etapa'))
    const [etapaAtiva, setEtapaAtiva] = useState<EtapaFluxoId>(
        inferirEtapaPorRota('/fluxo-producao', Number.isNaN(etapaParam) ? null : etapaParam)
    )

    const etapas = useMemo(() => FLUXO_PRODUCAO_ETAPAS, [])

    const selecionarEtapa = (etapa: EtapaFluxoId) => {
        setEtapaAtiva(etapa)
        const next = new URLSearchParams(searchParams)
        next.set('etapa', String(etapa))
        setSearchParams(next, { replace: true })
    }

    useEffect(() => {
        setActiveMenu('/fluxo-producao')
    }, [])

    useEffect(() => {
        setEtapaAtiva(
            inferirEtapaPorRota('/fluxo-producao', Number.isNaN(etapaParam) ? null : etapaParam)
        )
    }, [etapaParam])

    const etapaAtual = etapas.find((etapa) => etapa.id === etapaAtiva) || etapas[0]

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

                    <Alert color="info" className="mb-4">
                        Use a barra de etapas no topo para navegar entre os passos a qualquer momento —
                        mesmo enquanto cadastra partes, itens ou filamentos.
                    </Alert>

                    {produtoId && (
                        <Alert color="success" className="mb-4">
                            Produto <strong>#{produtoId}</strong> cadastrado.
                            Continue pela etapa 2 para vincular o projeto de impressão.
                            {' '}
                            <Link to={`/produtos/view/${produtoId}`}>Abrir produto</Link>
                        </Alert>
                    )}

                    <Row className="g-3 mb-4">
                        {etapas.map((etapa) => {
                            const ativa = etapa.id === etapaAtiva
                            return (
                                <Col md={4} key={etapa.id}>
                                    <Card
                                        className={`h-100 border ${ativa ? 'border-primary' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => selecionarEtapa(etapa.id)}
                                    >
                                        <CardBody>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <h5 className="mb-0">{etapa.titulo}</h5>
                                                {ativa && (
                                                    <span className="badge bg-primary">Atual</span>
                                                )}
                                            </div>
                                            <p className="text-muted mb-0 small">{etapa.resumo}</p>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>

                    <Card>
                        <CardBody>
                            <h5 className="mb-3">{etapaAtual.titulo}</h5>
                            <p className="text-muted">{etapaAtual.resumo}</p>
                            <ul className="mb-4">
                                {etapaAtual.detalhes.map((detalhe) => (
                                    <li key={detalhe}>{detalhe}</li>
                                ))}
                            </ul>

                            <div className="d-flex flex-wrap gap-2">
                                {etapaAtual.acoes.map((acao) => (
                                    <Link
                                        key={acao.to + acao.label}
                                        to={montarHrefAcaoFluxo(acao.to, produtoId)}
                                        className={`btn ${acao.primary ? 'btn-primary' : 'btn-soft-primary'}`}
                                    >
                                        {acao.label}
                                    </Link>
                                ))}
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-soft-secondary"
                                    disabled={etapaAtiva === 1}
                                    onClick={() => selecionarEtapa((etapaAtiva - 1) as EtapaFluxoId)}
                                >
                                    Etapa anterior
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-soft-secondary"
                                    disabled={etapaAtiva === 3}
                                    onClick={() => selecionarEtapa((etapaAtiva + 1) as EtapaFluxoId)}
                                >
                                    Próxima etapa
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default FluxoProducaoPage
