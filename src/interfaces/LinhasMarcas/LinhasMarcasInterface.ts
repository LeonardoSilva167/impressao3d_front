export interface LinhasMarcasSearch {
    id?: string | undefined | null
    linha_marca_id?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface LinhasMarcasView {
    id?: number | undefined
    descricao?: string
}

export interface LinhasMarcasList {
    id?: number | undefined
    descricao?: string
}

export interface LinhasMarcasModel {
    id?: string | undefined | null
    linha_marca_id?: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsLinhasMarcas {
}

export interface LinhasMarcasInterface {
    getViewLinhasMarcas(params: any): Promise<LinhasMarcasView | undefined>
    listLinhasMarcasPaginate(params: LinhasMarcasSearch): Promise<any>
    AsyncListLinhasMarcas(params: LinhasMarcasSearch): Promise<LinhasMarcasModel[] | undefined>
    createLinhasMarcas(params: LinhasMarcasModel): Promise<any>
    editLinhasMarcas(params: LinhasMarcasModel): Promise<any>
    deleteLinhasMarcas(id: number): Promise<any>
}

export const LinhasMarcasDefaultValues: LinhasMarcasModel = {
    id: null,
    linha_marca_id: null,
    descricao: null,
}
