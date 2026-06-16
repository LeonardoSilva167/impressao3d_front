import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import {
    AnaliseComprasApiResponse,
    AnaliseComprasInterface,
    AnaliseComprasResponse,
    AnaliseComprasSearch,
} from "interfaces/AnaliseCompras/AnaliseComprasInterface"
import {
    normalizarAnaliseComprasResponse,
    sanitizeAnaliseComprasFilters,
} from "pages/Pages/AnaliseCompras/hooks/useAnaliseComprasPeriodo"

export class AnaliseComprasService implements AnaliseComprasInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'analise-compras'
        this.httpClient = new AxiosHttpClient()
    }

    async getAnaliseCompras(params: AnaliseComprasSearch): Promise<AnaliseComprasResponse | undefined> {
        try {
            const response = await this.httpClient.get<AnaliseComprasApiResponse>({
                url: `${this.url}/analise`,
                body: sanitizeAnaliseComprasFilters(params),
            })

            if (!response || !response.statusCode) throw new UnexpectedError()

            switch (response.statusCode) {
                case HttpStatusCode.ok:
                    return normalizarAnaliseComprasResponse(response.body)
                case HttpStatusCode.unauthorized:
                    throw new AccessDeniedError()
                default:
                    throw new UnexpectedError()
            }
        } catch (error) {
            console.error('Erro ao buscar análise de compras:', error)
            throw error
        }
    }
}
