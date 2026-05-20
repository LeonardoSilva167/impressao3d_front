import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface ContasBancariasInterface {
    getLookupsContasBancarias(): Promise<LookupsContasBancarias | undefined>
}
export interface LookupsContasBancarias {
    bancos: BancosList[]

}

export interface BancosList {
    id: number | undefined
    codigo: string | undefined
    nome: string | undefined
    ativo: boolean | undefined
}


export interface ContasBancariasSearch {
    id?: string | undefined | null,
    contas_bancaria_id?: string | undefined | null,
    banco_id?: string | undefined | null,
    conta_pj?: boolean | undefined | null,
    apelido?: string | undefined | null,
    saldo?: string | undefined | null,
    ativo?: boolean | undefined | null,
    palavra_chave?: string | null | undefined | unknown
}

export interface ContasBancariasView {
    id?: number | undefined
}

export interface ContasBancariasList {
    id?: number | undefined
}

export interface ContasBancariasModel {
    id: string | undefined | null,
    contas_bancaria_id: string | undefined | null,
    banco_id: string | undefined | null,
    conta_pj: boolean | undefined | null,
    apelido: string | undefined | null,
    saldo: string | undefined | null,
    ativo: boolean | undefined | null,

}

export const ContasBancariasDefaultValues = {
    id: null,
    contas_bancaria_id: null,
    banco_id: null,
    conta_pj: null,
    apelido: null,
    saldo: '0',
    ativo: true,
}


