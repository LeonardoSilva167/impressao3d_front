export interface MarcasSearch {
    id?: number | string | undefined | null
    palavra_chave?: string | null | undefined | unknown
    descricao?: string | undefined | null
    
}

export interface MarcasView {
    id: number
    descricao: string
    
    ativo?: boolean
}

export interface MarcasList {
    id?: number | undefined
    descricao?: string
    
    ativo?: boolean
}

export interface MarcasModel {
    id?: number | undefined | null
    ativo?: boolean
    descricao?: string | undefined | null
    
}

export interface LookupsMarcas {
    // recorrencias: RecorrenciaStatusList[]
}

export interface MarcasInterface {
    getLookupsMarcas(): Promise<LookupsMarcas | undefined>
    getViewMarcas(params: any): Promise<MarcasView | undefined>
    listMarcasPaginate(params: MarcasSearch): Promise<any>
    AsyncListMarcas(params: MarcasSearch): Promise<MarcasModel[] | undefined>
    createMarcas(params: MarcasModel): Promise<any>
    editMarcas(params: MarcasModel): Promise<any>
    deleteMarcas(id: number): Promise<any>
}

export const MarcasDefaultValues: MarcasModel = {
    id: null,
    ativo: true,
    descricao: null,
    
}
