import React from 'react'
import { Link } from 'react-router-dom'
import {
    AcaoEtapaFluxo,
    EtapaFluxoConfig,
    EtapaFluxoId,
    FLUXO_PRODUCAO_ETAPAS,
    classeBotaoAcaoFluxo,
} from './fluxoProducaoConfig'
import { FluxoProducaoQuery, anexarContextoFluxo } from './fluxoProducaoContext'
import FluxoProducaoChecklist, { ItemChecklistFluxo } from './FluxoProducaoChecklist'

interface FluxoProducaoEtapaPainelProps {
    etapa: EtapaFluxoConfig
    totalEtapas: number
    contexto: FluxoProducaoQuery
    mostrarChecklist: boolean
    itensChecklist: ItemChecklistFluxo[]
    onEtapaAnterior: () => void
    onProximaEtapa: () => void
    onSelecionarEtapa: (etapa: EtapaFluxoId) => void
}

const hrefAcao = (acao: AcaoEtapaFluxo, contexto: FluxoProducaoQuery) => (
    anexarContextoFluxo(acao.to, contexto, { forcarFluxo: Boolean(acao.fluxoGuiado) })
)

const statusMacroEtapa = (
    etapaId: EtapaFluxoId,
    etapaAtiva: EtapaFluxoId,
    itensChecklist: ItemChecklistFluxo[]
): { label: string; classe: string } => {
    if (etapaId < etapaAtiva) {
        return { label: 'Concluído', classe: 'text-success' }
    }
    if (etapaId === etapaAtiva) {
        return { label: 'Em andamento', classe: 'text-primary' }
    }

    // Etapa 1 concluída se E1 marcado, mesmo navegando em etapa futura
    if (etapaId === 1 && itensChecklist.some((i) => i.codigo === 'E1_PRODUTO' && i.concluido)) {
        return { label: 'Concluído', classe: 'text-success' }
    }

    return { label: 'Pendente', classe: 'text-muted' }
}

