export interface CarreteisFinalizadosSearch {
    id?: string | undefined | null
    carreteis_finalizados_id?: string | undefined | null
    id_item?: string | undefined | null
    gramatura?: string | undefined | null
    data_inicio?: string | undefined | null
    data_fim?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface CarreteisFinalizadosView {
    id?: number
    id_item?: number
    item_descricao?: string
    gramatura?: number | string
    quantidade?: number
    total_consumido?: number
    data_finalizacao?: string
    usuario_descricao?: string
    observacao?: string
    compra_descricao?: string
    numero_pedido?: string
    plataforma_descricao?: string
    data_compra?: string
    qtd_original?: number
    qtd_atual?: number
    valor_unitario?: number
}

export interface CarreteisFinalizadosListApi {
    id?: number
    filamento?: {
        id?: number
        codigo?: string
        resumo?: string
    }
    item?: {
        id?: number
        descricao?: string
        codigo?: string
    }
    gramatura?: number | string
    quantidade?: number
    qtd_total_consumida?: number | string
    data_finalizacao?: string
    usuario?: {
        id?: number
        nome?: string
        descricao?: string
        name?: string
    } | null
    observacao?: string | null
}

export interface CarreteisFinalizadosList {
    id?: number
    id_item?: number
    item_descricao?: string
    gramatura?: number | string
    quantidade?: number
    total_consumido?: number
    data_finalizacao?: string
    usuario_descricao?: string
    observacao?: string
}

export interface CarreteisFinalizadosModel {
    id?: string | undefined | null
    carreteis_finalizados_id?: string | undefined | null
    id_item: string | undefined | null
    gramatura: string | undefined | null
    quantidade: string | undefined | null
    observacao?: string | undefined | null
}

export interface LoteMaisAntigoResponse {
    lote?: {
        id?: number
        qtd_original?: number | string
        qtd_atual?: number | string
        valor_unitario_real?: number | string
        gramatura_filamento?: number | string | null
    }
    compra?: {
        id?: number
        numero_pedido?: string
        data_compra?: string
        plataforma?: {
            id?: number
            descricao?: string
        }
    }
}

export interface LoteMaisAntigoInfo {
    id?: number
    id_compra?: number
    compra_descricao?: string
    numero_pedido?: string
    plataforma_descricao?: string
    data_compra?: string
    qtd_original?: number
    qtd_atual?: number
    valor_unitario?: number
}

export interface CarreteisFinalizadosInterface {
    getViewCarreteisFinalizados(params: { id: number }): Promise<CarreteisFinalizadosView | undefined>
    listCarreteisFinalizadosPaginate(params: CarreteisFinalizadosSearch): Promise<any>
    getLoteMaisAntigo(idItem: number): Promise<LoteMaisAntigoInfo | undefined>
    createCarreteisFinalizados(params: CarreteisFinalizadosModel): Promise<any>
    editCarreteisFinalizados(params: CarreteisFinalizadosModel): Promise<any>
    deleteCarreteisFinalizados(id: number): Promise<any>
}

export const CarreteisFinalizadosDefaultValues: CarreteisFinalizadosModel = {
    id: null,
    carreteis_finalizados_id: null,
    id_item: null,
    gramatura: null,
    quantidade: null,
    observacao: null,
}

export const GRAMATURA_CARRETEIS_OPTIONS = [
    { value: '500', label: '500g' },
    { value: '1000', label: '1000g' },
]

export const TIPO_ITEM_FILAMENTO = 'FILAMENTO'
