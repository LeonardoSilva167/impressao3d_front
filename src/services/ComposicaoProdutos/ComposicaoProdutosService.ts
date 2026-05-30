import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'
import {
    CarregarComposicaoParams,
    ComposicaoProdutosInterface,
    ComposicaoProdutosList,
    ComposicaoProdutosModel,
    ComposicaoProdutosSearch,
    ComposicaoProdutosView,
} from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'

export class ComposicaoProdutosService implements ComposicaoProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'composicao-produtos'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewComposicaoProdutos(params: { id: number }): Promise<ComposicaoProdutosView | undefined> {
        const response = await this.httpClient.get<ComposicaoProdutosView>({
            url: `${this.url}/listar/${params.id}`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listComposicaoProdutosPaginate(
        params: ComposicaoProdutosSearch
    ): Promise<PaginateInterface<ComposicaoProdutosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ComposicaoProdutosList>>({
                url: `${this.url}/listar`,
                body: params,
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: return response.body
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error('Erro ao buscar composição de produtos:', error)
            throw error
        }
    }

    async carregarComposicao(params: CarregarComposicaoParams): Promise<ComposicaoProdutosView | undefined> {
        const response = await this.httpClient.get<ComposicaoProdutosView>({
            url: `${this.url}/carregar-composicao`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createComposicaoProdutos(params: ComposicaoProdutosModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: `${this.url}/cadastrar`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.composicaoProduto)
                    ? body.composicaoProduto
                    : ((body && body.composicao) ? body.composicao : body)
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

    async editComposicaoProdutos(params: ComposicaoProdutosModel) {
        const response = await this.httpClient.put({
            url: `${this.url}/editar`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteComposicaoProdutos(id: number) {
        const response = await this.httpClient.delete({
            url: `${this.url}/excluir/${id}`,
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
