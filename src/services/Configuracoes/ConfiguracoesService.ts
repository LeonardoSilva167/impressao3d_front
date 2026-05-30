import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import {
    ConfiguracoesInterface,
    ConfiguracoesModel,
    ConfiguracoesView,
} from 'interfaces/Configuracoes/ConfiguracoesInterface'

export class ConfiguracoesService implements ConfiguracoesInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'configuracoes'
        this.httpClient = new AxiosHttpClient()
    }

    async getConfiguracoes(): Promise<ConfiguracoesView | undefined> {
        const response = await this.httpClient.get<ConfiguracoesView>({
            url: `${this.url}/listar/1`,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async editConfiguracoes(params: ConfiguracoesModel) {
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
}
