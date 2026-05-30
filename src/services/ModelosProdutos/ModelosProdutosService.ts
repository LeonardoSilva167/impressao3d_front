import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    ModelosProdutosInterface,
    ModelosProdutosModel,
    ModelosProdutosSearch,
    ModelosProdutosView,
    ModelosProdutosList,
} from "interfaces/ModelosProdutos/ModelosProdutosInterface"

export class ModelosProdutosService implements ModelosProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'modelos-produtos'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewModelosProdutos(params: any): Promise<ModelosProdutosView | undefined> {
        const response = await this.httpClient.get<ModelosProdutosView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listModelosProdutosPaginate(params: ModelosProdutosSearch): Promise<PaginateInterface<ModelosProdutosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ModelosProdutosList>>({
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
            console.error('Erro ao buscar modelos-produtos:', error)
            throw error
        }
    }

    async AsyncListModelosProdutos(params: ModelosProdutosSearch): Promise<ModelosProdutosModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/modelos-produtos-list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createModelosProdutos(params: ModelosProdutosModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar', body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.modeloProduto) ? body.modeloProduto : body
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

    async editModelosProdutos(params: ModelosProdutosModel) {
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

    async deleteModelosProdutos(id: number) {
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
