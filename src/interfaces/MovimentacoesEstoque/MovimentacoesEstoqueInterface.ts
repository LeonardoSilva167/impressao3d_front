export interface MovimentacoesEstoqueSearch {
    id?: string | undefined | null
    movimentacao_id?: string | undefined | null
    id_item?: string | undefined | null
    id_lote?: string | undefined | null
    tipo_movimentacao?: string | undefined | null
    data_inicio?: string | undefined | null
    data_fim?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface MovimentacoesEstoqueView {
    id?: number | undefined
    id_item?: number
    item_descricao?: string
    id_lote?: number
    tipo_movimentacao?: string
    quantidade?: number
    saldo_anterior?: number
    saldo_posterior?: number
    data_movimentacao?: string
    observacao?: string
}

export interface MovimentacoesEstoqueList {
    id?: number | undefined
    id_item?: number
    item_descricao?: string
    id_lote?: number
    tipo_movimentacao?: string
    quantidade?: number
    saldo_anterior?: number
    saldo_posterior?: number
    data_movimentacao?: string
    observacao?: string
}

export interface MovimentacoesEstoqueModel {
    id?: string | undefined | null
    movimentacao_id?: string | undefined | null
}

export interface MovimentacoesEstoqueInterface {
    getViewMovimentacoesEstoque(params: any): Promise<MovimentacoesEstoqueView | undefined>
    listMovimentacoesEstoquePaginate(params: MovimentacoesEstoqueSearch): Promise<any>
}

export const MovimentacoesEstoqueDefaultValues: MovimentacoesEstoqueModel = {
    id: null,
    movimentacao_id: null,
}
