export interface CategoriasProdutosSearch {
    id?: string | undefined | null
    codigo?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface CategoriasProdutosView {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface CategoriasProdutosList {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface CategoriasProdutosModel {
    id?: string | undefined | null
    codigo: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsCategoriasProdutos {
}

export interface CategoriasProdutosInterface {
    getViewCategoriasProdutos(params: any): Promise<CategoriasProdutosView | undefined>
    listCategoriasProdutosPaginate(params: CategoriasProdutosSearch): Promise<any>
    AsyncListCategoriasProdutos(params: CategoriasProdutosSearch): Promise<CategoriasProdutosModel[] | undefined>
    createCategoriasProdutos(params: CategoriasProdutosModel): Promise<number | undefined>
    editCategoriasProdutos(params: CategoriasProdutosModel): Promise<any>
    deleteCategoriasProdutos(id: number): Promise<any>
}

export const CategoriasProdutosDefaultValues: CategoriasProdutosModel = {
    id: null,
    codigo: null,
    descricao: null,
}
