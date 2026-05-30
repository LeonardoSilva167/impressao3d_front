export interface ModelosProdutosSearch {
    id?: string | undefined | null
    codigo?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface ModelosProdutosView {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface ModelosProdutosList {
    id?: number | undefined
    codigo?: string
    descricao?: string
}

export interface ModelosProdutosModel {
    id?: string | undefined | null
    codigo: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsModelosProdutos {
}

export interface ModelosProdutosInterface {
    getViewModelosProdutos(params: any): Promise<ModelosProdutosView | undefined>
    listModelosProdutosPaginate(params: ModelosProdutosSearch): Promise<any>
    AsyncListModelosProdutos(params: ModelosProdutosSearch): Promise<ModelosProdutosModel[] | undefined>
    createModelosProdutos(params: ModelosProdutosModel): Promise<number | undefined>
    editModelosProdutos(params: ModelosProdutosModel): Promise<any>
    deleteModelosProdutos(id: number): Promise<any>
}

export const ModelosProdutosDefaultValues: ModelosProdutosModel = {
    id: null,
    codigo: null,
    descricao: null,
}
