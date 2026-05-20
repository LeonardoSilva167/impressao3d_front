import { FormatToDaySQLDate } from "helpers/functions_helpers"

// import { PaginateInterface } from "../default"
export type contasBancariasList = {
    id: number
    banco_id: string
    conta_pj: boolean
    apelido: string
    saldo: string
    ativo: boolean
}
export interface LancamentosInterface {
    // listLancamentosPaginate(params: LancamentosSearch): Promise<PaginateInterface<LancamentosList> | undefined>
    getLookupsLancamentos(): Promise<LookupsLancamentos | undefined>
}
export interface LookupsLancamentos {
    contas_bancarias: contasBancariasList[]

}


export interface LancamentosSearch {
    //Elementos Padroes para formulario
    id: string | undefined | null,
    lancamento_id: string | undefined | null,
    tipo_lancamento: boolean | undefined | null,
    despesa_id: string | undefined | null,
    receita_id: string | undefined | null,
    dthr_lancamento: string | undefined | null,
    valor: string | undefined | null,
    contas_bancaria_origem_id: string | undefined | null,
    contas_bancaria_destino_id: string | undefined | null,
    descricao: string | undefined | null,
    palavra_chave: string | null | undefined | unknown
}

export interface LancamentosView {
    lancamento_id?: number | undefined
}

export interface LancamentosList {
    lancamento_id?: number | undefined
}

export interface LancamentosModel {
    id?: number | undefined | null,
    lancamento_id?: number | undefined | null,
    tipo_lancamento?: string | undefined | null,
    dthr_lancamento?: string,
    nome_despesa?: string | undefined | null,
    nome_receita?: string | undefined | null,
    entrada_id?: string | undefined | null,
    despesa_id?: string | undefined | null,
    receita_id?: string | undefined | null,
    contas_bancaria_origem_id?: string | undefined | null,
    contas_bancaria_destino_id?: string | undefined | null,
    valor?: string | undefined | null,
    descricao?: string | undefined | null,

}

export const LancamentosDefaultValues = {
    lancamento_id: null,
    tipo_lancamento: null,
    dthr_lancamento: null,
    nome_despesa: null,
    nome_receita: null,
    entrada_id: null,
    despesa_id: null,
    receita_id: null,
    contas_bancaria_origem_id: null,
    contas_bancaria_destino_id: null,
    valor: '0',
    descricao: null,

}


