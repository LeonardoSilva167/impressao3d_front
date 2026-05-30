import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { LookupsProdutos } from 'interfaces/Produtos/ProdutosInterface'
import {
    ProdutoVariacaoSyncModel,
    ProdutoVariacaoSyncResult,
} from 'interfaces/Produtos/ProdutoVariacaoInterface'

export class ProdutoVariacoesService {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'produto-variacoes'
        this.httpClient = new AxiosHttpClient()
    }

    async getLookups(): Promise<LookupsProdutos | undefined> {
        const response = await this.httpClient.get<LookupsProdutos>({
            url: `${this.url}/lookups`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async syncVariacoes(params: ProdutoVariacaoSyncModel): Promise<ProdutoVariacaoSyncResult | undefined> {
        const response = await this.httpClient.post({
            url: `${this.url}/cadastrar`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.produtoVariacao) ? body.produtoVariacao : body
                const data = (payload && payload.data) ? payload.data : payload
                return data as ProdutoVariacaoSyncResult
            }
            case HttpStatusCode.noContent: return undefined
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteVariacao(id: number): Promise<void> {
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
