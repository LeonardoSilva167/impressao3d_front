export interface CategoriasSearch {
    id?: string | undefined | null
    categoria_id?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface CategoriasView {
    id?: number | undefined
    descricao?: string
}

export interface CategoriasList {
    id?: number | undefined
    descricao?: string
}

export interface CategoriasModel {
    id?: string | undefined | null
    categoria_id?: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsCategorias {
}

export interface CategoriasInterface {
    getViewCategorias(params: any): Promise<CategoriasView | undefined>
    listCategoriasPaginate(params: CategoriasSearch): Promise<any>
    AsyncListCategorias(params: CategoriasSearch): Promise<CategoriasModel[] | undefined>
    createCategorias(params: CategoriasModel): Promise<any>
    editCategorias(params: CategoriasModel): Promise<any>
    deleteCategorias(id: number): Promise<any>
}

export const CategoriasDefaultValues: CategoriasModel = {
    id: null,
    categoria_id: null,
    descricao: null,
}
