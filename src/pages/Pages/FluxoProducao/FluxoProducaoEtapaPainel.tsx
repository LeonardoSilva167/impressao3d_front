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
    const e1Ok = itensChecklist.some((i) => i.codigo === 'E1_PRODUTO' && i.concluido)
    const e2Ok = itensChecklist.some((i) => i.codigo === 'E2_VINCULO' && i.concluido)
        && itensChecklist.some((i) => i.codigo === 'E2_PARTES' && i.concluido)
    const e3Ok = itensChecklist.some((i) => i.codigo === 'E3_MONTAGEM' && i.concluido)

    if (etapaId === 1 && e1Ok) return { label: 'Concluído', classe: 'text-success' }
    if (etapaId === 2 && e2Ok) return { label: 'Concluído', classe: 'text-success' }
    if (etapaId === 3 && e3Ok) return { label: 'Concluído', classe: 'text-success' }

    if (etapaId === etapaAtiva) {
        return { label: 'Em andamento', classe: 'text-primary' }
    }

    if (etapaId < etapaAtiva) {
        // Ex.: etapa 1 atrás na navegação, mas produto já existe
        if (etapaId === 1 && e1Ok) return { label: 'Concluído', classe: 'text-success' }
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
    const acoesSecundarias = etapa.acoes.filter((acao) => acao !== acaoPrimaria && acao.nivel !== 'tertiary')
    const acoesTerciarias = etapa.acoes.filter((acao) => acao.nivel === 'tertiary')

    // Dicas do "Importante" focadas no próximo passo atual
    const detalhesImportante = (() => {
        const atual = itensChecklist.find((i) => i.atual && !i.concluido)
        if (atual?.codigo === 'E2_PROJETO') {
            return [
                'O projeto define o arquivo 3D e os dados do fatiador (partes, pesos e tempos).',
                'Depois você cria o vínculo com o produto e configura cores/filamento.',
            ]
        }
        if (atual?.codigo === 'E2_VINCULO') {
            return [
                `O ${DominioProducaoLabels.vinculo.toLowerCase()} liga o produto ao projeto.`,
                'Em seguida configure cores e filamento em cada parte.',
            ]
        }
        if (atual?.codigo === 'E2_PARTES') {
            return [
                'Configure cores, variações e filamento de cada parte.',
                'Com as partes prontas, avance para a montagem.',
            ]
        }
        if (atual?.codigo === 'E3_MONTAGEM') {
            return etapa.detalhes
        }
        return etapa.detalhes
    })()

    return (
        <div className="d-flex gap-3 gap-lg-4">
            {/* Rail vertical — etapas macro */}
            <div
                className="d-none d-md-flex flex-column flex-shrink-0 pe-2"
                style={{ width: 160 }}
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
                                            ativo
                                                ? 'bg-primary text-white'
                                                : concluidoVisual
                                                    ? 'bg-success text-white'
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
                                        height: 36,
                                        backgroundColor: concluidoVisual || numero < etapaId
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
                    className="text-primary text-uppercase fw-semibold small mb-2"
                    style={{ letterSpacing: '0.06em' }}
                >
                    Passo {etapa.id} de {totalEtapas}
                </div>
                <h4 className="mb-2 text-primary">{etapa.titulo}</h4>
                <p className="text-muted mb-4">{etapa.resumo}</p>

                {mostrarChecklist ? (
                    <FluxoProducaoChecklist
                        itens={itensChecklist}
                        contexto={contexto}
                        detalhesImportante={detalhesImportante}
                    />
                ) : (
                    <>
                        {mostrarCtaAvulso && acaoPrimaria && (
                            <div
                                className="rounded-3 p-3 p-md-4 mb-3"
                                style={{
                                    backgroundColor: 'var(--vz-primary-bg-subtle, rgba(64, 81, 137, 0.07))',
                                    border: '1px solid var(--vz-primary, #405189)',
                                }}
                            >
                                <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                                    <div className="d-flex gap-3 flex-grow-1 min-w-0">
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-white text-primary border border-primary-subtle"
                                            style={{ width: 44, height: 44 }}
                                        >
                                            <i className={`${etapa.ctaIcone || 'ri-flag-line'} fs-4`} aria-hidden />
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="mb-1 text-primary">
                                                {etapa.ctaTitulo || 'Comece por aqui!'}
                                            </h5>
                                            <p className="mb-0 text-muted small">{etapa.ctaDescricao}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column gap-2 flex-shrink-0" style={{ minWidth: 200 }}>
                                        <Link
                                            to={hrefAcao(acaoPrimaria, contexto)}
                                            className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-1"
                                        >
                                            {acaoPrimaria.icone && <i className={acaoPrimaria.icone} aria-hidden />}
                                            {acaoPrimaria.label}
                                        </Link>
                                        {acoesSecundarias.map((acao) => (
                                            <Link
                                                key={acao.to + acao.label}
                                                to={hrefAcao(acao, contexto)}
                                                className={`btn d-inline-flex align-items-center justify-content-center gap-1 ${classeBotaoAcaoFluxo(acao.nivel || 'secondary')}`}
                                            >
                                                {acao.icone && <i className={acao.icone} aria-hidden />}
                                                {acao.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                {acoesTerciarias.length > 0 && (
                                    <div className="mt-3 pt-3 border-top border-primary-subtle">
                                        {acoesTerciarias.map((acao) => (
                                            <Link
                                                key={acao.to + acao.label}
                                                to={hrefAcao(acao, contexto)}
                                                className="btn btn-sm btn-soft-secondary"
                                            >
                                                {acao.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {etapa.detalhes.length > 0 && (
                            <div
                                className="rounded-3 p-3 p-md-4 mb-4"
                                style={{
                                    backgroundColor: 'rgba(10, 179, 156, 0.08)',
                                    border: '1px solid rgba(10, 179, 156, 0.28)',
                                }}
                            >
                                <div className="d-flex gap-3">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-success bg-white"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            border: '1px solid rgba(10, 179, 156, 0.35)',
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
                    </>
                )}

                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 mt-1 border-top">
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
