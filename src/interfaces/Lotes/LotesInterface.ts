export interface LotesSearch {
    id?: string | undefined | null
    lote_id?: string | undefined | null
    id_item?: string | undefined | null
    status?: 'ativo' | 'zerado' | null
    palavra_chave?: string | null | undefined | unknown
}

export interface LotesView {
    id?: number | undefined
    id_item?: number
    item_descricao?: string
    qtd_original?: number
    qtd_atual?: number
    custo_lote?: number
    data_compra?: string
    numero_pedido?: string
    ativo?: boolean
}

export interface LotesList {
    id?: number | undefined
    id_item?: number
    item_descricao?: string
    qtd_original?: number
    qtd_atual?: number
    custo_lote?: number
    data_compra?: string
    numero_pedido?: string
    ativo?: boolean
}

export interface LotesModel {
    id?: string | undefined | null
    lote_id?: string | undefined | null
}

export interface LotesInterface {
    getViewLotes(params: any): Promise<LotesView | undefined>
    listLotesPaginate(params: LotesSearch): Promise<any>
    listLotesAtivosPaginate(params: LotesSearch): Promise<any>
    listLotesZeradosPaginate(params: LotesSearch): Promise<any>
}

export const LotesDefaultValues: LotesModel = {
    id: null,
    lote_id: null,
}
