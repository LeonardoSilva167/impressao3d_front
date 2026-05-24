import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    EstoqueInterface,
    FinalizarCarretelModel,
    LotesList,
    LotesSearch,
    LotesView,
    RegistrarConsumoModel,
} from "interfaces/Estoque/EstoqueInterface"

export class EstoqueService implements EstoqueInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'estoque'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewLote(params: { id: number }): Promise<LotesView | undefined> {
        const response = await this.httpClient.get<LotesView>({
            url: `${this.url}/lotes/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listLotesPaginate(params: LotesSearch): Promise<PaginateInterface<LotesList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<LotesList>>({
                url: `${this.url}/lotes`,
                body: params
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: return response.body
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error('Erro ao buscar lotes:', error)
            throw error
        }
    }

    async finalizarCarretel(params: FinalizarCarretelModel) {
        const response = await this.httpClient.post({
            url: `${this.url}/finalizar-carretel`,
            body: {
                id_filamento: params.id_filamento,
                gramatura: params.gramatura,
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

    async registrarConsumo(params: RegistrarConsumoModel) {
        const response = await this.httpClient.post({
            url: `${this.url}/registrar-consumo`,
            body: {
                id_item: params.id_item,
                quantidade: params.quantidade,
                motivo: params.motivo,
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
}
