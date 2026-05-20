import { FormatToDaySQLDate } from "helpers/functions_helpers"

// import { PaginateInterface } from "../default"
export type RecorrenciaStatusList = {
    id: number
    descricao: string
}
export interface MarcasInterface {
    // listMarcasPaginate(params: MarcasSearch): Promise<PaginateInterface<MarcasList> | undefined>
    getLookupsMarcas(): Promise<LookupsMarcas | undefined>
}
export interface LookupsMarcas {
    // recorrencias: RecorrenciaStatusList[]

}


export interface MarcasSearch {
    //Elementos Padroes para formulario
    palavra_chave?: string | null
    // ativo?: boolean,
    nome?: string | undefined | null,
    codigo?: string | undefined | null,
}

export interface MarcasView {
    id: number
    nome: string
    codigo: string
}

export interface MarcasList {
    id?: number | undefined
}

export interface MarcasModel {
    id?: number | undefined | null,
    ativo?: boolean,
    nome?: string | undefined | null,
    codigo?: string | null,
}

export const MarcasDefaultValues = {
    id: null,
    ativo: true,
    nome: null,
    codigo: null,
}


