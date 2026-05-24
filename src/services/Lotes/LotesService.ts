import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    LotesInterface,
    LotesSearch,
    LotesView,
    LotesList,
} from "interfaces/Lotes/LotesInterface"

export class LotesService implements LotesInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'lotes'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewLotes(params: any): Promise<LotesView | undefined> {
        const response = await this.httpClient.get<LotesView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listLotesPaginate(params: LotesSearch): Promise<PaginateInterface<LotesList> | undefined> {
        return this.fetchPaginate('/listar', params)
    }

    async listLotesAtivosPaginate(params: LotesSearch): Promise<PaginateInterface<LotesList> | undefined> {
        return this.fetchPaginate('/listar-ativos', params)
    }

    async listLotesZeradosPaginate(params: LotesSearch): Promise<PaginateInterface<LotesList> | undefined> {
        return this.fetchPaginate('/listar-zerados', params)
    }

    private async fetchPaginate(endpoint: string, params: LotesSearch): Promise<PaginateInterface<LotesList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<LotesList>>({
                url: this.url + endpoint,
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
}
