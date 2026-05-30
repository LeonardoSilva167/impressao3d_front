import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'
import {
    LookupsProdutos,
    ProdutosInterface,
    ProdutosList,
    ProdutosModel,
    ProdutosSearch,
    ProdutosView,
} from 'interfaces/Produtos/ProdutosInterface'

export class ProdutosService implements ProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'produtos'
        this.httpClient = new AxiosHttpClient()
    }

    async getLookupsProdutos(): Promise<LookupsProdutos | undefined> {
        const response = await this.httpClient.get<LookupsProdutos>({
            url: `${this.url}/lookups`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewProdutos(params: { id: number }): Promise<ProdutosView | undefined> {
        const response = await this.httpClient.get<ProdutosView>({
            url: `${this.url}/listar/${params.id}`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listProdutosPaginate(params: ProdutosSearch): Promise<PaginateInterface<ProdutosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ProdutosList>>({
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
            console.error('Erro ao buscar produtos:', error)
            throw error
        }
    }

    async createProdutos(params: ProdutosModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: `${this.url}/cadastrar`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.produtoBase) ? body.produtoBase : body
                const data = (payload && payload.data) ? payload.data : payload
                const id = data && data.id
                if (id == null || Number.isNaN(Number(id))) return undefined
                return Number(id)
            }
            case HttpStatusCode.noContent: return undefined
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editProdutos(params: ProdutosModel): Promise<void> {
        const response = await this.httpClient.put({
            url: `${this.url}/editar`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok:
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteProdutos(id: number): Promise<void> {
        const response = await this.httpClient.delete({
            url: `${this.url}/excluir/${id}`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok:
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }
}
