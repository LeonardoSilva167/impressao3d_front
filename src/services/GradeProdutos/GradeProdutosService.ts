import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'
import {
    GerarGradePayload,
    GradeProdutosCarregarDados,
    GradeProdutosInterface,
    GradeProdutosList,
    GradeProdutosModel,
    GradeProdutosSearch,
    GradeProdutosView,
    GradeProdutoGeradoList,
    GradeProdutoGeradoView,
} from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { carregarCustosProducaoConfig } from 'hooks/useCustosProducaoConfig'
import {
    mapCarregarDadosGrade,
    mapProdutoGeradoListApi,
    normalizarViewGradeProdutos,
} from 'pages/Pages/GradeProdutos/hooks/useGradeProdutos'

export class GradeProdutosService implements GradeProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'grades-produtos'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewGradeProdutos(params: { id: number }): Promise<GradeProdutosView | undefined> {
        const response = await this.httpClient.get<GradeProdutosView>({
            url: `${this.url}/listar/${params.id}`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                if (!response.body) return undefined
                return normalizarViewGradeProdutos(response.body)
            }
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewProdutoGerado(params: { id: number }): Promise<GradeProdutoGeradoView | undefined> {
        const response = await this.httpClient.get<GradeProdutoGeradoView>({
            url: `${this.url}/produto/${params.id}`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listGradeProdutosPaginate(
        params: GradeProdutosSearch
    ): Promise<PaginateInterface<GradeProdutosList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<GradeProdutosList>>({
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
            console.error('Erro ao buscar grades de produtos:', error)
            throw error
        }
    }

    async listProdutosGeradosPaginate(
        params: GradeProdutosSearch
    ): Promise<PaginateInterface<GradeProdutoGeradoList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<Record<string, unknown>>>({
                url: `${this.url}/listar`,
                body: params,
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: {
                    if (!response.body) return undefined
                    const config = await carregarCustosProducaoConfig()
                    const body = response.body
                    return {
                        ...body,
                        data: (body.data || []).map((item) =>
                            mapProdutoGeradoListApi(item, config)
                        ),
                    }
                }
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error('Erro ao buscar produtos gerados:', error)
            throw error
        }
    }

    async carregarDados(
        params: { id_produto_base: number | string }
    ): Promise<GradeProdutosCarregarDados | undefined> {
        const response = await this.httpClient.get<GradeProdutosCarregarDados>({
            url: `${this.url}/carregar-dados`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return mapCarregarDadosGrade(response.body)
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async gerarGrade(params: GerarGradePayload): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: `${this.url}/gerar-grade`,
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: {
                const body = response.body as Record<string, any>
                const payload = (body && body.gradeProduto)
                    ? body.gradeProduto
                    : ((body && body.grade) ? body.grade : body)
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

    async editGradeProdutos(params: GradeProdutosModel) {
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

    async deleteGradeProdutos(id: number) {
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
