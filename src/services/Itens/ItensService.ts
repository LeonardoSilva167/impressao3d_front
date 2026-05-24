import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    ItensInterface,
    ItensLookup,
    ItensLookupSearch,
    ItensModel,
    ItensSearch,
    ItensView,
    ItensList,
} from "interfaces/Itens/ItensInterface"

export class ItensService implements ItensInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'itens'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewItens(params: any): Promise<ItensView | undefined> {
        const response = await this.httpClient.get<ItensView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listItensPaginate(params: ItensSearch): Promise<PaginateInterface<ItensList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ItensList>>({
                url: this.url + '/listar',
                body: params
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: return response.body
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error(`Erro ao buscar itens:`, error)
            throw error
        }
    }

    async AsyncListItens(params: ItensSearch): Promise<ItensModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/itens-list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async lookupItens(params: ItensLookupSearch): Promise<ItensLookup[] | undefined> {
        const response = await this.httpClient.get<ItensLookup[]>({
            url: this.url + '/lookups',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createItens(params: ItensModel) {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar', body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editItens(params: ItensModel) {
        const response = await this.httpClient.put({
            url: this.url + '/editar', body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteItens(id: number) {
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
