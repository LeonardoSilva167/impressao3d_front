import { FormatToDaySQLDate } from "helpers/functions_helpers"
import { Control, UseFormClearErrors, UseFormGetValues, UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form"


export interface OrgaoSearch {
    id?: string | undefined | null,
    cliente_id?: string | undefined | null,
    codigo?: string | undefined | null,
    nome?: string | undefined | null,
    uf?: string | undefined | null,
    cidade?: string | undefined | null,
    palavra_chave?: string | null | undefined | unknown
}

export interface OrgaoView {
    id?: number | undefined
}

export interface OrgaoList {
    id?: number | undefined
}

export interface OrgaoModel {
    id: string | undefined | null,
    orgao_nome: string | undefined | null,
    unidadeCompradora: Array<UnidadeCompradoraModel> | []
}

export const OrgaoDefaultValues = {
    id: null,
    orgao_nome: null,
    unidadeCompradora: [],
}

export interface OrgaoUnidadeCompradoraInterface {
    control: Control<OrgaoModel>
    register: UseFormRegister<OrgaoModel>
    getValues: UseFormGetValues<OrgaoModel>
    setValue: UseFormSetValue<OrgaoModel>
    orgao: OrgaoModel
    errors: any
    // lookups: LookupsProdutos
    setError: UseFormSetError<OrgaoModel>
    required: UseFormSetError<OrgaoModel>
    watch: UseFormSetError<OrgaoModel>
    clearErrors: UseFormClearErrors<OrgaoModel>
}
 

export interface UnidadeCompradoraModel {
    id: number | null
    orgaos_id: number | string | null
    codigo: string | null
    nome: string | null
    uf: string | null
    cidade: string | null

}