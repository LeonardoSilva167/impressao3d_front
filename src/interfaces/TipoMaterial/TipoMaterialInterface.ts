export interface TipoMaterialSearch {
    id?: string | undefined | null
    tipo_material_id?: string | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface TipoMaterialView {
    id?: number | undefined
    descricao?: string
}

export interface TipoMaterialList {
    id?: number | undefined
    descricao?: string
}

export interface TipoMaterialModel {
    id?: string | undefined | null
    tipo_material_id?: string | undefined | null
    descricao: string | undefined | null
}

export interface LookupsTipoMaterial {
}

export interface TipoMaterialInterface {
    getViewTipoMaterial(params: any): Promise<TipoMaterialView | undefined>
    listTipoMaterialPaginate(params: TipoMaterialSearch): Promise<any>
    AsyncListTipoMaterial(params: TipoMaterialSearch): Promise<TipoMaterialModel[] | undefined>
    createTipoMaterial(params: TipoMaterialModel): Promise<any>
    editTipoMaterial(params: TipoMaterialModel): Promise<any>
    deleteTipoMaterial(id: number): Promise<any>
}

export const TipoMaterialDefaultValues: TipoMaterialModel = {
    id: null,
    tipo_material_id: null,
    descricao: null,
}
