import { FormatToDaySQLDate } from "helpers/functions_helpers"

// import { PaginateInterface } from "../default"
export type RecorrenciaStatusList = {
    id: number
    descricao: string
}
export interface ReceitasInterface {
    // listReceitasPaginate(params: ReceitasSearch): Promise<PaginateInterface<ReceitasList> | undefined>
    getLookupsReceitas(): Promise<LookupsReceitas | undefined>
}
export interface LookupsReceitas {

}


export interface ReceitasSearch {
    //Elementos Padroes para formulario
    palavra_chave?: string | null
    ativo?: boolean,
    nome?: string | undefined | null,
    valor?: string | undefined | null,
    qtd_parcela?: string | undefined | null,
    data_vencimento?: string | undefined | null,
    recorrencia?: string | undefined | null,
}

export interface ReceitasView {
    id: number
    qtd_parcela: number
    valor: string
    valor_parcela: string
    recorrencia_status_id: string
}

export interface ReceitasList {
    id?: number | undefined
}

export interface ReceitasModel {
    id?: number | undefined | null,
    ativo?: boolean,
    descricao?: string | undefined | null,
}

export const ReceitasDefaultValues = {
    id: null,
    ativo: true,
    descricao: null,
}


