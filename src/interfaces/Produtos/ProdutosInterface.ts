import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'

export interface LookupItem {
    id: number
    descricao: string
    codigo: string
}

export interface LookupsProdutos {
    categoriasProdutos: LookupItem[]
    modelosProdutos: LookupItem[]
    linhasProdutos: LookupItem[]
    cores: LookupItem[]
    partesBase: LookupItem[]
    proximoCodigoBase?: number | string | null
}

export type ProdutoVariacaoStatus = 'ATIVA' | 'INATIVADA'

export interface ProdutoCorRelacionamento {
    descricao?: string
    codigo?: string
    hexadecimal?: string | null
}

export interface ProdutosSearch {
    id?: string | null
    descricao_produto?: string | null
    codigo_base?: string | null
    sku_base?: string | null
    palavra_chave?: string | null | unknown
}

export interface ProdutosList {
    id?: number
    descricao_produto?: string
    codigo_base?: string
    sku_base?: string
    id_categoria?: number
    id_modelo?: number
    id_linha?: number
    categoria?: string
    modelo?: string
    linha?: string
    quantidade_variacoes?: number
}

export interface ProdutoRelacionamento {
    descricao?: string
    codigo?: string
}

export interface ProdutoVariacaoResumo {
    id?: number
    sku?: string
    status?: ProdutoVariacaoStatus | string | null
    id_cor_primaria?: number
    id_cor_secundaria?: number | null
    id_cor_terciaria?: number | null
    cor_primaria?: ProdutoCorRelacionamento
    cor_secundaria?: ProdutoCorRelacionamento | null
    cor_terciaria?: ProdutoCorRelacionamento | null
}

export interface ProdutosView {
    id?: number
    descricao_produto?: string
    codigo_base?: string
    sku_base?: string
    id_categoria?: number
    id_modelo?: number
    id_linha?: number
    categoria?: ProdutoRelacionamento
    modelo?: ProdutoRelacionamento
    linha?: ProdutoRelacionamento
    quantidade_variacoes?: number
    variacoes?: ProdutoVariacaoResumo[]
}

export interface ProdutosModel {
    id?: number | string | null
    descricao_produto: string | null
    codigo_base: string | null
    id_categoria: number | string | null
    id_modelo: number | string | null
    id_linha: number | string | null
}

export interface ProdutosInterface {
    getLookupsProdutos(): Promise<LookupsProdutos | undefined>
    getViewProdutos(params: { id: number }): Promise<ProdutosView | undefined>
    listProdutosPaginate(params: ProdutosSearch): Promise<PaginateInterface<ProdutosList> | undefined>
    AsyncListProdutos(params: ProdutosSearch): Promise<ProdutosList[] | undefined>
    createProdutos(params: ProdutosModel): Promise<number | undefined>
    editProdutos(params: ProdutosModel): Promise<void>
    deleteProdutos(id: number): Promise<void>
}

export const ProdutosDefaultValues: ProdutosModel = {
    id: null,
    descricao_produto: null,
    codigo_base: null,
    id_categoria: null,
    id_modelo: null,
    id_linha: null,
}
