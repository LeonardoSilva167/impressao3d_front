export interface LinhasProdutosSearch {
    id?: string | undefined | null
    codigo?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface LinhasProdutosView {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface LinhasProdutosList {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface LinhasProdutosModel {
    id?: string | undefined | null
    codigo: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsLinhasProdutos {
}

export interface LinhasProdutosInterface {
    getViewLinhasProdutos(params: any): Promise<LinhasProdutosView | undefined>
    listLinhasProdutosPaginate(params: LinhasProdutosSearch): Promise<any>
    AsyncListLinhasProdutos(params: LinhasProdutosSearch): Promise<LinhasProdutosModel[] | undefined>
    createLinhasProdutos(params: LinhasProdutosModel): Promise<number | undefined>
    editLinhasProdutos(params: LinhasProdutosModel): Promise<any>
    deleteLinhasProdutos(id: number): Promise<any>
}

export const LinhasProdutosDefaultValues: LinhasProdutosModel = {
    id: null,
    codigo: null,
    descricao: null,
}
