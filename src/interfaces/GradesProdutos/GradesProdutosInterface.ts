import { FormatToDaySQLDate } from "helpers/functions_helpers"
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface"
import { Control, UseFormClearErrors, UseFormGetValues, UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form"

export interface GradesProdutosInterface {
    getLookupsGradesProdutos(): Promise<LookupsGradesProdutos | undefined>
}
export interface LookupsGradesProdutos {
    tamanhos: TamanhoList[]
    unidades: UnidadeList[]
    tipoProdutos: TipoProdutoList[]
}

export interface TamanhoList {
    id: number | undefined
    tamanho: string | undefined
}

export interface UnidadeList {
    id: number | undefined
    descricao: string | undefined
}

export interface TipoProdutoList {
    id: number | undefined
    descricao: string | undefined
}

export interface GradeProdutoUnidadesInterface {
    control: Control<GradesProdutosModel>
    register: UseFormRegister<GradesProdutosModel>
    getValues: UseFormGetValues<GradesProdutosModel>
    setValue: UseFormSetValue<GradesProdutosModel>
    lookups: TamanhosUnidadesLookups
    errors: any
    setError: UseFormSetError<GradesProdutosModel>
    clearErrors: UseFormClearErrors<GradesProdutosModel>
    gradesProdutos: GradesProdutosModel
    tamanhoList: TamanhoList
}

export interface GradesProdutosSearch {
    produto_codigo_base?: string | undefined | null,
    codigo?: string | undefined | null,
    descricao?: string | undefined | null,
    tamanho?: string | undefined | null,
    unidade_id?: string | undefined | null,    
    unidade_qtd?: string | undefined | null,
    preco_venda?: string | undefined | null,
    ativo?: boolean | undefined | null,
    
    palavra_chave?: string | null | undefined | unknown
}

export interface GradesProdutosView {
    id?: number | undefined
}

export interface GradesProdutosList {
    id?: number | undefined
}

export interface TamanhosUnidadesLookups {
    optTamanhoList: SelectOptions[]
}

export interface TamanhosUnidadesModel {
    tamanho: string | null;
    unidade_id: string | null;
    unidade_qtd: string | null;
}

export interface GradesProdutosModel {
    produto_codigo_base: string | undefined | null,
    codigo: string | undefined | null,
    descricao: string | undefined | null,
    tamanho: string
    situacao_filtro?: string
    unidade_id: string | undefined | null,
    unidade_qtd: string | undefined | null,
    preco_venda: string | undefined | null,
    ativo: boolean | undefined | null,
    tamanhosUnidades: Array<TamanhosUnidadesModel> | [];
}

export const GradesProdutosDefaultValues = {
    produto_codigo_base: null,
    codigo: null,
    descricao: null,
    tamanho: null,
    unidade_id: null,
    unidade_qtd: null,
    preco_venda: "0",
    ativo: true,
}

export const GradesProdutosUnidadeDefaultValues = {
    produto_codigo_base: null,
    codigo: null,
    descricao: null,
    tamanho: null,
    unidade_id: null,
    unidade_qtd: null,
    preco_venda: "0",
    ativo: true,
}


