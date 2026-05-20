import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface DashboardsInterface {
    getLookupsDashboards(): Promise<LookupsDashboards | undefined>
}
export interface LookupsDashboards {
    formaPagamentos: formaPagamentosList[]

}

export interface formaPagamentosList {
    id: number | undefined
    descricao: string | undefined
}


export interface DashboardsSearch {
    id?: string | undefined | null,
    id_cliente?: string | undefined | null,
    id_servico?: string | undefined | null,

    palavra_chave?: string | null | undefined | unknown
}

export interface DashboardsView {
    id?: number | undefined
}

export interface DashboardsList {
    id?: number | undefined
}

export interface DashboardProds {

    id: number | null
    id_Dashboard_prods: number | null
    id_Dashboard: number | null
    id_servico: number | null
    nome_servico: string | null
    descricao: string | null
    qtd: number
    preco_un: string | null
    desconto: string | null
    acrescimo: string | null
    frete: string | null
    subtotal: string | null
    total: string | null
}
export interface FormaPgto {

    // forma_pagamento_id: number; 
    // forma_pagamento_nome: number; 
    // valor_pagamento: number; 


    id: number | null
    id_movimento_caixas: number | null
    id_origem: number | null
    id_tipo_origem_pagamento: number | null
    id_forma_pagamento: number | null
    nome_forma_pagamento: string | null
    valor_pagamento: string | null
    data_movimentacao: string | null
}

export interface DashboardsModel {
    id: string | undefined | null,
    id_cliente: string | undefined | null,    
    nome_cliente: string | undefined | null,    
    id_servico: string | undefined | null,    
    qtd: string | undefined | null,    
    preco_un: string | undefined | null,    
    subtotal: string | undefined | null,    
    desconto_pagamento: string | undefined | null,    
    acrescimo_pagamento: string | undefined | null,    
    frete_pagamento: string | undefined | null,    
    id_forma_pagamento: string | undefined | null,    
    valor_pagamento: string | undefined | null,    
    DashboardProds: Array<DashboardProds> | []
    formaPgto: Array<FormaPgto> | []
}

export const DashboardsDefaultValues = {
    id: null,
    id_cliente: null,
    nome_cliente: null,
    id_servico: null,
    qtd: "0",
    preco_un: "0",
    subtotal: "0",
    desconto_pagamento: "0",
    acrescimo_pagamento: "0",
    frete_pagamento: "0",
    forma_pagamento_id: null,
    valor_pagamento: "0",
}


