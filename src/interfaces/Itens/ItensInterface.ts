export interface ItensSearch {
    id?: string | undefined | null
    item_id?: string | undefined | null
    id_categoria_item?: string | undefined | null
    descricao?: string | undefined | null
    codigo?: string | undefined | null
    unidade_medida?: string | undefined | null
    controla_estoque?: boolean | undefined | null
    gera_custo?: boolean | undefined | null
    ativo?: boolean | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface ItensView {
    id?: number | undefined
    id_categoria_item?: number | undefined
    categoria_descricao?: string
    descricao?: string
    codigo?: string
    unidade_medida?: string
    controla_estoque?: boolean
    gera_custo?: boolean
    ativo?: boolean
    estoque_atual?: number | null
    preco_medio_atual?: number | null
}

export interface ItensList {
    id?: number | undefined
    id_categoria_item?: number | undefined
    categoria_descricao?: string
    descricao?: string
    codigo?: string
    unidade_medida?: string
    controla_estoque?: boolean
    gera_custo?: boolean
    ativo?: boolean
    estoque_atual?: number | null
    preco_medio_atual?: number | null
}

export interface ItensModel {
    id?: string | undefined | null
    item_id?: string | undefined | null
    id_categoria_item: string | undefined | null
    descricao: string | undefined | null
    codigo: string | undefined | null
    unidade_medida: string | undefined | null
    controla_estoque: boolean | undefined | null
    gera_custo: boolean | undefined | null
    ativo: boolean | undefined | null
}

export interface LookupsItens {
    categoriasOptions?: { value: number; label: string }[]
}

export interface ItensLookupSearch {
    search?: string | undefined | null
}

export interface ItensLookup {
    id: number
    descricao: string
    codigo: string
    tipo_item: string
}

export interface ItensInterface {
    getViewItens(params: any): Promise<ItensView | undefined>
    listItensPaginate(params: ItensSearch): Promise<any>
    AsyncListItens(params: ItensSearch): Promise<ItensModel[] | undefined>
    lookupItens(params: ItensLookupSearch): Promise<ItensLookup[] | undefined>
    createItens(params: ItensModel): Promise<any>
    editItens(params: ItensModel): Promise<any>
    deleteItens(id: number): Promise<any>
}

export const ItensDefaultValues: ItensModel = {
    id: null,
    item_id: null,
    id_categoria_item: null,
    descricao: null,
    codigo: null,
    unidade_medida: null,
    controla_estoque: true,
    gera_custo: true,
    ativo: true,
}
