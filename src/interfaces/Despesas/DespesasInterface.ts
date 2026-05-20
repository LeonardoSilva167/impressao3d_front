import { FormatToDaySQLDate } from "helpers/functions_helpers"

// import { PaginateInterface } from "../default"
export type RecorrenciaStatusList = {
    id: number
    descricao: string
}
export interface DespesasInterface {
    // listDespesasPaginate(params: DespesasSearch): Promise<PaginateInterface<DespesasList> | undefined>
    getLookupsDespesas(): Promise<LookupsDespesas | undefined>
}
export interface LookupsDespesas {
    recorrencias: RecorrenciaStatusList[]

}


export interface DespesasSearch {
    //Elementos Padroes para formulario
    palavra_chave?: string | null
    ativo?: boolean,
    nome?: string | undefined | null,
    valor?: string | undefined | null,
    qtd_parcela?: string | undefined | null,
    data_vencimento?: string | undefined | null,
    recorrencia?: string | undefined | null,
}

export interface DespesasView {
    id: number
    qtd_parcela: number
    valor: string
    valor_parcela: string
    recorrencia_status_id: string
}

export interface DespesasList {
    id?: number | undefined
}

export interface DespesasModel {
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

export const DespesasDefaultValues = {
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


