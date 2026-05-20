import { FormatToDaySQLDate } from "helpers/functions_helpers"
import { date } from "yup"

export interface LicitacoesInterface {
    getLookupsLicitacoes(): Promise<LookupsLicitacoes | undefined>
}
export interface LookupsLicitacoes {
    statusClassificacoes: StatusClassificacoesList[]

}

export interface StatusClassificacoesList {
    id: number | undefined
    nome: string | undefined
}

export interface LicitacoesSearch {
    id?: string | undefined | null,
    licitacao_id?: string | undefined | null,
    cliente_id?: string | undefined | null,
    status_licitacoes_id?: string | undefined | null,
    status_compra_id?: string | undefined | null,
    status_cotacao_id?: string | undefined | null,
    modalidade_id?: string | undefined | null,
    data_limite_proposta?: string | undefined | null,
    data_limite_proposta_inicio?: string | undefined | null,
    data_limite_proposta_final?: string | undefined | null,
    uf?: string | undefined | null,
    cidade?: string | undefined | null,
    palavra_chave?: string | undefined | null,
}

export interface LicitacoesView {
    id?: number | undefined
}

export interface LicitacoesList {
    id?: number | undefined
}

export interface LicitacoesModel {
    id: string | undefined | null,
    licitacao_id: string | undefined | null,
    unidade_compradoras_id: string | undefined | null,
    unidade_compradoras_codigo: string | undefined | null,
    unidade_compradoras_nome: string | undefined | null,
    status_licitacoes_id: string | undefined | null,
    status_compra_id: string | undefined | null,
    status_cotacao_id: string | undefined | null,
    modalidade_id: string | undefined | null,
    num_compra: string | undefined | null,
    exercicio: string | undefined | null,
    data_limite_proposta: string | undefined | null,
    link_pcnp: string | undefined | null,
    orgaos_id: string | undefined | null,
    orgaos_cnpj: string | undefined | null,
}

export const LicitacoesDefaultValues = {
    id: null,
    licitacao_id: null,
    unidade_compradoras_id: null,   
    unidade_compradoras_codigo: '',
    unidade_compradoras_nome: '',
    status_licitacoes_id: null,
    status_compra_id: null,    
    status_cotacao_id: null,
    modalidade_id: null,
    num_compra: null,
    exercicio: new Date().getFullYear(),
    data_limite_proposta: null,
    link_pcnp: null,
}



export interface LicitacoesItensSearch {
    id?: string | undefined | null,
    licitacao_id?: string | undefined | null,
    // status_licitacoes_id?: string | undefined | null,
    // status_compra_id?: string | undefined | null,
    // status_cotacao_id?: string | undefined | null,
    // modalidade_id?: string | undefined | null,
    // data_limite_proposta?: string | undefined | null,
    // data_limite_proposta_inicio?: string | undefined | null,
    // data_limite_proposta_final?: string | undefined | null,
    palavra_chave?: string | undefined | null,
}

export interface LicitacoesItensView {
    id?: number | undefined
}

export interface LicitacoesItensList {
    id?: number | undefined
}

export interface LicitacoesItensModel {
    id: string | undefined | null,
    licitacao_id: string | undefined | null,
    cliente_id: string | undefined | null,
    cliente_codigo: string | undefined | null,
    cliente_nome: string | undefined | null,
    status_licitacoes_id: string | undefined | null,
    status_compra_id: string | undefined | null,
    status_cotacao_id: string | undefined | null,
    modalidade_id: string | undefined | null,
    num_compra: string | undefined | null,
    exercicio: string | undefined | null,
    data_limite_proposta: string | undefined | null,
    link_pcnp: string | undefined | null,
}

export const LicitacoesItensDefaultValues = {
    id: null,
    licitacao_id: null,
    cliente_id: null,   
    cliente_codigo: null,
    cliente_nome: null,
    status_licitacoes_id: 1,
    status_classificacao_id: 1,
    status_compra_id: null,    
    status_cotacao_id: null,
    modalidade_id: null,
    num_compra: null,
    exercicio: new Date().getFullYear(),
    data_limite_proposta: null,
    link_pcnp: null,
}

export interface DefaultUnidadeCompradoraOption {
    unidade_compradoras_id: number | null
    unidade_compradoras_codigo: string | null
    unidade_compradoras_nome: string | null
}
