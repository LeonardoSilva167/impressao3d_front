import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    MovimentacoesEstoqueInterface,
    MovimentacoesEstoqueSearch,
    MovimentacoesEstoqueView,
    MovimentacoesEstoqueList,
} from "interfaces/MovimentacoesEstoque/MovimentacoesEstoqueInterface"

export class MovimentacoesEstoqueService implements MovimentacoesEstoqueInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'movimentacoes-estoque'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewMovimentacoesEstoque(params: any): Promise<MovimentacoesEstoqueView | undefined> {
        const response = await this.httpClient.get<MovimentacoesEstoqueView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listMovimentacoesEstoquePaginate(params: MovimentacoesEstoqueSearch): Promise<PaginateInterface<MovimentacoesEstoqueList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<MovimentacoesEstoqueList>>({
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
            console.error('Erro ao buscar movimentações de estoque:', error)
            throw error
        }
    }
}
