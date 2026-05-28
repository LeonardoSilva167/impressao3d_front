export interface CorProjetoModel {
    id?: number | string | undefined | null
    id_cor?: number | string | undefined | null
    peso_gramas?: number | string | undefined | null
    descricao_cor?: string | undefined | null
    hexadecimal_cor?: string | undefined | null
}

export interface CorProjetoFormModel {
    id_cor?: number | string | undefined | null
    peso_gramas?: number | string | undefined | null
}

export const CorProjetoDefaultValues: CorProjetoFormModel = {
    id_cor: null,
    peso_gramas: null,
}
