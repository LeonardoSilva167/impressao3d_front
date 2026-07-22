import React, { useEffect, useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import {
    FLUXO_PRODUCAO_ETAPAS,
    EtapaFluxoId,
    inferirEtapaPorRota,
    isRotaFluxoProducao,
    montarHrefEtapaFluxo,
    obterContextoRotaFluxo,
} from './fluxoProducaoConfig'

const HEADER_HEIGHT_PX = 70
const STYLE_ID = 'fluxo-producao-stepper-offset'

const limparOffsetStepper = () => {
    document.body.classList.remove('fluxo-stepper-visible')
    const styleEl = document.getElementById(STYLE_ID)
    if (styleEl) styleEl.textContent = ''
}

const aplicarOffsetStepper = (altura: number) => {
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = STYLE_ID
        document.head.appendChild(styleEl)
    }

    styleEl.textContent = `
        body.fluxo-stepper-visible .page-content {
            padding-top: calc(${HEADER_HEIGHT_PX}px + ${altura}px + 1rem) !important;
        }
        .fluxo-producao-stepper {
            left: 0;
        }
        @media (min-width: 768px) {
            .fluxo-producao-stepper {
                left: var(--vz-vertical-menu-width, 250px);
            }
        }
    `
}

const FluxoProducaoStepper = () => {
    const { pathname } = useLocation()
    const [searchParams] = useSearchParams()
    const barRef = useRef<HTMLDivElement | null>(null)
    const visivel = isRotaFluxoProducao(pathname)

    useEffect(() => {
        if (!visivel) {
            limparOffsetStepper()
            return limparOffsetStepper
        }

        document.body.classList.add('fluxo-stepper-visible')
        aplicarOffsetStepper(barRef.current ? barRef.current.offsetHeight : 96)

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return
            aplicarOffsetStepper(Math.ceil(entry.contentRect.height))
        })

        if (barRef.current) {
            observer.observe(barRef.current)
        }

        return () => {
            observer.disconnect()
            limparOffsetStepper()
        }
    }, [visivel])

    if (!visivel) {
        return null
    }

    const etapaQuery = Number(searchParams.get('etapa'))
    const produtoId = searchParams.get('produto')
    const etapaAtiva = inferirEtapaPorRota(
        pathname,
        Number.isNaN(etapaQuery) ? null : etapaQuery
    )
    const contexto = obterContextoRotaFluxo(pathname)
    const noHub = pathname === '/fluxo-producao' || pathname.startsWith('/fluxo-producao/')

    return (
        <div
            ref={barRef}
            className="fluxo-producao-stepper border-bottom shadow-sm"
            style={{
                position: 'fixed',
                top: HEADER_HEIGHT_PX,
                right: 0,
                zIndex: 1001,
                backgroundColor: 'var(--vz-secondary-bg, var(--vz-body-bg, #fff))',
            }}
        >
            <div className="px-3 px-lg-4 py-2">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <Link
                            to={montarHrefEtapaFluxo(etapaAtiva, produtoId)}
                            className="fw-semibold text-decoration-none"
                        >
                            {DominioProducaoLabels.fluxoProducao}
                        </Link>
                        {!noHub && (
                            <span className="text-muted small">
                                · Você está em: <strong>{contexto}</strong>
                            </span>
                        )}
                    </div>
                    {!noHub && (
                        <Link
                            to={montarHrefEtapaFluxo(etapaAtiva, produtoId)}
                            className="btn btn-sm btn-soft-primary"
                        >
                            <i className="ri-arrow-go-back-line me-1"></i>
                            Voltar à etapa {etapaAtiva}
                        </Link>
                    )}
                </div>

                <div className="d-flex flex-wrap gap-2">
                    {FLUXO_PRODUCAO_ETAPAS.map((etapa, index) => {
                        const ativa = etapa.id === etapaAtiva
                        const href = montarHrefEtapaFluxo(etapa.id as EtapaFluxoId, produtoId)

                        return (
                            <React.Fragment key={etapa.id}>
                                {index > 0 && (
                                    <div
                                        className="d-none d-md-flex align-items-center text-muted px-1"
                                        aria-hidden
                                    >
                                        <i className="ri-arrow-right-s-line"></i>
                                    </div>
                                )}
                                <Link
                                    to={href}
                                    className={[
                                        'btn btn-sm flex-grow-1 flex-md-grow-0 text-start',
                                        ativa ? 'btn-primary' : 'btn-soft-secondary',
                                    ].join(' ')}
                                    style={{ minWidth: '160px' }}
                                >
                                    <span className="d-block small opacity-75">Etapa {etapa.id}</span>
                                    <span className="fw-semibold">{etapa.tituloCurto}</span>
                                </Link>
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default FluxoProducaoStepper
