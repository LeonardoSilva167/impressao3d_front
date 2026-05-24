export type LoteStatus = 'ATIVO' | 'ZERADO'

export type MotivoConsumo =
    | 'TESTE'
    | 'ERRO_IMPRESSAO'
    | 'DESCARTE'
    | 'USO_INTERNO'
    | 'PRODUCAO'

export interface LotesSearch {
    id?: string | undefined | null
    lote_id?: string | undefined | null
    id_item?: string | undefined | null
    id_filamento?: string | undefined | null
    data_compra?: string | undefined | null
    status?: LoteStatus | '' | null
    palavra_chave?: string | null | undefined | unknown
}

export interface LotesView {
    id?: number
    id_compra?: number
    id_compra_item?: number
    id_item?: number
    item_descricao?: string
    compra_descricao?: string
    data_compra?: string
    qtd_original?: number
    qtd_atual?: number
    percentual_utilizado?: number
    valor_unitario?: number
    valor_total?: number
    status?: LoteStatus
}

export interface LotesList {
    id?: number
    id_compra?: number
    id_compra_item?: number
    id_item?: number
    item_descricao?: string
    compra_descricao?: string
    data_compra?: string
    qtd_original?: number
    qtd_atual?: number
    percentual_utilizado?: number
    valor_unitario?: number
    valor_total?: number
    status?: LoteStatus
}

export interface FinalizarCarretelModel {
    id_filamento: string | null
    gramatura: string | null
}

export interface RegistrarConsumoModel {
    id_item: string | null
    quantidade: string | null
    motivo: MotivoConsumo | null
}

export interface EstoqueInterface {
    getViewLote(params: { id: number }): Promise<LotesView | undefined>
    listLotesPaginate(params: LotesSearch): Promise<any>
    finalizarCarretel(params: FinalizarCarretelModel): Promise<any>
    registrarConsumo(params: RegistrarConsumoModel): Promise<any>
}

export const FinalizarCarretelDefaultValues: FinalizarCarretelModel = {
    id_filamento: null,
    gramatura: null,
}

export const RegistrarConsumoDefaultValues: RegistrarConsumoModel = {
    id_item: null,
    quantidade: null,
    motivo: null,
}

export const MOTIVO_CONSUMO_OPTIONS = [
    { value: 'TESTE', label: 'Teste' },
    { value: 'ERRO_IMPRESSAO', label: 'Erro de Impressão' },
    { value: 'DESCARTE', label: 'Descarte' },
    { value: 'USO_INTERNO', label: 'Uso Interno' },
    { value: 'PRODUCAO', label: 'Produção' },
]

export const GRAMATURA_CARRETEL_OPTIONS = [
    { value: '500', label: '500g' },
    { value: '1000', label: '1000g' },
]

export const LOTE_STATUS_OPTIONS = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'ZERADO', label: 'Zerado' },
    { value: '', label: 'Todos' },
]
