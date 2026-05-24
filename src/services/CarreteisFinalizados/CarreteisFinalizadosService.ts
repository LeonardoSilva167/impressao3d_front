import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    CarreteisFinalizadosInterface,
    CarreteisFinalizadosList,
    CarreteisFinalizadosListApi,
    CarreteisFinalizadosModel,
    CarreteisFinalizadosSearch,
    CarreteisFinalizadosView,
    LoteMaisAntigoInfo,
    LoteMaisAntigoResponse,
} from "interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface"

export class CarreteisFinalizadosService implements CarreteisFinalizadosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'carreteis-finalizados'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewCarreteisFinalizados(params: { id: number }): Promise<CarreteisFinalizadosView | undefined> {
        const response = await this.httpClient.get<{ data?: CarreteisFinalizadosListApi } | CarreteisFinalizadosListApi>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return this.mapViewItem(response.body)
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listCarreteisFinalizadosPaginate(
        params: CarreteisFinalizadosSearch
    ): Promise<PaginateInterface<CarreteisFinalizadosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<CarreteisFinalizadosListApi>>({
                url: this.url + '/listar',
                body: params
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: {
                    const body = response.body
                    if (!body) return undefined
                    return {
                        ...body,
                        data: (body.data || []).map((item) => this.mapListItem(item)),
                    }
                }
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error('Erro ao buscar carretéis finalizados:', error)
            throw error
        }
    }

    private mapListItem(item: CarreteisFinalizadosListApi): CarreteisFinalizadosList {
        return {
            id: item.id,
            id_item: item.item?.id ?? item.filamento?.id,
            item_descricao: item.filamento?.resumo ?? item.item?.descricao ?? item.item?.codigo,
            gramatura: item.gramatura,
            quantidade: item.quantidade,
            total_consumido: item.qtd_total_consumida != null ? Number(item.qtd_total_consumida) : undefined,
            data_finalizacao: item.data_finalizacao,
            usuario_descricao: this.mapUsuarioDescricao(item.usuario),
            observacao: item.observacao ?? undefined,
        }
    }

    private mapViewItem(body: { data?: CarreteisFinalizadosListApi } | CarreteisFinalizadosListApi | undefined): CarreteisFinalizadosView | undefined {
        if (!body) return undefined

        const item = 'data' in body && body.data ? body.data : body as CarreteisFinalizadosListApi
        const mapped = this.mapListItem(item)
        const movimentacao = (item as any).movimentacoes?.[0]
        const lote = movimentacao?.lote
        const compra = lote?.compra

        return {
            ...mapped,
            compra_descricao: compra?.id ? `Compra #${compra.id}` : undefined,
            numero_pedido: compra?.numero_pedido,
            plataforma_descricao: compra?.plataforma?.descricao,
            data_compra: compra?.data_compra,
            qtd_original: lote?.qtd_original != null ? Number(lote.qtd_original) : undefined,
            qtd_atual: lote?.qtd_atual != null ? Number(lote.qtd_atual) : undefined,
            valor_unitario: lote?.valor_unitario_real != null ? Number(lote.valor_unitario_real) : undefined,
        }
    }

    private mapUsuarioDescricao(usuario: CarreteisFinalizadosListApi['usuario']): string | undefined {
        if (!usuario) return undefined
        return usuario.nome ?? usuario.descricao ?? usuario.name
    }

    async getLoteMaisAntigo(idItem: number): Promise<LoteMaisAntigoInfo | undefined> {
        const response = await this.httpClient.get<{ data?: LoteMaisAntigoResponse; error?: boolean; message?: string } | LoteMaisAntigoResponse>({
            url: `${this.url}/lote-mais-antigo/${idItem}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return this.mapLoteMaisAntigo(response.body)
            case HttpStatusCode.invalidForm: return undefined
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    private mapLoteMaisAntigo(body: { data?: LoteMaisAntigoResponse } | LoteMaisAntigoResponse | undefined): LoteMaisAntigoInfo | undefined {
        if (!body) return undefined

        const payload = 'data' in body && body.data ? body.data : body as LoteMaisAntigoResponse
        if (!payload?.lote) return undefined

        const { lote, compra } = payload

        return {
            id: lote.id,
            id_compra: compra?.id,
            compra_descricao: compra?.id ? `Compra #${compra.id}` : undefined,
            numero_pedido: compra?.numero_pedido,
            plataforma_descricao: compra?.plataforma?.descricao,
            data_compra: compra?.data_compra,
            qtd_original: lote.qtd_original != null ? Number(lote.qtd_original) : undefined,
            qtd_atual: lote.qtd_atual != null ? Number(lote.qtd_atual) : undefined,
            valor_unitario: lote.valor_unitario_real != null ? Number(lote.valor_unitario_real) : undefined,
        }
    }

    async createCarreteisFinalizados(params: CarreteisFinalizadosModel) {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar',
            body: {
                id_item: params.id_item,
                gramatura: params.gramatura,
                quantidade: params.quantidade,
                observacao: params.observacao,
            }
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editCarreteisFinalizados(params: CarreteisFinalizadosModel) {
        const response = await this.httpClient.put({
            url: this.url + '/editar',
            body: {
                id: params.id ?? params.carreteis_finalizados_id,
                id_item: params.id_item,
                gramatura: params.gramatura,
                quantidade: params.quantidade,
                observacao: params.observacao,
            }
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteCarreteisFinalizados(id: number) {
        const response = await this.httpClient.delete({
            url: this.url + '/excluir/' + id
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }
}
