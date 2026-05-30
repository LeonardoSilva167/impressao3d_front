import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    PartesBaseProdutosInterface,
    PartesBaseProdutosModel,
    PartesBaseProdutosSearch,
    PartesBaseProdutosView,
    PartesBaseProdutosList,
} from "interfaces/PartesBaseProdutos/PartesBaseProdutosInterface"

export class PartesBaseProdutosService implements PartesBaseProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'partes-base-produtos'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewPartesBaseProdutos(params: any): Promise<PartesBaseProdutosView | undefined> {
        const response = await this.httpClient.get<PartesBaseProdutosView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listPartesBaseProdutosPaginate(params: PartesBaseProdutosSearch): Promise<PaginateInterface<PartesBaseProdutosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<PartesBaseProdutosList>>({
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
            console.error('Erro ao buscar partes-base-produtos:', error)
            throw error
        }
    }

    async AsyncListPartesBaseProdutos(params: PartesBaseProdutosSearch): Promise<PartesBaseProdutosModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/partes-base-produtos-list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createPartesBaseProdutos(params: PartesBaseProdutosModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar', body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.parteBase) ? body.parteBase : body
                const data = (payload && payload.data) ? payload.data : payload
                const id = data && data.id
                return id != null ? Number(id) : undefined
            }
            case HttpStatusCode.noContent: return undefined
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editPartesBaseProdutos(params: PartesBaseProdutosModel) {
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

    async deletePartesBaseProdutos(id: number) {
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