const FluxoProducaoEtapaPainel = ({
    etapa,
    totalEtapas,
    contexto,
    mostrarChecklist,
    itensChecklist,
    onEtapaAnterior,
    onProximaEtapa,
    onSelecionarEtapa,
}: FluxoProducaoEtapaPainelProps) => {
    const etapaId = etapa.id as EtapaFluxoId
    const temAcaoNoChecklist = itensChecklist.some((item) => item.atual && item.acoes && item.acoes.length > 0)
    const mostrarCtaAvulso = !mostrarChecklist || !temAcaoNoChecklist
    const acaoPrimaria = etapa.acoes.find((acao) => acao.nivel === 'primary') || etapa.acoes[0]
    const acoesSecundarias = etapa.acoes.filter((acao) => acao !== acaoPrimaria)

    return (
        <div className="d-flex gap-3 gap-lg-4">
            {/* Rail vertical — etapas macro */}
            <div
                className="d-none d-md-flex flex-column flex-shrink-0"
                style={{ width: 168 }}
                aria-label="Etapas do fluxo"
            >
                {FLUXO_PRODUCAO_ETAPAS.map((macro, index) => {
                    const numero = macro.id as EtapaFluxoId
                    const ativo = numero === etapaId
                    const status = statusMacroEtapa(numero, etapaId, itensChecklist)
                    const concluidoVisual = status.label === 'Concluído'

                    return (
                        <React.Fragment key={macro.id}>
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none text-start p-0 d-flex gap-2 align-items-start"
                                onClick={() => onSelecionarEtapa(numero)}
                            >
                                <div className="d-flex flex-column align-items-center flex-shrink-0">
                                    <div
                                        className={[
                                            'rounded-circle d-flex align-items-center justify-content-center fw-semibold',
                                            ativo || concluidoVisual
                                                ? 'bg-primary text-white'
                                                : 'bg-light text-muted border',
                                        ].join(' ')}
                                        style={{ width: 32, height: 32, fontSize: '0.85rem' }}
                                    >
                                        {concluidoVisual && !ativo ? (
                                            <i className="ri-check-line" aria-hidden />
                                        ) : (
                                            numero
                                        )}
                                    </div>
                                </div>
                                <div className="min-w-0 pt-1">
                                    <div className={`small fw-semibold lh-sm ${ativo ? 'text-primary' : 'text-body'}`}>
                                        {macro.tituloCurto}
                                    </div>
                                    <div className={`small ${status.classe}`}>{status.label}</div>
                                </div>
                            </button>

                            {index < FLUXO_PRODUCAO_ETAPAS.length - 1 && (
                                <div
                                    className="ms-3 my-1"
                                    style={{
                                        width: 2,
                                        height: 28,
                                        backgroundColor: numero < etapaId || status.label === 'Concluído'
                                            ? 'var(--vz-primary, #405189)'
                                            : 'var(--vz-border-color, #e9ebec)',
                                    }}
                                    aria-hidden
                                />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>

            <div className="flex-grow-1 min-w-0">
                <div
                    className="badge bg-primary-subtle text-primary text-uppercase mb-2"
                    style={{ letterSpacing: '0.04em' }}
                >
                    Passo {etapa.id} de {totalEtapas}
                </div>
                <h4 className="mb-2">{etapa.titulo}</h4>
                <p className="text-muted mb-4">{etapa.resumo}</p>

                {mostrarChecklist && (
                    <FluxoProducaoChecklist itens={itensChecklist} contexto={contexto} />
                )}

                {mostrarCtaAvulso && acaoPrimaria && (
                    <div
                        className="rounded-3 border border-primary-subtle p-3 p-md-4 mb-3"
                        style={{
                            backgroundColor: 'var(--vz-primary-bg-subtle, rgba(64, 81, 137, 0.08))',
                        }}
                    >
                        <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-white text-primary border border-primary-subtle"
                                style={{ width: 48, height: 48 }}
                            >
                                <i className={`${etapa.ctaIcone || 'ri-flag-line'} fs-4`} aria-hidden />
                            </div>

                            <div className="flex-grow-1 min-w-0">
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                    <h5 className="mb-0 text-primary">
                                        {etapa.ctaTitulo || 'Comece por aqui!'}
                                    </h5>
                                    <span className="badge bg-primary">Próximo passo</span>
                                </div>
                                <p className="mb-0 text-muted small">{etapa.ctaDescricao}</p>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-3">
                            <Link
                                to={hrefAcao(acaoPrimaria, contexto)}
                                className="btn btn-primary d-inline-flex align-items-center gap-1"
                            >
                                {acaoPrimaria.icone && (
                                    <i className={acaoPrimaria.icone} aria-hidden />
                                )}
                                {acaoPrimaria.label}
                            </Link>
                            {acoesSecundarias.map((acao) => (
                                <Link
                                    key={acao.to + acao.label}
                                    to={hrefAcao(acao, contexto)}
                                    className={`btn ${classeBotaoAcaoFluxo(acao.nivel || 'tertiary')} d-inline-flex align-items-center gap-1`}
                                >
                                    {acao.icone && <i className={acao.icone} aria-hidden />}
                                    {acao.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {etapa.detalhes.length > 0 && !mostrarChecklist && (
                    <div
                        className="rounded-3 border p-3 p-md-4 mb-4"
                        style={{
                            backgroundColor: 'rgba(10, 179, 156, 0.08)',
                            borderColor: 'rgba(10, 179, 156, 0.25)',
                        }}
                    >
                        <div className="d-flex gap-3">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-success bg-white border"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderColor: 'rgba(10, 179, 156, 0.35)',
                                }}
                            >
                                <i className="ri-lightbulb-flash-line fs-5" aria-hidden />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-success mb-2">Importante</h6>
                                <ul className="list-unstyled mb-0">
                                    {etapa.detalhes.map((detalhe, index) => (
                                        <li
                                            key={detalhe}
                                            className={`d-flex gap-2 ${index < etapa.detalhes.length - 1 ? 'mb-2' : ''}`}
                                        >
                                            <i className="ri-checkbox-circle-fill text-success mt-1 flex-shrink-0" aria-hidden />
                                            <span className="text-muted">{detalhe}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 mt-2 border-top"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <button
                        type="button"
                        className="btn btn-light border"
                        disabled={etapaId === 1}
                        onClick={onEtapaAnterior}
                    >
                        <i className="ri-arrow-left-line me-1" aria-hidden />
                        Etapa anterior
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={etapaId === totalEtapas}
                        onClick={onProximaEtapa}
                    >
                        Próxima etapa
                        <i className="ri-arrow-right-line ms-1" aria-hidden />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FluxoProducaoEtapaPainel
