import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface ProdutosInterface {
    getLookupsProdutos(): Promise<LookupsProdutos | undefined>
}
export interface LookupsProdutos {
    marcas: MarcasList[]
    usoPeriodos: UsoPeriodoList[]
    tipoProdutos: TipoProdutoList[]
}

export interface MarcasList {
    id: number | undefined
    nome: string | undefined
    codigo: string | undefined
}

export interface UsoPeriodoList {
    id: number | undefined
    descricao: string | undefined
}

export interface TipoProdutoList {
    id: number | undefined
    descricao: string | undefined
}

export interface ProdutosSearch {
    codigo_base?: string | undefined | null,
    descricao?: string | undefined | null,
    
    palavra_chave?: string | null | undefined | unknown
}

export interface ProdutosView {
    codigo_base?: string | undefined
    descricao?: string | undefined
}

export interface ProdutosList {
    codigo_base?: string | undefined
    descricao?: string | undefined
}

export interface ProdutosModel {
    codigo_base: string | undefined | null,
    descricao: string | undefined | null,



}

export const ProdutosDefaultValues = {
    codigo_base: null,
    descricao: null,
}


