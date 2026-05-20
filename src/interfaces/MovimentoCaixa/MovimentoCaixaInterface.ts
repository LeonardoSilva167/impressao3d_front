import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface MovimentoCaixaInterface {
    getLookupsMovimentoCaixa(): Promise<LookupsMovimentoCaixa | undefined>
}
export interface LookupsMovimentoCaixa {
    formaPagamentos: formaPagamentosList[]
}

export interface formaPagamentosList {
    id: number | undefined
    descricao: string | undefined
}


export interface MovimentoCaixaSearch {
    id?: string | undefined | null,
    id_tipo_origem_pagamento?: string | undefined | null,
    id_forma_pagamento?: string | undefined | null,
    valor?: string | undefined | null,
    palavra_chave?: string | null | undefined | unknown
}

export interface MovimentoCaixaView {
    id?: number | undefined
}

export interface MovimentoCaixaList {
    id?: number | undefined
}

export interface MovimentoCaixaModel {
    id: string | undefined | null,
    id_tipo_origem_pagamento: string | undefined | null,
    id_forma_pagamento: string | undefined | null,
    valor: string | undefined | null,
    observacao: string | undefined | null,
}

export const MovimentoCaixaDefaultValues = {
    id: null,
    id_tipo_origem_pagamento: null,
    id_forma_pagamento: null,
    observacao: null,
    valor: "0",
}
// export interface CaixaModel {
//     id: string | undefined | null
//     status: boolean | undefined | null,
// }

// export const CaixaModelDefaultValues = {
//     id: null,
//     status: null,
// }

export interface CaixaModel {
    id?: number;
    valor_abertura: number;
    observacao?: string;
    caixa_fechado: boolean;
  }
  
  export const CaixaModelDefaultValues: CaixaModel = {
    valor_abertura: 0,
    caixa_fechado: false,
  };
export interface CaixaSearch {
    id?: string | undefined | null,
    status?: boolean | undefined | null,
}