export interface PlataformasCompraSearch {
    id?: string | undefined | null
    plataforma_compra_id?: string | undefined | null
    descricao?: string | undefined | null
    url?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface PlataformasCompraView {
    id?: number | undefined
    descricao?: string
    url?: string
}

export interface PlataformasCompraList {
    id?: number | undefined
    descricao?: string
    url?: string
}

export interface PlataformasCompraModel {
    id?: string | undefined | null
    plataforma_compra_id?: string | undefined | null
    descricao: string | undefined | null
    url?: string | undefined | null
}

export interface LookupsPlataformasCompra {
}

export interface PlataformasCompraInterface {
    getViewPlataformasCompra(params: any): Promise<PlataformasCompraView | undefined>
    listPlataformasCompraPaginate(params: PlataformasCompraSearch): Promise<any>
    AsyncListPlataformasCompra(params: PlataformasCompraSearch): Promise<PlataformasCompraModel[] | undefined>
    createPlataformasCompra(params: PlataformasCompraModel): Promise<any>
    editPlataformasCompra(params: PlataformasCompraModel): Promise<any>
    deletePlataformasCompra(id: number): Promise<any>
}

export const PlataformasCompraDefaultValues: PlataformasCompraModel = {
    id: null,
    plataforma_compra_id: null,
    descricao: null,
    url: null,
}
