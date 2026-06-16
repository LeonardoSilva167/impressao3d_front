export type AnaliseComprasPeriodoPreset =
    | 'hoje'
    | '7dias'
    | '30dias'
    | 'mes_atual'
    | 'ano_atual'
    | 'personalizado'

export interface AnaliseComprasSearch {
    data_inicio?: string | null
    data_fim?: string | null
    id_plataforma_compra?: (string | number)[] | null
    id_categoria_item?: (string | number)[] | null
    id_item?: (string | number)[] | null
    periodo_preset?: AnaliseComprasPeriodoPreset | null
}

export interface AnaliseComprasResumo {
    total_compras?: number
    total_fretes?: number
    total_impostos?: number
    total_taxas?: number
    total_descontos?: number
    total_investido?: number
    valor_estoque_investido?: number
}

export interface AnaliseComprasGraficoItem {
    label?: string
    valor?: number
}

export interface AnaliseComprasItemTabela {
    item?: string
    quantidade_comprada?: number
    valor_comprado?: number
    valor_total?: number
    custo_medio?: number
}

export interface AnaliseComprasRankingItem {
    item?: string
    quantidade?: number
    valor_comprado?: number
    valor_total?: number
}

export interface AnaliseComprasResponse {
    possui_dados?: boolean
    resumo?: AnaliseComprasResumo
    grafico_mensal?: AnaliseComprasGraficoItem[]
    grafico_categoria?: AnaliseComprasGraficoItem[]
    grafico_plataforma?: AnaliseComprasGraficoItem[]
    tabela_itens?: AnaliseComprasItemTabela[]
    ranking_itens?: AnaliseComprasRankingItem[]
}

export interface AnaliseComprasApiIndicadores {
    total_compras?: number | string
    total_frete?: number | string
    total_fretes?: number | string
    total_impostos?: number | string
    total_taxas?: number | string
    total_descontos?: number | string
    total_investido?: number | string
    valor_estoque_atual?: number | string
    valor_estoque_investido?: number | string
}

export interface AnaliseComprasApiPayload {
    indicadores?: AnaliseComprasApiIndicadores
    totais?: AnaliseComprasApiIndicadores
    resumo_por_item?: {
        id_item?: number
        nome_item?: string
        quantidade_comprada?: number | string
        valor_total_comprado?: number | string
        valor_comprado?: number | string
        valor_total?: number | string
        valor_frete?: number | string
        valor_taxa?: number | string
        valor_imposto?: number | string
        valor_desconto?: number | string
        custo_medio?: number | string
    }[]
    resumo_por_categoria?: {
        categoria?: string
        valor_total?: number | string
    }[]
    resumo_por_plataforma?: {
        plataforma?: string
        valor_total?: number | string
    }[]
    resumo_mensal?: {
        ano?: number
        mes?: number
        valor_total?: number | string
    }[]
    ranking_itens?: {
        id_item?: number
        item?: string
        nome_item?: string
        quantidade?: number | string
        valor_comprado?: number | string
        valor_total?: number | string
        valor_frete?: number | string
        valor_taxa?: number | string
        valor_imposto?: number | string
        valor_desconto?: number | string
    }[]
}

export interface AnaliseComprasApiResponse {
    status?: boolean
    possui_dados?: boolean
    message?: string
    data?: AnaliseComprasApiPayload
}

export interface AnaliseComprasInterface {
    getAnaliseCompras(params: AnaliseComprasSearch): Promise<AnaliseComprasResponse | undefined>
}

export const AnaliseComprasResumoDefault: AnaliseComprasResumo = {
    total_compras: 0,
    total_fretes: 0,
    total_impostos: 0,
    total_taxas: 0,
    total_descontos: 0,
    total_investido: 0,
    valor_estoque_investido: 0,
}

export const AnaliseComprasResponseDefault: AnaliseComprasResponse = {
    possui_dados: false,
    resumo: AnaliseComprasResumoDefault,
    grafico_mensal: [],
    grafico_categoria: [],
    grafico_plataforma: [],
    tabela_itens: [],
    ranking_itens: [],
}
