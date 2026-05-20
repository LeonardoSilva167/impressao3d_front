import { FormatToDaySQLDate } from "helpers/functions_helpers"


export interface ClientesSearch {
    id?: string | undefined | null,
    cliente_id?: string | undefined | null,
    codigo?: string | undefined | null,
    nome?: string | undefined | null,
    uf?: string | undefined | null,
    cidade?: string | undefined | null,
    palavra_chave?: string | null | undefined | unknown
}

export interface ClientesView {
    id?: number | undefined
}

export interface ClientesList {
    id?: number | undefined
}

export interface ClientesModel {
    id: string | undefined | null,
    cliente_id: string | undefined | null,
    nome: string | undefined | null,
    telefone: string | undefined | null,
}

export const ClientesDefaultValues = {
    id: null,
    cliente_id: null,
    nome: null,
    telefone: null,
}


