
export interface ServicosInterface {
    // listDespesasPaginate(params: DespesasSearch): Promise<PaginateInterface<DespesasList> | undefined>
}

export interface ServicosSearch {
    id?: string | undefined | null,
    id_servico?: string | undefined | null,
    nome?: string | undefined | null,
    descricao?: string | undefined | null,
    preco?: string | undefined | null,
    palavra_chave?: string | null | undefined | unknown
}

export interface ServicosView {
    id?: number | undefined
}

export interface ServicosList {
    id?: number | undefined
}

export interface ServicosModel {
    id: string | undefined | null,
    id_servico: string | undefined | null,
    nome: string | undefined | null,
    descricao: string | undefined | null,
    preco: string | undefined | null,
}

export const ServicosDefaultValues = {
    id: null,
    id_servico: null,
    nome: null,
    descricao: null,
    preco: "0",
}


