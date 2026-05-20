import { FormatToDaySQLDate } from "helpers/functions_helpers"
import { TipoProdutoList } from "interfaces/TipoProduto"

export interface SubtipoProdutoInterface {
    getLookupsSubtipoProduto(): Promise<LookupsSubtipoProduto | undefined>
}
export interface LookupsSubtipoProduto {
    tipo_produtos: TipoProdutoList[]
}



export interface UsoPeriodoList {
    id: number | undefined
    tipo_produtos_id: number | undefined
    nome: string | undefined
}

export interface SubtipoProdutoList {
    id: number | undefined
    tipo_produtos_id: number | undefined
    nome: string | undefined
    ativo: boolean,
}

export interface SubtipoProdutoSearch {
    id?: string | undefined | null,
    tipo_produtos_id?: string | undefined | null,
    nome?: string | undefined | null,
    ativo: boolean,

    palavra_chave?: string | null | undefined | unknown
}

export interface SubtipoProdutoView {
    id?: string | undefined
    tipo_produtos_id?: string | undefined
    nome?: string | undefined
    ativo: boolean,
}

export interface SubtipoProdutoList {
    id?: string | undefined,
    tipo_produtos_id?: string | undefined,
    nome?: string | undefined
    ativo: boolean,
}

export interface SubtipoProdutoModel {
    id: string | undefined | null,
    tipo_produtos_id: string | undefined | null,
    nome: string | undefined | null,
    ativo: boolean,



}

export const SubtipoProdutoDefaultValues = {
    id: null,
    tipo_produtos_id: null,
    nome: null,
    ativo: true,
}


