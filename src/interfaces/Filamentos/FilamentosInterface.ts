export interface FilamentosSearch {
    id?: string | undefined | null
    id_cor?: string | number | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface FilamentoCorView {
    id?: number
    descricao?: string | null
    hexadecimal?: string | null
}

export interface FilamentosView {
    id?: number | undefined
    id_item?: number | undefined
    codigo?: string
    resumo?: string
    qtd?: number
    preco_medio_grama?: number
    preco_medio_por_grama?: number
    estoque_atual?: number | null
    preco_medio_atual?: number | null
    cor?: FilamentoCorView | null
}

export interface FilamentosList {
    id?: number | undefined
    codigo?: string
    resumo?: string
    qtd?: number
    preco_medio_grama?: number
    estoque_atual?: number | null
    preco_medio_atual?: number | null
}

export interface FilamentosModel {
    id?: string | undefined | null
    id_tipo_material: string | undefined | null
    id_cor: string | undefined | null
    id_linha_marca: string | undefined | null
    id_marca: string | undefined | null
    codigo: string | undefined | null
    resumo: string | undefined | null
    qtd: string | undefined | null
    preco_medio_grama: string | undefined | null
    estoque_atual: string | undefined | null
    preco_medio_atual: string | undefined | null
}

export interface FilamentosInterface {
    getViewFilamentos(params: { id: string | number | null | undefined }): Promise<FilamentosView | undefined>
    listFilamentosPaginate(params: FilamentosSearch): Promise<any>
    AsyncListFilamentos(params: FilamentosSearch): Promise<FilamentosModel[] | undefined>
    createFilamentos(params: FilamentosModel): Promise<any>
    editFilamentos(params: FilamentosModel): Promise<any>
    deleteFilamentos(id: number): Promise<any>
}

export const FilamentosDefaultValues: FilamentosModel = {
    id: null,
    id_tipo_material: null,
    id_cor: null,
    id_linha_marca: null,
    id_marca: null,
    codigo: null,
    resumo: null,
    qtd: null,
    preco_medio_grama: null,
    estoque_atual: null,
    preco_medio_atual: null,
}
