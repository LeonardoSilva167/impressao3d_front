/**
 * Contexto do fluxo guiado propagado via query string.
 * Usado pelo hub e pelas telas CRUD quando `fluxo=1`.
 */
export type FluxoProducaoQuery = {
    produto?: string | null
    projeto?: string | null
    composicao?: string | null
    fluxo?: string | null
    etapa?: string | null
}

export const lerContextoFluxo = (searchParams: URLSearchParams): FluxoProducaoQuery => ({
    produto: searchParams.get('produto'),
    projeto: searchParams.get('projeto'),
    composicao: searchParams.get('composicao'),
    fluxo: searchParams.get('fluxo'),
    etapa: searchParams.get('etapa'),
})

export const estaNoFluxoGuiado = (contexto: FluxoProducaoQuery): boolean => (
    contexto.fluxo === '1' || Boolean(contexto.produto)
)

export const montarParamsFluxo = (
    contexto: FluxoProducaoQuery,
    extras?: Partial<FluxoProducaoQuery>
): URLSearchParams => {
    const merged: FluxoProducaoQuery = { ...contexto, ...extras }
    const params = new URLSearchParams()

    if (merged.etapa) params.set('etapa', String(merged.etapa))
    if (merged.produto) params.set('produto', String(merged.produto))
    if (merged.projeto) params.set('projeto', String(merged.projeto))
    if (merged.composicao) params.set('composicao', String(merged.composicao))
    if (merged.fluxo) params.set('fluxo', String(merged.fluxo))

    return params
}

export const anexarContextoFluxo = (
    to: string,
    contexto: FluxoProducaoQuery,
    opcoes?: { forcarFluxo?: boolean }
): string => {
    const [pathname, query = ''] = to.split('?')
    const params = new URLSearchParams(query)

    if (contexto.produto) params.set('produto', String(contexto.produto))
    if (contexto.projeto) params.set('projeto', String(contexto.projeto))
    if (contexto.composicao) params.set('composicao', String(contexto.composicao))

    if (opcoes?.forcarFluxo) {
        params.set('fluxo', '1')
    } else if (contexto.fluxo) {
        params.set('fluxo', String(contexto.fluxo))
    }

    const queryString = params.toString()
    return queryString ? `${pathname}?${queryString}` : pathname
}
