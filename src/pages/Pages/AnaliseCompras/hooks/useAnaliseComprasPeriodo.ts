import {
    AnaliseComprasPeriodoPreset,
    AnaliseComprasSearch,
    AnaliseComprasApiResponse,
    AnaliseComprasResponse,
    AnaliseComprasResponseDefault,
    AnaliseComprasApiIndicadores,
} from 'interfaces/AnaliseCompras/AnaliseComprasInterface'

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const formatDate = (date: Date): string => date.toISOString().split('T')[0]

export const PERIODO_PRESET_OPTIONS: { value: AnaliseComprasPeriodoPreset; label: string }[] = [
    { value: 'hoje', label: 'Hoje' },
    { value: '7dias', label: '7 Dias' },
    { value: '30dias', label: '30 Dias' },
    { value: 'mes_atual', label: 'Mês Atual' },
    { value: 'ano_atual', label: 'Ano Atual' },
    { value: 'personalizado', label: 'Personalizado' },
]

export const calcularPeriodoPorPreset = (
    preset: AnaliseComprasPeriodoPreset,
    referencia: Date = new Date()
): { data_inicio: string; data_fim: string } => {
    const hoje = new Date(referencia)
    hoje.setHours(0, 0, 0, 0)

    switch (preset) {
        case 'hoje':
            return { data_inicio: formatDate(hoje), data_fim: formatDate(hoje) }
        case '7dias': {
            const inicio = new Date(hoje)
            inicio.setDate(hoje.getDate() - 6)
            return { data_inicio: formatDate(inicio), data_fim: formatDate(hoje) }
        }
        case '30dias': {
            const inicio = new Date(hoje)
            inicio.setDate(hoje.getDate() - 29)
            return { data_inicio: formatDate(inicio), data_fim: formatDate(hoje) }
        }
        case 'mes_atual': {
            const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
            return { data_inicio: formatDate(inicio), data_fim: formatDate(hoje) }
        }
        case 'ano_atual': {
            const inicio = new Date(hoje.getFullYear(), 0, 1)
            return { data_inicio: formatDate(inicio), data_fim: formatDate(hoje) }
        }
        default:
            return { data_inicio: formatDate(hoje), data_fim: formatDate(hoje) }
    }
}

export const buildDefaultAnaliseComprasFilters = (): AnaliseComprasSearch => {
    const periodo = calcularPeriodoPorPreset('30dias')

    return {
        ...periodo,
        periodo_preset: '30dias',
        id_plataforma_compra: [],
        id_categoria_item: [],
        id_item: [],
    }
}

const toNumber = (valor: number | string | undefined | null): number => {
    if (valor === undefined || valor === null || valor === '') return 0
    if (typeof valor === 'number') return valor

    if (String(valor).includes(',')) {
        const normalizado = String(valor).replace(/\./g, '').replace(',', '.')
        const numero = Number(normalizado)
        return Number.isNaN(numero) ? 0 : numero
    }

    const numero = Number(valor)
    return Number.isNaN(numero) ? 0 : numero
}

const mapIndicadores = (indicadores: AnaliseComprasApiIndicadores = {}) => ({
    total_compras: toNumber(indicadores.total_compras),
    total_fretes: toNumber(indicadores.total_frete || indicadores.total_fretes),
    total_impostos: toNumber(indicadores.total_impostos),
    total_taxas: toNumber(indicadores.total_taxas),
    total_descontos: toNumber(indicadores.total_descontos),
    total_investido: toNumber(indicadores.total_investido),
    valor_estoque_investido: toNumber(
        indicadores.valor_estoque_atual || indicadores.valor_estoque_investido
    ),
})

const calcularValorTotalItem = (
    valorComprado: number,
    item: {
        valor_total?: number | string | null
        valor_frete?: number | string | null
        valor_taxa?: number | string | null
        valor_imposto?: number | string | null
        valor_desconto?: number | string | null
    },
    resumo: ReturnType<typeof mapIndicadores>
): number => {
    if (item.valor_total !== undefined && item.valor_total !== null && item.valor_total !== '') {
        return toNumber(item.valor_total)
    }

    const frete = toNumber(item.valor_frete)
    const taxa = toNumber(item.valor_taxa)
    const imposto = toNumber(item.valor_imposto)
    const desconto = toNumber(item.valor_desconto)

    if (frete || taxa || imposto || desconto) {
        return valorComprado + frete + taxa + imposto - desconto
    }

    const totalCompras = resumo.total_compras
    if (totalCompras <= 0) return valorComprado

    const extras = resumo.total_fretes + resumo.total_impostos + resumo.total_taxas - resumo.total_descontos
    const proporcao = valorComprado / totalCompras

    return valorComprado + proporcao * extras
}

const formatarLabelMensal = (ano?: number, mes?: number): string => {
    if (!mes) return '—'
    const mesLabel = MESES_ABREV[mes - 1] || String(mes)
    return ano ? `${mesLabel}/${String(ano).slice(-2)}` : mesLabel
}

export const normalizarAnaliseComprasResponse = (
    apiResponse?: AnaliseComprasApiResponse | null
): AnaliseComprasResponse => {
    if (!apiResponse) return AnaliseComprasResponseDefault

    const apiPayload = apiResponse.data || {}
    const indicadores = apiPayload.indicadores || apiPayload.totais || {}
    const resumo = mapIndicadores(indicadores)

    return {
        possui_dados: !!apiResponse.possui_dados,
        resumo,
        grafico_mensal: (apiPayload.resumo_mensal || []).map((item) => ({
            label: formatarLabelMensal(item.ano, item.mes),
            valor: toNumber(item.valor_total),
        })),
        grafico_categoria: (apiPayload.resumo_por_categoria || []).map((item) => ({
            label: item.categoria || '—',
            valor: toNumber(item.valor_total),
        })),
        grafico_plataforma: (apiPayload.resumo_por_plataforma || []).map((item) => ({
            label: item.plataforma || '—',
            valor: toNumber(item.valor_total),
        })),
        tabela_itens: (apiPayload.resumo_por_item || []).map((item) => {
            const valor_comprado = toNumber(item.valor_total_comprado || item.valor_comprado)
            const quantidade_comprada = toNumber(item.quantidade_comprada)
            const valor_total = calcularValorTotalItem(valor_comprado, item, resumo)

            return {
                item: item.nome_item || '—',
                quantidade_comprada,
                valor_comprado,
                valor_total,
                custo_medio: quantidade_comprada > 0 ? valor_total / quantidade_comprada : 0,
            }
        }),
        ranking_itens: (apiPayload.ranking_itens || []).map((item) => {
            const valor_comprado = toNumber(item.valor_comprado)

            return {
                item: item.item || item.nome_item || '—',
                quantidade: toNumber(item.quantidade),
                valor_comprado,
                valor_total: calcularValorTotalItem(valor_comprado, item, resumo),
            }
        }),
    }
}

export const sanitizeAnaliseComprasFilters = (filters: AnaliseComprasSearch): Record<string, unknown> => {
    const sanitized: Record<string, unknown> = {
        data_inicio: filters.data_inicio || null,
        data_fim: filters.data_fim || null,
    }

    if (filters.id_plataforma_compra && filters.id_plataforma_compra.length > 0) {
        sanitized.id_plataforma_compra = filters.id_plataforma_compra.map(String)
    }

    if (filters.id_categoria_item && filters.id_categoria_item.length > 0) {
        sanitized.id_categoria_item = filters.id_categoria_item.map(String)
    }

    if (filters.id_item && filters.id_item.length > 0) {
        sanitized.id_item = filters.id_item.map(String)
    }

    return sanitized
}
