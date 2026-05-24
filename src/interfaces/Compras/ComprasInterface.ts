export interface ComprasSearch {
    id?: string | undefined | null
    compra_id?: string | undefined | null
    id_plataforma_compra?: string | undefined | null
    data_compra?: string | undefined | null
    numero_pedido?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface CompraItens {
    id?: number | null
    id_compra_item?: number | null
    id_item: number | null
    nome_item?: string | null
    tipo_item?: string | null
    gramatura?: number | null
    qtd_compra: number
    qtd_interna: number
    valor_unitario_compra: number | string | null
    valor_total: number | string | null
    valor_unitario_real: number | string | null
}

export interface ComprasView {
    id?: number | undefined
    id_plataforma_compra?: number
    plataforma_descricao?: string
    data_compra?: string
    numero_pedido?: string
    valor_frete?: number
    desconto?: number
    valor_taxa?: number
    valor_imposto?: number
    valor_total?: number
    observacao?: string
    compra_itens?: CompraItens[]
}

export interface ComprasList {
    id?: number | undefined
    id_plataforma_compra?: number
    plataforma_descricao?: string
    data_compra?: string
    numero_pedido?: string
    valor_frete?: number
    desconto?: number
    valor_taxa?: number
    valor_imposto?: number
    valor_total?: number
    observacao?: string
}

export interface ComprasModel {
    id?: string | undefined | null
    compra_id?: string | undefined | null
    id_plataforma_compra?: string | undefined | null
    data_compra?: string | undefined | null
    numero_pedido?: string | undefined | null
    valor_frete?: string | undefined | null
    desconto?: string | undefined | null
    valor_taxa?: string | undefined | null
    valor_imposto?: string | undefined | null
    valor_total?: string | undefined | null
    observacao?: string | undefined | null
    id_item?: string | undefined | null
    qtd_compra?: string | undefined | null
    qtd_interna?: string | undefined | null
    gramatura?: string | undefined | null
    valor_unitario_compra?: string | undefined | null
    compraItens?: CompraItens[]
}

export interface LookupsCompras {
}

export interface ComprasInterface {
    getViewCompras(params: any): Promise<ComprasView | undefined>
    listComprasPaginate(params: ComprasSearch): Promise<any>
    AsyncListCompras(params: ComprasSearch): Promise<ComprasModel[] | undefined>
    createCompras(params: ComprasModel): Promise<any>
    editCompras(params: ComprasModel): Promise<any>
    deleteCompras(id: number): Promise<any>
}

export const ComprasDefaultValues: ComprasModel = {
    id: null,
    compra_id: null,
    id_plataforma_compra: null,
    data_compra: null,
    numero_pedido: null,
    valor_frete: "0,00",
    desconto: "0,00",
    valor_taxa: "0,00",
    valor_imposto: "0,00",
    valor_total: null,
    observacao: null,
    id_item: null,
    qtd_compra: null,
    qtd_interna: null,
    gramatura: null,
    valor_unitario_compra: "0,00",
    compraItens: [],
}
