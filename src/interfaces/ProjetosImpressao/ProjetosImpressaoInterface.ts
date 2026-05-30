import { CorProjetoModel } from './CorProjetoInterface'
import { ParteProjetoImpressaoModel } from './ParteProjetoImpressaoInterface'

export interface ProjetosImpressaoSearch {
    id?: number | string | undefined | null
    projeto_impressao_id?: number | string | undefined | null
    codigo_projeto?: string | undefined | null
    nome_original_projeto?: string | undefined | null
    descricao_projeto?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface ProjetosImpressaoView {
    id?: number
    url_projeto?: string
    nome_original_projeto?: string
    codigo_projeto?: string
    descricao_projeto?: string
    partes?: ParteProjetoImpressaoModel[]
    custo_filamento?: number | string | null
    custo_energia?: number | string | null
    custo_desgaste?: number | string | null
    custo_total?: number | string | null
}

export interface ProjetosImpressaoList {
    id?: number
    codigo_projeto?: string
    nome_original_projeto?: string
    descricao_projeto?: string
}

export interface ProjetosImpressaoModel {
    id?: number | string | undefined | null
    projeto_impressao_id?: number | string | undefined | null
    url_projeto?: string | undefined | null
    nome_original_projeto?: string | undefined | null
    codigo_projeto?: string | undefined | null
    descricao_projeto?: string | undefined | null
}

export interface ProjetosImpressaoInterface {
    getViewProjetosImpressao(params: { id: number }): Promise<ProjetosImpressaoView | undefined>
    listProjetosImpressaoPaginate(params: ProjetosImpressaoSearch): Promise<any>
    AsyncListProjetosImpressao(params: ProjetosImpressaoSearch): Promise<ProjetosImpressaoModel[] | undefined>
    createProjetosImpressao(params: ProjetosImpressaoModel): Promise<number | undefined>
    editProjetosImpressao(params: ProjetosImpressaoModel): Promise<any>
    deleteProjetosImpressao(id: number): Promise<any>
}

export const ProjetosImpressaoDefaultValues: ProjetosImpressaoModel = {
    id: null,
    projeto_impressao_id: null,
    url_projeto: null,
    nome_original_projeto: null,
    codigo_projeto: null,
    descricao_projeto: null,
}

/** @deprecated Project-level colors removed; kept for legacy references */
export type { CorProjetoModel }
