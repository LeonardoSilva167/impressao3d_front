export interface CoresSearch {
    id?: string | undefined | null
    cor_id?: string | undefined | null
    descricao?: string | undefined | null
    codigo?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface CoresView {
    id?: number | undefined
    descricao?: string
    codigo?: string
    hexadecimal?: string
}

export interface CoresList {
    id?: number | undefined
    descricao?: string
    codigo?: string
    hexadecimal?: string
}

export interface CoresModel {
    id?: string | undefined | null
    cor_id?: string | undefined | null
    descricao: string | undefined | null
    codigo: string | undefined | null
    hexadecimal?: string | undefined | null
}

export interface LookupsCores {
    // ex: tipoOptions?: TipoModel[]
}

export interface CoresInterface {
    getViewCores(params: any): Promise<CoresView | undefined>
    listCoresPaginate(params: CoresSearch): Promise<any>
    AsyncListCores(params: CoresSearch): Promise<CoresModel[] | undefined>
    createCores(params: CoresModel): Promise<any>
    editCores(params: CoresModel): Promise<any>
    deleteCores(id: number): Promise<any>
}

export const CoresDefaultValues: CoresModel = {
    id: null,
    cor_id: null,
    descricao: null,
    codigo: null,
    hexadecimal: null,
}
