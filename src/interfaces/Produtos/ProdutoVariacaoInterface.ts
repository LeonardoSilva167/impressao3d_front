export interface ProdutoVariacaoSyncModel {
    id_produto_base: number | string
    cores_primarias: number[]
    cores_secundarias?: number[]
    cores_terciarias?: number[]
}

export interface ProdutoVariacaoSyncResult {
    id_produto_base?: number
    total_combinacoes?: number
    criadas?: number
    reativadas?: number
    inativadas?: number
}

export type VariacaoPreviewStatus = 'NOVA' | 'ATIVA' | 'INATIVADA' | 'REATIVADA'

export interface VariacaoCombinacaoPreview {
    id?: number
    id_cor_primaria: number
    id_cor_secundaria: number | null
    id_cor_terciaria: number | null
    cor_primaria_descricao: string
    cor_secundaria_descricao: string | null
    cor_terciaria_descricao: string | null
    sku: string
    status: VariacaoPreviewStatus
}
