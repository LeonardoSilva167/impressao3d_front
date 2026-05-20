import { FormatToDaySQLDate } from "helpers/functions_helpers"

// import { PaginateInterface } from "../default"
export type RecorrenciaStatusList = {
    id: number
    descricao: string
}
export interface ContasPagarInterface {
    // listContasPagarPaginate(params: ContasPagarSearch): Promise<PaginateInterface<ContasPagarList> | undefined>
    getLookupsContasPagar(): Promise<LookupsContasPagar | undefined>
}
export interface LookupsContasPagar {
    recorrencias: RecorrenciaStatusList[]

}


export interface ContasPagarSearch {
    //Elementos Padroes para formulario
    ativo: boolean,
    nome: string | undefined | null,
    valor: string | undefined | null,
    qtd_parcela: string | undefined | null,
    data_vencimento: string | undefined | null,
    recorrencia: string | undefined | null,
    palavra_chave: string | null | undefined | unknown
}

export interface ContasPagarView {
    id?: number | undefined
}

export interface ContasPagarList {
    id?: number | undefined
}

export interface ContasPagarModel {
    id?: number | undefined | null,
    ativo?: boolean,
    nome?: string | undefined | null,
    valor?: string,
    qtd_parcela?: string | null,
    data_vencimento?: string | undefined | null,
    dia_vencimento?: string,
    mes_vencimento?: string | number,
    recorrencia_status_id?: string,
}

export const ContasPagarDefaultValues = {
    id: null,
    ativo: true,
    nome: null,
    valor: null,
    qtd_parcela: null,
    data_vencimento: FormatToDaySQLDate(),
    dia_vencimento: null,
    mes_vencimento: null,
    recorrencia: null,
}


