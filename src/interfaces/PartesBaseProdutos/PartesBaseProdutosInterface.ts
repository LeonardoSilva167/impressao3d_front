export interface PartesBaseProdutosSearch {
    id?: string | undefined | null
    codigo?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface PartesBaseProdutosView {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface PartesBaseProdutosList {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface PartesBaseProdutosModel {
    id?: string | undefined | null
    codigo: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsPartesBaseProdutos {
}

export interface PartesBaseProdutosInterface {
    getViewPartesBaseProdutos(params: any): Promise<PartesBaseProdutosView | undefined>
    listPartesBaseProdutosPaginate(params: PartesBaseProdutosSearch): Promise<any>
    AsyncListPartesBaseProdutos(params: PartesBaseProdutosSearch): Promise<PartesBaseProdutosModel[] | undefined>
    createPartesBaseProdutos(params: PartesBaseProdutosModel): Promise<number | undefined>
    editPartesBaseProdutos(params: PartesBaseProdutosModel): Promise<any>
    deletePartesBaseProdutos(id: number): Promise<any>
}

export const PartesBaseProdutosDefaultValues: PartesBaseProdutosModel = {
    id: null,
    codigo: null,
    descricao: null,
}
