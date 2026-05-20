import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface FluxoCaixaInterface {
    getLookupsFluxoCaixa(): Promise<LookupsFluxoCaixa | undefined>
}
export interface LookupsFluxoCaixa {
    // bancos: BancosList[]

}

// export interface BancosList {
//     id: number | undefined
//     codigo: string | undefined
//     nome: string | undefined
//     ativo: boolean | undefined
// }


export interface FluxoCaixaSearch {
    id?: string | undefined | null,
    data_inicio?: string | undefined | null,
    data_fim?: string | undefined | null,
    
    palavra_chave?: string | null | undefined | unknown
}

export interface FluxoCaixaView {
    id?: number | undefined
}

export interface FluxoCaixaList {
    id?: number | undefined
}

export interface FluxoCaixaModel {
    id: string | undefined | null,
    data_inicio: string | undefined | null,
    data_fim: string | undefined | null,

}

export const FluxoCaixaDefaultValues = {
  id: null,
  data_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  data_fim: new Date(),
}



