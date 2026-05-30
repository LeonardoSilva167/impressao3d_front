import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    LinhasProdutosInterface,
    LinhasProdutosModel,
    LinhasProdutosSearch,
    LinhasProdutosView,
    LinhasProdutosList,
} from "interfaces/LinhasProdutos/LinhasProdutosInterface"

export class LinhasProdutosService implements LinhasProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'linhas-produtos'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewLinhasProdutos(params: any): Promise<LinhasProdutosView | undefined> {
        const response = await this.httpClient.get<LinhasProdutosView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listLinhasProdutosPaginate(params: LinhasProdutosSearch): Promise<PaginateInterface<LinhasProdutosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<LinhasProdutosList>>({
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
            console.error('Erro ao buscar linhas-produtos:', error)
            throw error
        }
    }

    async AsyncListLinhasProdutos(params: LinhasProdutosSearch): Promise<LinhasProdutosModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/linhas-produtos-list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createLinhasProdutos(params: LinhasProdutosModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar', body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.linhaProduto) ? body.linhaProduto : body
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

    async editLinhasProdutos(params: LinhasProdutosModel) {
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

    async deleteLinhasProdutos(id: number) {
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
