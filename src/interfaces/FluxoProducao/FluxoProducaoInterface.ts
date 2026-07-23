export type SubpassoFluxoCodigoApi =
    | 'E1_PRODUTO'
    | 'E2_PROJETO'
    | 'E2_VINCULO'
    | 'E2_PARTES'
    | 'E3_MONTAGEM'

export interface FluxoProducaoParteResumo {
    id: number
    id_projeto_impressao_parte: number
    nome_parte: string
    quantidade_itens: number
    cores_configuradas: boolean
    variacoes_geradas: boolean
    quantidade_variacoes: number
    total_variacoes: number
    variacoes_com_filamento: number
    configurada: boolean
}

export interface FluxoProducaoProgresso {
    produto_id: number
    projeto_id: number | null
    composicao_id: number | null
    grade_id: number | null
    produto: {
        id: number
        descricao_produto: string | null
        sku_base: string | null
        codigo_base: string | null
    }
    projeto: {
        id: number
        nome_original_projeto: string | null
        codigo_projeto: string | null
    } | null
    partes_resumo: FluxoProducaoParteResumo[]
    subpassos: Record<SubpassoFluxoCodigoApi, boolean>
    proximo_subpasso: SubpassoFluxoCodigoApi | null
}

export interface FluxoProducaoProgressoParams {
    produto: number | string
    projeto?: number | string | null
    composicao?: number | string | null
}
