export interface ParteProjetoImpressaoSearch {
    id?: number | string | undefined | null
    id_projeto_impressao?: number | string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface ParteProjetoImpressaoList {
    id?: number
    nome_parte?: string
    tempo_impressao?: string
    peso_parte?: number | string
    peso_suporte?: number | string
    peso_corado?: number | string
    peso_torre?: number | string
    peso_total?: number | string
    temperatura_bico?: number | string
    temperatura_mesa?: number | string
    usa_suporte?: boolean
    usa_brim?: boolean
    usa_engomagem?: boolean
}

export interface ParteProjetoImpressaoModel {
    id?: number | string | undefined | null
    id_projeto_impressao?: number | string | undefined | null
    nome_parte?: string | undefined | null
    altura_camada?: string | undefined | null
    temperatura_bico?: number | string | undefined | null
    temperatura_mesa?: number | string | undefined | null
    tempo_impressao?: string | undefined | null
    peso_parte?: number | string | undefined | null
    peso_suporte?: number | string | undefined | null
    peso_corado?: number | string | undefined | null
    peso_torre?: number | string | undefined | null
    peso_total?: number | string | undefined | null
    loops_parede?: number | string | undefined | null
    usa_suporte?: boolean | undefined
    angulo_suporte?: number | string | undefined | null
    tipo_suporte?: string | undefined | null
    distancia_z_inferior?: number | string | undefined | null
    quantidade_voltas?: number | string | undefined | null
    usa_brim?: boolean | undefined
    usa_engomagem?: boolean | undefined
    velocidade_engomagem?: number | string | undefined | null
    fluxo_engomagem?: number | string | undefined | null
}

export const TIPO_SUPORTE_PARTE_OPTIONS = [
    { value: 'ARVORE_PADRAO', label: 'Árvore Padrão' },
    { value: 'ARVORE_FORTE', label: 'Árvore Forte' },
]

export const ParteProjetoImpressaoDefaultValues: ParteProjetoImpressaoModel = {
    id: null,
    id_projeto_impressao: null,
    nome_parte: null,
    altura_camada: '0.20',
    temperatura_bico: 210,
    temperatura_mesa: 75,
    tempo_impressao: null,
    peso_parte: null,
    peso_suporte: null,
    peso_corado: null,
    peso_torre: null,
    peso_total: null,
    loops_parede: '2',
    usa_suporte: false,
    angulo_suporte: null,
    tipo_suporte: null,
    distancia_z_inferior: null,
    quantidade_voltas: null,
    usa_brim: false,
    usa_engomagem: false,
    velocidade_engomagem: null,
    fluxo_engomagem: null,
}
