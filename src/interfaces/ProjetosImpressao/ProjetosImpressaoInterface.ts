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
    bico_padrao?: string
    tempo_total_projeto?: string
    peso_total_projeto?: number | string
    quantidade_partes?: number
    cores?: CorProjetoModel[]
    partes?: ParteProjetoImpressaoModel[]
}

export interface ProjetosImpressaoList {
    id?: number
    codigo_projeto?: string
    nome_original_projeto?: string
    descricao_projeto?: string
    bico_padrao?: string
    tempo_total_projeto?: string
    peso_total_projeto?: number | string
    quantidade_partes?: number
}

export interface ProjetosImpressaoModel {
    id?: number | string | undefined | null
    projeto_impressao_id?: number | string | undefined | null
    url_projeto?: string | undefined | null
    nome_original_projeto?: string | undefined | null
    codigo_projeto?: string | undefined | null
    descricao_projeto?: string | undefined | null
    bico_padrao?: string | undefined | null
    tempo_total_projeto?: string | undefined | null
    peso_total_projeto?: number | string | undefined | null
    cores?: CorProjetoModel[]
    partes?: ParteProjetoImpressaoModel[]
}

export interface LookupsProjetosImpressao {
    // reservado para lookups futuros
}

export interface ProjetosImpressaoInterface {
    getViewProjetosImpressao(params: { id: number }): Promise<ProjetosImpressaoView | undefined>
    listProjetosImpressaoPaginate(params: ProjetosImpressaoSearch): Promise<any>
    AsyncListProjetosImpressao(params: ProjetosImpressaoSearch): Promise<ProjetosImpressaoModel[] | undefined>
    createProjetosImpressao(params: ProjetosImpressaoModel): Promise<any>
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
    bico_padrao: '0.4',
    tempo_total_projeto: null,
    peso_total_projeto: null,
    cores: [],
    partes: [],
}
