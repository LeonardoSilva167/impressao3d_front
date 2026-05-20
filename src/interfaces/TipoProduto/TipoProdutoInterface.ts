import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface TipoProdutoInterface {
    getLookupsTipoProduto(): Promise<LookupsTipoProduto | undefined>
}
export interface LookupsTipoProduto {
}


export interface UsoPeriodoList {
    id: number | undefined
    nome: string | undefined
}

export interface TipoProdutoList {
    id: number | undefined
    nome: string | undefined
    ativo: boolean,
}

export interface TipoProdutoSearch {
    id?: string | undefined | null,
    nome?: string | undefined | null,
    ativo: boolean,
    
    palavra_chave?: string | null | undefined | unknown
}

export interface TipoProdutoView {
    id?: string | undefined
    nome?: string | undefined
    ativo: boolean,
}

export interface TipoProdutoList {
    id?: string | undefined
    nome?: string | undefined
    ativo: boolean,
}

export interface TipoProdutoModel {
    id: string | undefined | null,
    nome: string | undefined | null,
    ativo: boolean,



}

export const TipoProdutoDefaultValues = {
    id: null,
    nome: null,
    ativo: true,
}


