import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'

export interface ConfiguracaoBicoAlturaCamada {
    bico: string
    alturas_camada: string[]
}

export interface LookupsConfiguracoesTecnicas {
    bicoOptions: SelectOptions[]
    alturasCamadaPorBico: Record<string, SelectOptions[]>
    tipoSuporteOptions: SelectOptions[]
    quantidadeParedesOptions: SelectOptions[]
}

export interface ConfiguracoesTecnicasInterface {
    getLookupsConfiguracoesTecnicas(): Promise<LookupsConfiguracoesTecnicas | undefined>
}

export const BICO_OPTIONS: SelectOptions[] = [
    { value: '0.2', label: '0.2' },
    { value: '0.4', label: '0.4' },
    { value: '0.6', label: '0.6' },
    { value: '0.8', label: '0.8' },
]

export const ALTURAS_CAMADA_POR_BICO: Record<string, SelectOptions[]> = {
    '0.2': [
        { value: '0.04', label: '0.04' },
        { value: '0.08', label: '0.08' },
        { value: '0.12', label: '0.12' },
        { value: '0.16', label: '0.16' },
    ],
    '0.4': [
        { value: '0.08', label: '0.08' },
        { value: '0.12', label: '0.12' },
        { value: '0.16', label: '0.16' },
        { value: '0.20', label: '0.20' },
        { value: '0.24', label: '0.24' },
        { value: '0.28', label: '0.28' },
    ],
    '0.6': [
        { value: '0.12', label: '0.12' },
        { value: '0.16', label: '0.16' },
        { value: '0.20', label: '0.20' },
        { value: '0.24', label: '0.24' },
        { value: '0.28', label: '0.28' },
        { value: '0.32', label: '0.32' },
    ],
    '0.8': [
        { value: '0.16', label: '0.16' },
        { value: '0.20', label: '0.20' },
        { value: '0.24', label: '0.24' },
        { value: '0.28', label: '0.28' },
        { value: '0.32', label: '0.32' },
        { value: '0.36', label: '0.36' },
    ],
}

export const TIPO_SUPORTE_OPTIONS: SelectOptions[] = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ARVORE_PADRAO', label: 'Árvore Padrão' },
    { value: 'ARVORE_FORTE', label: 'Árvore Forte' },
]

export const QUANTIDADE_PAREDES_OPTIONS: SelectOptions[] = [
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
]

export const getAlturasCamadaPorBico = (bico: string | null | undefined): SelectOptions[] => {
    if (!bico) return []
    return ALTURAS_CAMADA_POR_BICO[bico] || []
}
