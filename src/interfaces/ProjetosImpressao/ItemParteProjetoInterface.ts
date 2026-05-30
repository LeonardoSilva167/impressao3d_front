export interface ItemParteProjetoModel {
    id?: number | string | undefined | null
    id_projeto_impressao_parte?: number | string | undefined | null
    nome_item?: string | undefined | null
    id_cor?: number | string | undefined | null
    cor_descricao?: string | undefined | null
    cor_hexadecimal?: string | undefined | null
    altura_camada?: string | undefined | null
    loops_parede?: number | string | undefined | null
    temperatura_bico?: number | string | undefined | null
    temperatura_mesa?: number | string | undefined | null
    tempo_impressao?: string | undefined | null
    peso_parte?: number | string | undefined | null
    peso_suporte?: number | string | undefined | null
    peso_corado?: number | string | undefined | null
    peso_torre?: number | string | undefined | null
    peso_total?: number | string | undefined | null
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

export const TIPO_SUPORTE_ITEM_OPTIONS = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ARVORE_PADRAO', label: 'Árvore Padrão' },
    { value: 'ARVORE_FORTE', label: 'Árvore Forte' },
]

export const ALTURA_CAMADA_PADRAO_OPTIONS = [
    { value: '0.08', label: '0.08mm' },
    { value: '0.12', label: '0.12mm' },
    { value: '0.16', label: '0.16mm' },
    { value: '0.20', label: '0.20mm' },
    { value: '0.24', label: '0.24mm' },
    { value: '0.28', label: '0.28mm' },
]

export const ItemParteProjetoDefaultValues: ItemParteProjetoModel = {
    id: null,
    id_projeto_impressao_parte: null,
    nome_item: null,
    id_cor: null,
    altura_camada: '0.20',
    loops_parede: '2',
    temperatura_bico: 210,
    temperatura_mesa: 75,
    tempo_impressao: null,
    peso_parte: null,
    peso_suporte: null,
    peso_corado: null,
    peso_torre: null,
    peso_total: null,
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
