import { FormatToDaySQLDate } from "helpers/functions_helpers"

export interface LinhasProdutosInterface {
    getLookupsLinhasProdutos(): Promise<LookupsLinhasProdutos | undefined>
}
export interface LookupsLinhasProdutos {
    marcas: MarcasList[]
    usoPeriodos: UsoPeriodoList[]
    tipoProdutos: TipoProdutoList[]
}

export interface MarcasList {
    id: number | undefined
    nome: string | undefined
    codigo: string | undefined
}

export interface UsoPeriodoList {
    id: number | undefined
    descricao: string | undefined
}

export interface TipoProdutoList {
    id: number | undefined
    descricao: string | undefined
}

export interface LinhasProdutosSearch {
    id?: string | undefined | null,
    linha_id?: string | undefined | null,
    marca_id?: string | undefined | null,
    uso_periodo_id?: string | undefined | null,    
    nome?: string | undefined | null,
    codigo?: string | undefined | null,
    descricao?: string | undefined | null,
    tipo_id?: string | undefined | null,
    hora_protecao?: string | undefined | null,
    
    palavra_chave?: string | null | undefined | unknown
}

export interface LinhasProdutosView {
    id?: number | undefined
}

export interface LinhasProdutosList {
    id?: number | undefined
}

export interface LinhasProdutosModel {
    id: string | undefined | null,
    linha_id: string | undefined | null,
    marca_id: string | undefined | null,
    marca_nome: string | undefined | null,
    uso_periodo_id: string | undefined | null,
    nome_uso_periodo: string | undefined | null,
    nome: string | undefined | null,
    codigo: string | undefined | null,
    descricao: string | undefined | null,
    tipo_id: string | undefined | null,
    hora_protecao: string | undefined | null,


}

export const LinhasProdutosDefaultValues = {
    id: null,
    linha_id: null,
    marca_id: null,
    uso_periodo_id: null,
    nome: null,
    codigo: null,
    descricao: null,
    tipo_id: null,
    hora_protecao: null,
}


