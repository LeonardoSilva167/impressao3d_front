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
    LoteConsumoApi,
    LoteConsumoInfo,
    LotesConsumoResponse,
    LotesConsumoResult,
    LotesConsumoSearch,
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

    async getLotesConsumo(params: LotesConsumoSearch): Promise<LotesConsumoResult> {
        const query = new URLSearchParams({
            id_item: String(params.id_item),
            gramatura: String(params.gramatura),
            quantidade: String(params.quantidade),
        }).toString()

        const response = await this.httpClient.get<{
            data?: LotesConsumoResponse | LoteConsumoApi[]
            estoque_insuficiente?: boolean
        } | LotesConsumoResponse | LoteConsumoApi[]>({
            url: `${this.url}/lotes-consumo?${query}`,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return this.mapLotesConsumo(response.body)
            case HttpStatusCode.invalidForm:
                return { lotes: [], estoqueInsuficiente: true }
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            default:
                throw new UnexpectedError(response.message)
        }
    }

    private mapLotesConsumo(body: unknown): LotesConsumoResult {
        if (!body) {
            return { lotes: [], estoqueInsuficiente: false }
        }

        if (!Array.isArray(body) && typeof body === 'object' && (body as { estoque_insuficiente?: boolean }).estoque_insuficiente === true) {
            return { lotes: [], estoqueInsuficiente: true }
        }

        const lotesApi = this.extractLotesApi(body)

        if (!Array.isArray(body) && typeof body === 'object') {
            const envelope = body as { data?: unknown; estoque_insuficiente?: boolean }
            const payload = envelope.data && typeof envelope.data === 'object' && !Array.isArray(envelope.data)
                ? envelope.data as LotesConsumoResponse
                : null

            if (payload?.estoque_insuficiente === true) {
                return { lotes: [], estoqueInsuficiente: true }
            }
        }

        return {
            lotes: lotesApi.map((item) => this.mapLoteConsumo(item)),
            estoqueInsuficiente: false,
        }
    }

    private extractLotesApi(body: unknown): LoteConsumoApi[] {
        if (Array.isArray(body)) {
            return body as LoteConsumoApi[]
        }

        if (!body || typeof body !== 'object') {
            return []
        }

        const envelope = body as {
            data?: LoteConsumoApi[] | LotesConsumoResponse | Record<string, LoteConsumoApi>
            lotes?: LoteConsumoApi[]
            compra?: unknown
            saldo_atual?: unknown
        }

        if (Array.isArray(envelope.data)) {
            return envelope.data
        }

        if (envelope.data && typeof envelope.data === 'object') {
            const data = envelope.data as LotesConsumoResponse & Record<string, LoteConsumoApi>
            if (Array.isArray(data.lotes)) {
                return data.lotes
            }
            return Object.values(data).filter(
                (item): item is LoteConsumoApi => Boolean(item && typeof item === 'object' && ('compra' in item || 'saldo_atual' in item))
            )
        }

        if (Array.isArray(envelope.lotes)) {
            return envelope.lotes
        }

        if ('compra' in envelope || 'saldo_atual' in envelope) {
            return [envelope as LoteConsumoApi]
        }

        return []
    }

    private mapLoteConsumo(item: LoteConsumoApi): LoteConsumoInfo {
        const { lote } = item
        const compraRaw = item.compra
        const compraObj = compraRaw != null && typeof compraRaw === 'object' ? compraRaw : undefined
        const compraId = compraObj?.id
            ?? (compraRaw != null && compraRaw !== '' ? Number(compraRaw) : undefined)

        const saldoAtual = item.saldo_atual ?? lote?.qtd_atual
        const quantidadeConsumida = item.quantidade_consumida ?? item.qtd_consumida ?? item.qtd_consumir
        const saldoRestante = item.saldo_restante ?? item.saldo_apos_consumo ?? item.saldo_final
        const valorUnitario = item.valor_unitario ?? item.valor_unitario_real ?? lote?.valor_unitario_real

        const plataformaDescricao = typeof item.plataforma === 'string'
            ? item.plataforma
            : compraObj?.plataforma?.descricao

        const dataCompra = item.data_compra ?? compraObj?.data_compra

        return {
            id_compra_item: item.id_compra_item,
            id_compra: Number.isFinite(compraId) ? compraId : undefined,
            compra_descricao: compraId != null && !Number.isNaN(Number(compraId))
                ? `Compra #${compraId}`
                : undefined,
            numero_pedido: compraObj?.numero_pedido,
            plataforma_descricao: plataformaDescricao,
            data_compra: dataCompra,
            saldo_atual: saldoAtual != null ? Number(saldoAtual) : undefined,
            quantidade_consumida: quantidadeConsumida != null ? Number(quantidadeConsumida) : undefined,
            saldo_restante: saldoRestante != null ? Number(saldoRestante) : undefined,
            valor_unitario: valorUnitario != null ? Number(valorUnitario) : undefined,
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
