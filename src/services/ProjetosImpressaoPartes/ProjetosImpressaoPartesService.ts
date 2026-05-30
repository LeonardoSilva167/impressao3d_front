import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'

const extrairIdResposta = (body: Record<string, any>, chave: string): number | undefined => {
    const payload = body?.[chave] ?? body
    const data = payload?.data ?? payload
    const id = data?.id

    if (id == null || Number.isNaN(Number(id))) {
        return undefined
    }

    return Number(id)
}

export class ProjetosImpressaoPartesService {
    private readonly url = 'projetos-impressao-partes'
    private readonly httpClient = new AxiosHttpClient()

    async createParte(params: ParteProjetoImpressaoModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: `${this.url}/cadastrar`,
            body: params,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return extrairIdResposta(response.body as Record<string, any>, 'projetoImpressaoParte')
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError(response.message)
        }
    }

    async editParte(params: ParteProjetoImpressaoModel) {
        const response = await this.httpClient.put({
            url: `${this.url}/editar`,
            body: params,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return response.body
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError(response.message)
        }
    }

    async deleteParte(id: number) {
        const response = await this.httpClient.delete({
            url: `${this.url}/excluir/${id}`,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
            case HttpStatusCode.noContent:
                return response.body
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError(response.message)
        }
    }
}
