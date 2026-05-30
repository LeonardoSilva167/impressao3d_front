import { ItemParteProjetoModel } from './ItemParteProjetoInterface'

export interface ParteProjetoImpressaoSearch {
    id?: number | string | undefined | null
    id_projeto_impressao?: number | string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface ParteProjetoImpressaoList {
    id?: number
    nome_parte?: string
    id_projeto_impressao?: number
    itens?: ItemParteProjetoModel[]
}

export interface ParteProjetoImpressaoModel {
    id?: number | string | undefined | null
    id_projeto_impressao?: number | string | undefined | null
    nome_parte?: string | undefined | null
    itens?: ItemParteProjetoModel[]
}

export const ParteProjetoImpressaoDefaultValues: ParteProjetoImpressaoModel = {
    id: null,
    id_projeto_impressao: null,
    nome_parte: null,
    itens: [],
}

/** @deprecated Use TIPO_SUPORTE_ITEM_OPTIONS from ItemParteProjetoInterface */
export const TIPO_SUPORTE_PARTE_OPTIONS = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ARVORE_PADRAO', label: 'Árvore Padrão' },
    { value: 'ARVORE_FORTE', label: 'Árvore Forte' },
]
